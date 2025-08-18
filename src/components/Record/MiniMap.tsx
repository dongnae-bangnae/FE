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

const EPS = 1e-6;
const eq = (a: number, b: number) => Math.abs(a - b) < EPS;

const MiniMap = ({ latitude, longitude }: MiniMapProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<any>(null);
	const markerRef = useRef<any>(null);

	useEffect(() => {
		const ensureLoaded = (cb: () => void) => {
			if (window.kakao?.maps) {
				window.kakao.maps.load(cb);
				return;
			}
			let script = document.querySelector<HTMLScriptElement>(
				"script[src^='https://dapi.kakao.com/v2/maps/sdk.js']"
			);
			if (!script) {
				script = document.createElement("script");
				script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_KEY}&autoload=false`;
				script.async = true;
				document.head.appendChild(script);
			}
			script.addEventListener("load", () => window.kakao.maps.load(cb), { once: true });
		};

		ensureLoaded(() => {
			if (!containerRef.current || mapRef.current) return;
			const lat = typeof latitude === "number" ? latitude : 37.5665;  
			const lng = typeof longitude === "number" ? longitude : 126.9780;

			const center = new window.kakao.maps.LatLng(lat, lng);
			const map = new window.kakao.maps.Map(containerRef.current, {
				center,
				level: 5
			});
			const marker = new window.kakao.maps.Marker({ map, position: center });

			mapRef.current = map;
			markerRef.current = marker;
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); 

	useEffect(() => {
		if (!mapRef.current || latitude == null || longitude == null) return;
		const map = mapRef.current;
		const marker = markerRef.current;

		const center = map.getCenter();
		const curLat = center.getLat();
		const curLng = center.getLng();

		if (!eq(curLat, latitude) || !eq(curLng, longitude)) {
			const next = new window.kakao.maps.LatLng(latitude, longitude);
			map.setCenter(next);
			if (marker) marker.setPosition(next);
		}
	}, [latitude, longitude]);

	return <div ref={containerRef} className="w-full h-full" />;
};

export default MiniMap;
