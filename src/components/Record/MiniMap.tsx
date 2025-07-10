// src/components/common/MiniMap.tsx
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface MiniMapProps {
  lat: number;
  lng: number;
}

const MiniMap = ({ lat, lng }: MiniMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapRef.current) {
          const center = new window.kakao.maps.LatLng(lat, lng);
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

    document.head.appendChild(script);
  }, [lat, lng]);

  return <div ref={mapRef} className="w-full h-full rounded-[10px]" />;
};

export default MiniMap;
