import { useEffect, useRef, useState } from "react";
import SearchMapBar from "../components/common/SearchMapBar";
import PinCategoryModal from "../components/common/PinCategoryModal";

declare global {
	interface Window {
		kakao: any;
	}
}

function NewPlacePage() {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const markerRef = useRef<any>(null);
	const lastClickedPositionRef = useRef<any>(null);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isMapLoaded, setIsMapLoaded] = useState(false);

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

	return (
		<div className="w-full h-screen relative">
			{isMapLoaded && mapRef.current && (
				<SearchMapBar map={mapRef.current} />
			)}
			<div
				ref={mapContainerRef}
				className="w-full h-full border border-gray-200"
			/>
			{isModalOpen && (
				<PinCategoryModal
					lastClickedPositionRef={lastClickedPositionRef}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
}

export default NewPlacePage;
