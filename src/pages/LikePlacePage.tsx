import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  patchRegions,
  type RegionSearchItem,
  searchRegions
} from "../apis/member";
import IconDefault from "../assets/icon-default.svg";
import IconRedChecked from "../assets/icon-redChecked.svg";
import SearchIcon from "../assets/icon-search.svg";
import { useMyInfo } from "../hooks/queries/useMyInfo";

type RegionOption = { id: number; label: string };

export default function LikePlacePage() {
  const navigate = useNavigate();

  /** ----- 선택 상태 (초기 선택 주입 대상) ----- */
  const [selected, setSelected] = useState<RegionOption[]>([]);
  const selectedIds = useMemo(() => selected.map((s) => s.id), [selected]);

  /** ----- 마이정보로부터 초기 선택 주입 ----- */
  const { data: myInfo, isLoading: myInfoLoading } = useMyInfo();
  useEffect(() => {
    // 최초 1회만 주입 (사용자가 이미 선택을 건드린 뒤엔 덮어쓰지 않음)
    if (!myInfo || !myInfo.likePlaces) return;
    if (selected.length > 0) return;

    const initial = myInfo.likePlaces.map((p) => ({
      id: p.regionId,
      label: p.name // 예: "연남동"
    }));
    if (initial.length) setSelected(initial);
  }, [myInfo, selected.length]);

  /** ----- 검색 상태(온보딩과 동일: 클릭 시 입력 활성화 + 디바운스) ----- */
  const [isSearching, setIsSearching] = useState(false);
  const [areaInput, setAreaInput] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(areaInput.trim()), 250);
    return () => clearTimeout(t);
  }, [areaInput]);

  /** ----- 검색 API 호출(온보딩과 동일 매핑) ----- */
  const { data: options = [], isFetching } = useQuery<RegionOption[]>({
    queryKey: ["regionSearch", debounced],
    enabled: debounced.length > 0,
    queryFn: async () => {
      const res = await searchRegions({ keyword: debounced, limit: 20 });
      const regions: RegionSearchItem[] = res?.result?.regions ?? [];
      return regions.map((r) => ({
        id: r.regionId,
        label: `${r.province} ${r.city} ${r.district}`
      }));
    },
    staleTime: 60_000
  });

  /** ----- 추가/삭제/Enter로 첫 결과 추가 (온보딩과 동일) ----- */
  const addRegion = (opt: RegionOption) => {
    if (selected.find((s) => s.id === opt.id)) return;
    if (selected.length >= 3) {
      alert("좋아하는 동네는 최대 3개까지 선택할 수 있어요.");
      return;
    }
    setSelected((prev) => [...prev, opt]);
  };
  const removeRegion = (id: number) =>
    setSelected((prev) => prev.filter((s) => s.id !== id));

  const handleEnterAddFirst = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!options.length) return;
      addRegion(options[0]);
      setAreaInput("");
    }
  };

  /** ----- 저장(온보딩의 saveRegions와 동일한 검증/에러 코드 분기) ----- */
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    const ids = selectedIds;
    if (ids.length < 1 || ids.length > 3) {
      alert("좋아하는 동네는 최소 1개, 최대 3개까지 선택해 주세요.");
      return;
    }

    // 변경 없음 방지(선택): 기존과 동일하면 PATCH 안 보냄
    const orig = new Set((myInfo?.likePlaces ?? []).map((p) => p.regionId));
    const same = ids.length === orig.size && ids.every((id) => orig.has(id));
    if (same) {
      alert("변경 사항이 없어요.");
      return;
    }

    try {
      setSaving(true);
      await patchRegions(ids);
      alert("관심 동네가 저장되었어요.");
      navigate(-1); // 필요에 맞게 이동 처리
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const msg = err?.response?.data?.message as string | undefined;

      if (code === "COMMONA000") {
        alert("잘못된 요청입니다. 최소 1개, 최대 3개까지 선택해 주세요.");
      } else if (code === "REGIONA001") {
        alert("해당 지역이 존재하지 않아요. 다시 선택해 주세요.");
      } else {
        alert(msg ?? "관심 동네 저장 중 오류가 발생했어요.");
      }
    } finally {
      setSaving(false);
    }
  };

  /** ----- 검색어 하이라이트(온보딩과 동일) ----- */
  const renderHighlighted = (label: string, q: string) => {
    if (!q) return label;
    const li = label.toLowerCase();
    const qi = q.toLowerCase();
    const idx = li.indexOf(qi);
    if (idx === -1) return label;
    const before = label.slice(0, idx);
    const mid = label.slice(idx, idx + q.length);
    const after = label.slice(idx + q.length);
    return (
      <>
        {before}
        <span className="text-[#F95F00]">{mid}</span>
        {after}
      </>
    );
  };

  const disabled = myInfoLoading || saving || selectedIds.length === 0;

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="w-full h-[56px] flex items-center justify-center border-b">
        <span className="text-[18px] font-semibold">관심 동네 변경</span>
      </div>

      {/* 온보딩과 동일한 검색 바(클릭 시 입력창 활성화) */}
      <div
        className={`flex items-center mx-[12.5px] mt-[16px] h-[52px] w-[350px] px-[13px]
        rounded-[12px] border bg-white
        ${
          isSearching
            ? "border-[3px] border-[rgba(255,170,51,0.87)] shadow-[4px_4px_4px_rgba(255,170,51,0.25)]"
            : "border-[#E0E0E0] shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        }`}
      >
        <img
          src={SearchIcon}
          alt="검색"
          className="w-[25px] h-[25px] mr-[7px]"
        />
        {isSearching ? (
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-[16px] text-black placeholder-[#666]"
            placeholder="동네명, 장소명 검색"
            value={areaInput}
            onChange={(e) => setAreaInput(e.target.value)}
            onKeyDown={handleEnterAddFirst}
            autoFocus
            disabled={myInfoLoading}
          />
        ) : (
          <span
            onClick={() => !myInfoLoading && setIsSearching(true)}
            className="text-[16px] text-[#666] cursor-text"
          >
            동네명, 장소명 검색
          </span>
        )}
      </div>

      {/* 최소/최대 안내 문구(온보딩 동일) */}
      <p className="mt-[16px] ml-[90px] text-[20px] text-[#FF6A00] font-normal">
        최소 1개, 최대 3개 선택
      </p>

      {/* 검색 결과 리스트(온보딩 동일: 커스텀 체크박스, 하이라이트) */}
      {isSearching && (
        <div className="mt-[20px] ml-[20px] flex flex-col gap-3">
          {isFetching && (
            <span className="text-sm text-gray-500">검색 중…</span>
          )}
          {options.map((opt) => {
            const checked = selectedIds.includes(opt.id);
            return (
              <label
                key={opt.id}
                className="flex items-center gap-[5px] cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() =>
                    checked ? removeRegion(opt.id) : addRegion(opt)
                  }
                />
                <img
                  src={checked ? IconRedChecked : IconDefault}
                  alt="체크박스 커스텀 아이콘"
                  className="w-[25px] h-[25px] flex-shrink-0"
                />
                <span className="text-[16px] leading-[24px] font-normal text-[#000]">
                  {renderHighlighted(opt.label, areaInput)}
                </span>
              </label>
            );
          })}
        </div>
      )}

      {/* 선택된 태그(온보딩 동일: x 버튼으로 제거) */}
      <div className="mt-auto pb-[30px] px-[20px]">
        <div className="flex flex-wrap gap-2">
          {selected.map((r) => (
            <div
              key={r.id}
              className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded-full"
            >
              <span>{r.label}</span>
              <button
                onClick={() => removeRegion(r.id)}
                className="ml-1 text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 구분선 + 버튼(온보딩 동일한 레이아웃/텍스트 톤) */}
      <div className="absolute bottom-[100px] left-0 w-full border-t border-gray-300" />
      <div className="flex gap-2 mt-auto pb-[30px] px-[63px]">
        <button
          onClick={() => navigate(-1)}
          className="w-[110px] h-[45px] rounded-[9px] bg-[#D9D9D9] text-[17px] font-bold leading-[150%]"
          disabled={myInfoLoading}
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={disabled}
          className={`w-[110px] h-[45px] rounded-[9px] text-[17px] font-bold leading-[150%] ${
            disabled ? "bg-[#D9D9D9] text-gray-500" : "bg-[#FF9700] text-white"
          }`}
        >
          {saving ? "저장 중..." : "확인"}
        </button>
      </div>
    </div>
  );
}
