import { useEffect, useRef, useState } from "react";
import SearchMapBar from "../components/common/SearchMapBar";
import PinInfoModal from "../components/PinInfoModal";
import { useFetchPlacesWithinBounds } from "../hooks/queries/useFetchPlacesWithinBounds";
import { Place } from "../types/place";
import { getPinImageSrc } from "../utils/getPinImageSrc";
import pinMe from "../assets/pin/pin_me.png";
import { useMapViewStore } from "../stores/mapViewStore";

declare global {
	interface Window { kakao: any; }
}

function MapPage() {
	// References
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const markerRefList = useRef<any[]>([]);
	const meMarkerRef = useRef<any>(null);

	// Store
	const { center, setCenter } = useMapViewStore();

	// Local states
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
	const [isMapLoaded, setIsMapLoaded] = useState(false);
	const [currentLat, setCurrentLat] = useState<number | null>(center.lat);
	const [currentLng, setCurrentLng] = useState<number | null>(center.lng);

	const shouldFetch = currentLat !== null && currentLng !== null;
	const { data: places = [] } = useFetchPlacesWithinBounds(
		shouldFetch
			? {
				latMin: Number((currentLat! - 0.009).toFixed(5)),
				latMax: Number((currentLat! + 0.009).toFixed(5)),
				lngMin: Number((currentLng! - 0.0114).toFixed(5)),
				lngMax: Number((currentLng! + 0.0114).toFixed(5)),
			}
			: { latMin: 0, latMax: 0, lngMin: 0, lngMax: 0 },
		shouldFetch
	);

	// Kakao script loader (no-dup)
	useEffect(() => {
		const existing = document.querySelector('script[src*="dapi.kakao.com"]') as HTMLScriptElement | null;
		const initMap = (initLat: number, initLng: number) => {
			const locPosition = new window.kakao.maps.LatLng(initLat, initLng);
			const options = { center: locPosition, level: 3 };
			if (!mapContainerRef.current) return;
			mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, options);
			setIsMapLoaded(true);
		};

		const bootstrap = () => {
			window.kakao.maps.load(() => {
				if (center.lat !== null && center.lng !== null) {
					initMap(center.lat, center.lng);
					setCurrentLat(center.lat);
					setCurrentLng(center.lng);
					return;
				}
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							const lat = pos.coords.latitude;
							const lng = pos.coords.longitude;
							initMap(lat, lng);
							setCurrentLat(lat);
							setCurrentLng(lng);
							setCenter(lat, lng); // 첫 진입 시 스토어에도 기록
							// 내 위치 마커
							meMarkerRef.current = new window.kakao.maps.Marker({
								position: new window.kakao.maps.LatLng(lat, lng),
								map: mapRef.current,
								title: "현재 위치",
								image: new window.kakao.maps.MarkerImage(
									pinMe,
									new window.kakao.maps.Size(36, 36),
									{ offset: new window.kakao.maps.Point(18, 36) }
								),
							});
						},
						(err) => {
							alert("위치 정보를 불러올 수 없어요.");
							console.error(err);
						}
					);
				} else {
					alert("위치 정보를 지원하지 않습니다.");
				}
			});
		};

		if (existing) {
			if ((window as any).kakao && window.kakao.maps) {
				bootstrap();
			} else {
				existing.addEventListener("load", bootstrap, { once: true });
			}
			return;
		}

		const script = document.createElement("script");
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
		script.async = true;
		script.onload = bootstrap;
		document.head.appendChild(script);
	}, [center.lat, center.lng, setCenter]);

	// 마커 렌더링
	useEffect(() => {
		if (!mapRef.current || currentLat === null || currentLng === null) return;

		// 기존 마커 제거
		markerRefList.current.forEach((m) => m.setMap(null));
		markerRefList.current = [];

		// 새 마커 생성
		const newMarkers = places.map((place: Place) => {
			const imageSrc = getPinImageSrc(place.pinCategory);
			const image = new window.kakao.maps.MarkerImage(
				imageSrc,
				new window.kakao.maps.Size(36, 36),
				{ offset: new window.kakao.maps.Point(18, 36) }
			);

			const marker = new window.kakao.maps.Marker({
				position: new window.kakao.maps.LatLng(place.latitude, place.longitude),
				map: mapRef.current,
				title: place.title,
				image
			});

			window.kakao.maps.event.addListener(marker, "click", () => {
				if (selectedPlace?.placeId !== place.placeId) setSelectedPlace(place);
			});

			return marker;
		});

		markerRefList.current = newMarkers;
	}, [places, currentLat, currentLng, selectedPlace?.placeId]);

	return (
		<div className="w-full h-full relative">
			{isMapLoaded && mapRef.current && (
				<SearchMapBar
					map={mapRef.current}
					onChangeCenter={(lat, lng) => {
						setCurrentLat(lat);
						setCurrentLng(lng);
						setCenter(lat, lng); // 스토어 동기화
					}}
				/>
			)}
			<div ref={mapContainerRef} className="w-full h-[calc(100vh-60px)] border border-gray-200" />
			<PinInfoModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
		</div>
	);
}

export default MapPage;
