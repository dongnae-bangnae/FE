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
	// Refs
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const markerRefList = useRef<any[]>([]); // 주변 장소 핀
	const meMarkerRef = useRef<any>(null); // 내 위치 핀

	// Store
	const { center, setCenter } = useMapViewStore();

	// Local states
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
	const [isMapLoaded, setIsMapLoaded] = useState(false);
	const [currentLat, setCurrentLat] = useState<number | null>(null);
	const [currentLng, setCurrentLng] = useState<number | null>(null);

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

	useEffect(() => {
		const existing = document.querySelector('script[src*="dapi.kakao.com"]') as HTMLScriptElement | null;
		const initMap = (initLat: number, initLng: number) => {
			const locPosition = new window.kakao.maps.LatLng(initLat, initLng);
			const options = { center: locPosition, level: 3 };
			if (!mapContainerRef.current) return;
			mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, options);
			setCurrentLat(initLat);
			setCurrentLng(initLng);
			setIsMapLoaded(true);
		};

		const bootstrap = () => {
			window.kakao.maps.load(() => {
				if (center.lat !== null && center.lng !== null) {
					initMap(center.lat, center.lng);
					return;
				}
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							const lat = pos.coords.latitude;
							const lng = pos.coords.longitude;
							initMap(lat, lng);
							setCenter(lat, lng);
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
							alert("위치 정보를 불러올 수 없어요. 기본 위치로 설정합니다.");
							console.error(err);
							const defaultLat = 37.566826;
							const defaultLng = 126.9786567;
							initMap(defaultLat, defaultLng);
							setCenter(defaultLat, defaultLng);
						}
					);
				} else {
					alert("위치 정보를 지원하지 않습니다. 기본 위치로 설정합니다.");
					const defaultLat = 37.566826;
					const defaultLng = 126.9786567;
					initMap(defaultLat, defaultLng);
					setCenter(defaultLat, defaultLng);
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

		// 기존 마커 (장소 핀)만 제거
		markerRefList.current.forEach((m) => m.setMap(null));
		markerRefList.current = [];

		// 새 마커 (장소 핀) 생성
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
						setCenter(lat, lng);

					}}
				/>
			)}
			<div ref={mapContainerRef} className="w-full h-[calc(100vh-60px)] border border-gray-200" />
			<PinInfoModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
		</div>
	);
}

export default MapPage;