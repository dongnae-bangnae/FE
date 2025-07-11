import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchMapBar from "../components/common/SearchMapBar";
import { savedPlaces } from "../../src/dummyData/savedPlaces";

declare global {
  interface Window {
    kakao: any;
  }
}

function NewPlacePage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPlaceName, setPopupPlaceName] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }&libraries=services&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
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
                const map = new window.kakao.maps.Map(
                  mapContainerRef.current,
                  options
                );
                mapRef.current = map;

                // 현재 위치 마커
                const currentLocationMarker = new window.kakao.maps.Marker({
                  position: locPosition,
                  map,
                  title: "현재 위치",
                });

                // 현재 위치 마커 클릭 시
                window.kakao.maps.event.addListener(currentLocationMarker, "click", () => {
                  setPopupPlaceName(null);
                  setShowPopup(true);
                });

                // savedPlaces 마커
                Object.values(savedPlaces).forEach((placeList) => {
                  placeList.forEach((place) => {
                    const marker = new window.kakao.maps.Marker({
                      map,
                      position: new window.kakao.maps.LatLng(place.lat, place.lng),
                      title: place.name,
                    });

                    window.kakao.maps.event.addListener(marker, "click", () => {
                      setPopupPlaceName(place.name);
                      setShowPopup(true);
                    });
                  });
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
    <div className="w-full h-screen flex flex-col relative">
      {isMapLoaded && mapRef.current && (
        <SearchMapBar map={mapRef.current} />
      )}
      <div
        ref={mapContainerRef}
        className="w-full h-full"
      />

      {/* 팝업 */}
      {showPopup && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 
                        w-[271px] h-[174px] bg-[#FFC064] border-none rounded-xl px-6 py-4 text-center flex flex-col justify-between">
          <p className="text-sm mt-4 leading-relaxed">
            '{popupPlaceName ?? "해당 위치"}'에<br />
            핀을 등록하시겠습니까?
          </p>
          <div className="flex justify-center gap-4 mb-2">
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-white rounded-md w-[110px] h-[45px]"
            >
              취소
            </button>

            <button
              onClick={() =>
                navigate("/map/select-pin", { state: { name: popupPlaceName ?? "현재 위치" } })
              }
              className="px-4 py-2 bg-[#FF9700] rounded-md w-[110px] h-[45px]"
            >
              네
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default NewPlacePage;