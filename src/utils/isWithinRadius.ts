export function isWithinRadius (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    radiusInMeters: number, // 반경 
): boolean {
    const R = 6371000; // 지구 반지름 (단위: 미터)
	const toRad = (deg: number) => (deg * Math.PI) / 180;

	const deltaLat = toRad(endLat - startLat);
	const deltaLng = toRad(endLng - startLng);

	const a =
		Math.sin(deltaLat / 2) ** 2 +
		Math.cos(toRad(startLat)) *
			Math.cos(toRad(endLat)) *
			Math.sin(deltaLng / 2) ** 2;

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = R * c;

	return distance <= radiusInMeters;
}