import { useEffect, useRef, useState } from "react";
import SearchMapBar from "../components/common/SearchMapBar";
import PinCategoryModal from "../components/common/PinCategoryModal";
import { useFetchPlacesWithinBounds } from "../hooks/queries/useFetchPlacesWithinBounds";
import { Place } from "../types/place";
import { getPinImageSrc } from "../utils/getPinImageSrc";
import pinPick from "../assets/pin/pin_addPlace.svg";
import { usePinDraftStore } from "../stores/pinDraftStore";

declare global {
	interface Window {
		kakao: any;
	}
}

function NewPlacePage() {
	// 지도 관련
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const newPinMarkerRef = useRef<any>(null); // 새 핀 임시 마커
	const placeMarkersRef = useRef<any[]>([]);
	const mapClickHandlerRef = useRef<any>(null);

	// 상태 관련
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isMapLoaded, setIsMapLoaded] = useState(false);

	// 핀 조회용 현재 위치
	const [currentLat, setCurrentLat] = useState<number | null>(null);
	const [currentLng, setCurrentLng] = useState<number | null>(null);

	// 스토어 액션
	const { setNew, setExisting, reset } = usePinDraftStore();

	// 페이지 진입 시 이전 draft 초기화
	useEffect(() => {
		reset();
	}, [reset]);

	// 핀 조회
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
		const scriptAlreadyExists = document.querySelector(
			'script[src*="dapi.kakao.com"]'
		);

		const initMap = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const lat = position.coords.latitude;
						const lng = position.coords.longitude;
						setCurrentLat(lat);
						setCurrentLng(lng);
						const locPosition = new window.kakao.maps.LatLng(lat, lng);

						if (mapContainerRef.current) {
							mapRef.current = new window.kakao.maps.Map(
								mapContainerRef.current,
								{
									center: locPosition,
									level: 3,
								}
							);

							// 빈 곳 클릭 ⇒ 새 핀 등록
							const onMapClick = (evt: any) => {
								const clickPos = evt.latLng;

								// 새 핀 임시 마커 표시/업데이트
								if (!newPinMarkerRef.current) {
									newPinMarkerRef.current = new window.kakao.maps.Marker({
										position: clickPos,
										map: mapRef.current,
										title: "선택한 위치",
										image: new window.kakao.maps.MarkerImage(
											pinPick,
											new window.kakao.maps.Size(36, 36),
											{ offset: new window.kakao.maps.Point(18, 36) }
										),
									});
								} else {
									newPinMarkerRef.current.setPosition(clickPos);
								}

								// 역지오코딩 → store(setNew) → 모달
								reverseGeocode(clickPos.getLat(), clickPos.getLng(), (addr) => {
									if (!addr) return;
									setNew(addr, clickPos.getLat(), clickPos.getLng());
									setIsModalOpen(true);
								});
							};

							mapClickHandlerRef.current = onMapClick;
							window.kakao.maps.event.addListener(mapRef.current, "click", onMapClick);
							setIsMapLoaded(true);
						}
					},
					(err) => {
						alert("위치 정보를 불러올 수 없어요.");
						console.error(err);
					}
				);
			} else {
				alert("위치 정보를 지원하지 않습니다.");
			}
		};

		if (scriptAlreadyExists) {
			if (window.kakao?.maps) {
				window.kakao.maps.load(initMap);
			}
		} else {
			const script = document.createElement("script");
			script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
				import.meta.env.VITE_KAKAO_MAP_KEY
			}&autoload=false&libraries=services`;
			script.async = true;
			script.onload = () => {
				window.kakao.maps.load(initMap);
			};
			document.head.appendChild(script);
		}

		return () => {
			try {
				if (mapRef.current && mapClickHandlerRef.current) {
					window.kakao.maps.event.removeListener(
						mapRef.current,
						"click",
						mapClickHandlerRef.current
					);
				}
				placeMarkersRef.current.forEach((m) => m.setMap(null));
				if (newPinMarkerRef.current) newPinMarkerRef.current.setMap(null);
			} catch (e) {
				console.error(e);
			}
		};
	}, []);

	useEffect(() => {
		if (!mapRef.current) return;

		// 기존 마커 제거
		placeMarkersRef.current.forEach((marker) => marker.setMap(null));
		placeMarkersRef.current = [];

		// 새 마커 추가
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
				image,
				title: place.title,
			});

			// 등록된 핀 클릭 ⇒ existing 저장(placeId, detailAddress)
			window.kakao.maps.event.addListener(marker, "click", () => {
				const apply = (detailAddress: string) => {
					setExisting(place.placeId, detailAddress);
					setIsModalOpen(true);
				};

				if (place.address && place.address.trim()) {
					apply(place.address);
				} else {
					reverseGeocode(place.latitude, place.longitude, (addr) => {
						if (!addr) return;
						apply(addr);
					});
				}
			});

			return marker;
		});

		placeMarkersRef.current = newMarkers;
	}, [places, currentLat, currentLng]);

	const reverseGeocode = (
		lat: number,
		lng: number,
		cb: (addr: string | null) => void
	) => {
		const geocoder = new window.kakao.maps.services.Geocoder();
		geocoder.coord2Address(lng, lat, (result: any, status: any) => {
			const addr =
				status === window.kakao.maps.services.Status.OK
					? result[0]?.address?.address_name ?? null
					: null;
			cb(addr);
		});
	};

	return (
		<div className="w-full h-screen relative">
			{isMapLoaded && mapRef.current && (
				<SearchMapBar
					map={mapRef.current}
					onChangeCenter={(lat, lng) => {
						setCurrentLat(lat);
						setCurrentLng(lng);
					}}
				/>
			)}
			<div ref={mapContainerRef} className="w-full h-full border border-gray-200" />
			{isModalOpen && <PinCategoryModal onClose={() => setIsModalOpen(false)} />}
		</div>
	);
}

export default NewPlacePage;
