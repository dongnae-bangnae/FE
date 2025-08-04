import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PinInfoModal from "../components/PinInfoModal";
import { useFetchPlacesWithinBounds } from "../hooks/queries/useFetchPlacesWithinBounds";
import { Place } from "../types/place";
import { getPinImageSrc } from "../utils/getPinImageSrc";

declare global {
  interface Window {
    kakao: any;
  }
}

function SavedPlaceMapPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRefList = useRef<any[]>([]);

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [searchParams] = useSearchParams();
  const latMin = Number(searchParams.get("latMin"));
  const latMax = Number(searchParams.get("latMax"));
  const lngMin = Number(searchParams.get("lngMin"));
  const lngMax = Number(searchParams.get("lngMax"));

  const { data: places = [] } = useFetchPlacesWithinBounds(
    { latMin, latMax, lngMin, lngMax },
    true
  );

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const centerLat = (latMin + latMax) / 2;
        const centerLng = (lngMin + lngMax) / 2;
        const locPosition = new window.kakao.maps.LatLng(centerLat, centerLng);

        if (mapContainerRef.current) {
          mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, {
            center: locPosition,
            level: 3
          });
          setIsMapLoaded(true);
        }
      });
    };

    document.head.appendChild(script);
  }, [latMin, latMax, lngMin, lngMax]);

  useEffect(() => {
    if (!mapRef.current) return;

    // 기존 마커 제거
    markerRefList.current.forEach((marker) => marker.setMap(null));
    markerRefList.current = [];

    // 새 마커 생성
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
        setSelectedPlace(place);
      });

      return marker;
    });

    markerRefList.current = newMarkers;
  }, [places]);

  return (
    <div className="w-full h-full relative">
      <div
        ref={mapContainerRef}
        className="w-full h-[calc(100vh-60px)] border border-gray-200"
      />
      <PinInfoModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
}

export default SavedPlaceMapPage;
