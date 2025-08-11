export type Region = {
  id: number;
  short: string; // 연남동
  full: string; // 서울시 마포구 연남동
  keywords?: string[]; // 검색용 별칭
};

export const REGIONS: Region[] = [
  { id: 1, short: "연남동", full: "서울시 마포구 연남동" },
  { id: 2, short: "합정동", full: "서울시 마포구 합정동" },
  { id: 3, short: "망원동", full: "서울시 마포구 망원동" },
  { id: 4, short: "상수동", full: "서울시 마포구 상수동" },
  { id: 5, short: "종로 3가", full: "서울시 종로구 종로 3가" },
  { id: 6, short: "홍대입구", full: "서울시 마포구 홍대입구" }
];

// 파생 맵은 한 번만 생성
export const REGION_BY_FULL = new Map(REGIONS.map((r) => [r.full, r]));
export const ID_BY_FULL = new Map(REGIONS.map((r) => [r.full, r.id]));
export const ID_BY_SHORT = new Map(REGIONS.map((r) => [r.short, r.id]));
export const FULL_BY_SHORT = new Map(REGIONS.map((r) => [r.short, r.full]));
