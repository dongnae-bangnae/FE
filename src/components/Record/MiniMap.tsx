import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface MiniMapProps {
  latitude: number | null;
  longitude: number | null;
}

const MiniMap = ({ latitude, longitude }: MiniMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latitude == null || longitude == null) return;

    const existingScript = document.querySelector(
      "script[src^='https://dapi.kakao.com/v2/maps/sdk.js']"
    );

    const loadMap = () => {
      if (!window.kakao || !window.kakao.maps) return;

      window.kakao.maps.load(() => {
        if (mapRef.current) {
          const center = new window.kakao.maps.LatLng(Number(latitude), Number(longitude));
          const map = new window.kakao.maps.Map(mapRef.current, {
            center,
            level: 5,
          });

          new window.kakao.maps.Marker({
            map,
            position: center,
          });
        }
      });
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAP_KEY
      }&autoload=false`;
      script.async = true;
      script.onload = loadMap;
      document.head.appendChild(script);
    } else {
      loadMap(); // 이미 있으면 바로 로드
    }
  }, [latitude, longitude]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default MiniMap;
