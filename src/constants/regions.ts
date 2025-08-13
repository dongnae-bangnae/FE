export type Region = {
  id: number;
  short: string; // 예: 연남동
  full: string; // 예: 서울시 마포구 연남동
  keywords?: string[]; // (옵션) 검색용 별칭
};

export const REGIONS: Region[] = [
  { id: 1, short: "연남동", full: "서울시 마포구 연남동" },
  { id: 2, short: "합정동", full: "서울시 마포구 합정동" },
  { id: 3, short: "망원동", full: "서울시 마포구 망원동" },
  { id: 4, short: "상수동", full: "서울시 마포구 상수동" },
  { id: 5, short: "종로 3가", full: "서울시 종로구 종로 3가" },
  { id: 6, short: "홍대입구", full: "서울시 마포구 홍대입구" }
];

/* ---------- ID → Region / short / full ---------- */
export const REGION_BY_ID = new Map(REGIONS.map((r) => [r.id, r]));
export const SHORT_BY_ID = new Map(REGIONS.map((r) => [r.id, r.short]));
export const FULL_BY_ID = new Map(REGIONS.map((r) => [r.id, r.full]));

/* ---------- short/full → ID (역매핑) ---------- */
export const ID_BY_SHORT = new Map(REGIONS.map((r) => [r.short, r.id]));
export const ID_BY_FULL = new Map(REGIONS.map((r) => [r.full, r.id]));

/* ---------- short → full (표시용) ---------- */
export const FULL_BY_SHORT = new Map(REGIONS.map((r) => [r.short, r.full]));

/* ---------- 입력 문자열(짧은명/풀네임 무관) → ID 정규화 ---------- */
export function normalizeToId(input: string): number | undefined {
  const t = input.trim();
  return ID_BY_SHORT.get(t) ?? ID_BY_FULL.get(t);
}

/* 추가: full → short */
export const SHORT_BY_FULL = new Map(REGIONS.map((r) => [r.full, r.short]));

/* ---------- 보조: ID 배열 → 표시용 문자열 배열 ---------- */
export function idsToShortNames(ids: number[]): string[] {
  return ids.map((id) => SHORT_BY_ID.get(id) ?? "");
}
export function idsToFullNames(ids: number[]): string[] {
  return ids.map((id) => FULL_BY_ID.get(id) ?? "");
}

// (선택) 입력값이 short/full 무엇이든 short로 정규화
export function normalizeToShort(input: string): string | undefined {
  const t = input.trim();
  if (ID_BY_SHORT.has(t)) return t; // 이미 short
  return SHORT_BY_FULL.get(t); // full → short
}
