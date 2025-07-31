import { useEffect, useRef, useState } from "react";
import SearchMapBar from "../components/common/SearchMapBar";
import PinCategoryModal from "../components/common/PinCategoryModal";
import { useLocation } from "react-router-dom";
import { useFetchPlacesWithinBounds } from "../hooks/queries/useFetchPlacesWithinBounds";
import { Place } from "../types/place";
import { getPinImageSrc } from "../utils/getPinImageSrc";

declare global {
	interface Window {
		kakao: any;
	}
}

function NewPlacePage() {
	// location 변수 
	const location = useLocation();
	const categoryName = location.state?.categoryName ?? "카테고리 미선택";
	const categoryColor = location.state?.categoryColor ?? "BLACK";

	// 지도 관련 
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const markerRef = useRef<any>(null);
	const lastClickedPositionRef = useRef<any>(null);
	const placeMarkersRef = useRef<any[]>([]); 
	
	// 상태 관련 
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isMapLoaded, setIsMapLoaded] = useState(false);
	const [detailAddress, setDetailAddress] = useState<string | null>(null);

	// 핀 조회용 현재 위치
	const [currentLat, setCurrentLat] = useState<number | null>(null);
	const [currentLng, setCurrentLng] = useState<number | null>(null);

	// 핀 조회
	const shouldFetch = currentLat !== null && currentLng !== null;
	const { data: places = [] } = useFetchPlacesWithinBounds(
		shouldFetch
			? {
				latMin: Number((currentLat! - 0.0045).toFixed(5)),
				latMax: Number((currentLat! + 0.0045).toFixed(5)),
				lngMin: Number((currentLng! - 0.0057).toFixed(5)),
				lngMax: Number((currentLng! + 0.0057).toFixed(5)),
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

							window.kakao.maps.event.addListener(
								mapRef.current,
								"click",
								(MouseEvent: any) => {
									const clickPosition = MouseEvent.latLng;
									console.log("선택한 위치 위도:", clickPosition.getLat());
									console.log("선택한 위치 경도:", clickPosition.getLng());
									if (!markerRef.current) {
										markerRef.current = new window.kakao.maps.Marker({
											position: clickPosition,
											map: mapRef.current,
											title: "선택한 위치",
											image: new window.kakao.maps.MarkerImage(
												"/src/assets/pin/pin_addPlace.svg",
												new window.kakao.maps.Size(36, 36),
												{
													offset: new window.kakao.maps.Point(18, 36),
												}
											),
										});
									} else {
										markerRef.current.setPosition(clickPosition);
									}
									lastClickedPositionRef.current = clickPosition;
									setIsModalOpen(true);
									fetchDetailAddress(clickPosition.getLat(), clickPosition.getLng());
								}
							);

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
			return;
		}

		const script = document.createElement("script");
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
			import.meta.env.VITE_KAKAO_MAP_KEY
		}&autoload=false&libraries=services`;
		script.async = true;

		script.onload = () => {
			window.kakao.maps.load(initMap);
		};

		document.head.appendChild(script);
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

			return new window.kakao.maps.Marker({
				position: new window.kakao.maps.LatLng(place.latitude, place.longitude),
				map: mapRef.current,
				image,
				title: place.title,
			});
		});

		placeMarkersRef.current = newMarkers;
	}, [places, currentLat, currentLng]);

		// 지번 주소 구하는 함수 
	const fetchDetailAddress = (lat: number, lng: number) => {
		const geocoder = new window.kakao.maps.services.Geocoder();
		geocoder.coord2Address(lng, lat, (result: any, status: any) => {
			if (status === window.kakao.maps.services.Status.OK) {
				const detailAddr = result[0].address?.address_name || null;
				setDetailAddress(detailAddr);
				console.log("지번 주소:", detailAddr);
			} else {
				console.warn("주소를 불러오지 못했어요.");
				setDetailAddress(null);
			}
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
					}} />
			)}
			<div
				ref={mapContainerRef}
				className="w-full h-full border border-gray-200"
			/>
			{isModalOpen && (
				<PinCategoryModal
					categoryId={location.state.categoryId}
					categoryName={categoryName}
					categoryColor={categoryColor}
					detailAddress={detailAddress!}
					lastClickedPositionRef={lastClickedPositionRef}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
}

export default NewPlacePage;
