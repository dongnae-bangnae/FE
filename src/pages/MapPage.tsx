import { useEffect } from "react";

// kakao 객체 타입 선언
declare global {
	interface Window {
		kakao: any;
	}
}

function MapPage() {
  useEffect(() => {
    const script = document.createElement("script");
		script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
			import.meta.env.VITE_KAKAO_MAP_KEY
		}&autoload=false&libraries=services`;
		script.async = true;

    script.onload = () => {
			window.kakao.maps.load(() => {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							const lat = position.coords.latitude;
							const lng = position.coords.longitude;
							const locPosition = new window.kakao.maps.LatLng(lat, lng);

							const container = document.getElementById("map");
							const options = {
								center: locPosition,
								level: 3,
							};

							new window.kakao.maps.Map(container, options);
						},
						(err) => {
							alert("위치 정보를 불러올 수 없어요. 위치 권한을 허용해주세요.");
							console.error(err);
						}
					);
				} else {
					alert("브라우저가 위치 정보를 지원하지 않습니다.");
				}
			});
		};

		document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full max-w-[375px] h-[calc(100vh-60px)]">
      <div id="map" className="w-full h-full rounded-lg border border-gray-200" />
    </div>
  );
}
export default MapPage;
