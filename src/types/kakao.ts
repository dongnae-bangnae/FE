export interface KakaoPlace {
	id: string; // 장소 고유 id
	place_name: string; // 장소 이름
	category_name: string;
	category_group_code: string;
	category_group_name: string;
	phone: string;
	address_name: string;
	road_address_name: string;
	x: string; // 경도 (longitude)
	y: string; // 위도 (latitude)
	place_url: string;
	distance: string; // 중심 좌표로부터 거리
}

export type KakaoSearchStatus = "OK" | "ZERO_RESULT" | "ERROR";
