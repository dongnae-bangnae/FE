import { useEffect, useRef, useState } from "react";
import SearchMapBar from "../components/common/SearchMapBar";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/common/ConfirmModal";

declare global {
	interface Window {
		kakao: any;
	}
}

function NewPlacePage() {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const markerRef = useRef<any>(null);
  const lastClickedPositionRef = useRef<any>(null); // 넘길 데이터 저장 
	
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isMapLoaded, setIsMapLoaded] = useState(false);
	const [popupPlaceName, setPopupPlaceName] = useState("해당 위치");

	const navigate = useNavigate(); 

	useEffect(() => {
		const script = document.createElement("script");
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
			import.meta.env.VITE_KAKAO_MAP_KEY
		}&autoload=false&libraries=services`;
		script.async = true;

		script.onload = () => {
			console.log("Kakao script loaded");
			window.kakao.maps.load(() => {
				console.log("Kakao maps loaded");
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
									},
								);

                window.kakao.maps.event.addListener(
					mapRef.current,
					"click",
					(MouseEvent:any) => {
                    const clickPosition = MouseEvent.latLng; 

                    if(!markerRef.current) {
						markerRef.current = new window.kakao.maps.Marker({
							position: clickPosition,
							map: mapRef.current,
							title: "선택한 위치",
							image: new window.kakao.maps.MarkerImage("/src/assets/pin/pin_addPlace.png",
							new window.kakao.maps.Size(36, 36), 
							{
								offset: new window.kakao.maps.Point(18, 36) 
							}
							)
						});
                    }
                    else {
						markerRef.current.setPosition(clickPosition);
                    }
                    lastClickedPositionRef.current = clickPosition;
					const geocoder = new window.kakao.maps.services.Geocoder();
                    geocoder.coord2Address(clickPosition.getLng(), clickPosition.getLat(), (result: any, status:any) => {
						if (status === window.kakao.maps.services.Status.OK) {
							const builidingName = result[0]?.road_address?.building_name?.trim();
							if (builidingName) {
								setPopupPlaceName(`${builidingName}`)
							} else {
								setPopupPlaceName("해당 위치");
							}
							setIsModalOpen(true) 
						}
					})
				})
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
			});
		};

		document.head.appendChild(script);
	}, []);

	const handleConfirm = () => {
    // const pos = lastClickedPositionRef.current;
    navigate('/map/select-pin');
    setIsModalOpen(false);
	}
	const handleCancel = () => {
		setIsModalOpen(false);
	};

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
				<ConfirmModal
					message={<span className="font-medium text-wrap">{popupPlaceName}에<br />핀을 등록하시겠습니까?</span>}
					onConfirm={handleConfirm}
					onCancel={handleCancel}
				/>
			)}
		</div>
	);
}
export default NewPlacePage;
