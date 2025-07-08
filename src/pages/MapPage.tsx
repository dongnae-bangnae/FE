import { useEffect, useRef, useState } from "react";
import SearchMapBar from "../components/common/SearchMapBar";

declare global {
	interface Window {
		kakao: any;
	}
}

function MapPage() {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const [isMapLoaded, setIsMapLoaded] = useState(false);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
			import.meta.env.VITE_KAKAO_MAP_KEY
		}&autoload=false`;
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

							const options = {
								center: locPosition,
								level: 3,
							};

							if (mapContainerRef.current) {
								mapRef.current = new window.kakao.maps.Map(
									mapContainerRef.current,
									options
								);
								new window.kakao.maps.Marker({
									position: locPosition,
									map: mapRef.current,
									title: "현재 위치",
								});
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

	return (
		<div className="w-full max-w-[375px] h-[calc(100vh-60px)]">
			{isMapLoaded && mapRef.current && (
				<SearchMapBar map={mapRef.current} />
			)}
			<div
				ref={mapContainerRef}
				className="w-full h-[calc(100vh-126px)] border border-gray-200"
			/>
		</div>
	);
}

export default MapPage;
