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
	const meMarkerRef = useRef<any>(null);   // 내 위치 핀(고정, 중심과 분리)

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

	// --- 유틸: 맵 생성, 내 위치 마커 생성 분리 ---
	function createMap(container: HTMLDivElement, lat: number, lng: number) {
		const center = new window.kakao.maps.LatLng(lat, lng);
		return new window.kakao.maps.Map(container, { center, level: 3 });
	}

	function placeMyLocationMarker(map: any, lat: number, lng: number) {
		const pos = new window.kakao.maps.LatLng(lat, lng);
		// 기존 내 위치 마커 제거
		if (meMarkerRef.current) meMarkerRef.current.setMap(null);

		meMarkerRef.current = new window.kakao.maps.Marker({
			position: pos,
			map,
			title: "현재 위치",
			image: new window.kakao.maps.MarkerImage(
				pinMe,
				new window.kakao.maps.Size(36, 36),
				{ offset: new window.kakao.maps.Point(18, 36) }
			),
			zIndex: 10000,
			clickable: false
		});
	}

	// 1) 지도 로더 + 초기화 (최초 마운트 시 1회)
	useEffect(() => {
		const existing = document.querySelector('script[src*="dapi.kakao.com"]') as HTMLScriptElement | null;

		const bootstrap = () => {
			window.kakao.maps.load(() => {
				const tryPlaceMyLocationMarker = () => {
					if (!navigator.geolocation || !mapRef.current) return;
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							const myLat = pos.coords.latitude;
							const myLng = pos.coords.longitude;
							placeMyLocationMarker(mapRef.current, myLat, myLng);
						},
						(err) => {
							console.warn("내 위치 마커를 표시할 수 없습니다:", err);
						},
						{ enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
					);
				};

				const initWith = (lat: number, lng: number) => {
					if (!mapContainerRef.current) return;
					mapRef.current = createMap(mapContainerRef.current, lat, lng);
					setIsMapLoaded(true);
					setCurrentLat(lat);
					setCurrentLng(lng);
					// 맵이 준비된 후에는 '항상' 실제 내 위치 마커를 별도로 시도
					tryPlaceMyLocationMarker();
				};

				// A) 저장된 center(복귀 시 시야 유지)가 있으면 그걸로 맵 생성
				if (center.lat !== null && center.lng !== null) {
					initWith(center.lat, center.lng);
					return;
				}

				// B) 아니면 지오로케이션으로 초기 맵 중심
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						(pos) => {
							const { latitude: lat, longitude: lng } = pos.coords;
							initWith(lat, lng);
							setCenter(lat, lng); // 첫 진입 기록
						},
						(err) => {
							alert("위치 정보를 불러올 수 없어요. 기본 위치로 설정합니다.");
							console.error(err);
							const defaultLat = 37.566826;
							const defaultLng = 126.9786567;
							initWith(defaultLat, defaultLng);
							setCenter(defaultLat, defaultLng);
						}
					);
				} else {
					alert("위치 정보를 지원하지 않습니다. 기본 위치로 설정합니다.");
					const defaultLat = 37.566826;
					const defaultLng = 126.9786567;
					initWith(defaultLat, defaultLng);
					setCenter(defaultLat, defaultLng);
				}
			});
		};

		// 스크립트 중복 로드 방지
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
	}, []); // 최초 1회

	// 2) 주변 장소 마커 렌더링 (데이터 변경 시마다)
	useEffect(() => {
		if (!mapRef.current || currentLat === null || currentLng === null) return;

		// 기존 주변 장소 마커만 제거 (내 위치 마커는 건드리지 않음)
		markerRefList.current.forEach((m) => m.setMap(null));
		markerRefList.current = [];

		// 새 주변 장소 마커 생성
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
						setCenter(lat, lng); // 시야 복원용(스토어)
						// 내 위치 마커는 건드리지 않음
					}}
				/>
			)}
			<div ref={mapContainerRef} className="w-full h-[calc(100vh-60px)] border border-gray-200" />
			<PinInfoModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
		</div>
	);
}

export default MapPage;