import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  patchRegions,
  type RegionSearchItem,
  searchRegions
} from "../apis/member";
import circleCheck from "../assets/icon-circleCheck.svg";
import IconDefault from "../assets/icon-default.svg";
import IconRedChecked from "../assets/icon-redChecked.svg";
import SearchIcon from "../assets/icon-search.svg";
import Header from "../components/common/Header";
import { useMyInfo } from "../hooks/queries/useMyInfo";

type RegionOption = { id: number; label: string };

export default function LikePlacePage() {
  const navigate = useNavigate();

  /** ===== 단계: intro(피그마 첫 화면) / select(검색·선택 단계) ===== */
  const [step, setStep] = useState<"intro" | "select">("intro");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  /** ----- 선택 상태 ----- */
  const [selected, setSelected] = useState<RegionOption[]>([]);
  const selectedIds = useMemo(() => selected.map((s) => s.id), [selected]);

  /** ----- 마이정보 초기 주입 ----- */
  const { data: myInfo, isLoading: myInfoLoading } = useMyInfo();
  useEffect(() => {
    if (!myInfo?.likePlaces) return;
    if (selected.length > 0) return;
    const initial = myInfo.likePlaces.map((p) => ({
      id: p.regionId,
      label: p.name
    }));
    if (initial.length) setSelected(initial);
  }, [myInfo, selected.length]);

  /** ----- 검색 상태(디바운스) ----- */
  const [isSearching, setIsSearching] = useState(false);
  const [areaInput, setAreaInput] = useState("");
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(areaInput.trim()), 250);
    return () => clearTimeout(t);
  }, [areaInput]);

  /** ----- 검색 API ----- */
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

  /** ----- 추가/삭제/Enter 추가 ----- */
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

  /** ----- 저장: 성공 시 intro로 전환 + 토스트 ----- */
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    const ids = selectedIds;
    if (ids.length < 1 || ids.length > 3) {
      alert("좋아하는 동네는 최소 1개, 최대 3개까지 선택해 주세요.");
      return;
    }
    const orig = new Set((myInfo?.likePlaces ?? []).map((p) => p.regionId));
    const same = ids.length === orig.size && ids.every((id) => orig.has(id));
    if (same) {
      // 변경 없으면 그냥 intro로만 돌아가고 토스트는 안 띄움(원하면 띄워도 OK)
      setStep("intro");
      setIsSearching(false);
      setAreaInput("");
      return;
    }

    try {
      setSaving(true);
      await patchRegions(ids);

      // 초기 화면으로 전환 + 토스트 노출
      setIsSearching(false);
      setAreaInput("");
      setStep("intro");
      setToastMessage("동네 선택이 완료되었어요");
      setTimeout(() => setToastMessage(null), 2500);
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

  /** ----- 하이라이트 ----- */
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

  /** ----- select 진입 시 인풋 포커스 ----- */
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (step === "select") {
      setIsSearching(true);
      // 다음 tick에 포커스
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [step]);

  /** ----- intro에서 검색 박스/버튼 클릭 시 select로 ----- */
  const goSelect = () => setStep("select");

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen bg-white flex flex-col relative">
      {step === "intro" ? (
        /* ===================== [피그마 0.2.3-1 초기 화면] ===================== */
        <>
          {/* 헤더 (필요 시 아이콘 추가) */}
          <div className="h-[56px] flex items-center px-4" />

          <div className="px-6">
            <h1 className="text-[20px] font-semibold mt-2">
              좋아하는 동네를 알려주세요!
            </h1>

            {/* 비활성 검색박스: 클릭 시 select로 이동 */}
            <button
              type="button"
              onClick={goSelect}
              className="mt-4 h-[44px] w-full flex items-center px-3 rounded-xl border border-[#E0E0E0] shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-left"
            >
              <img
                src={SearchIcon}
                alt=""
                className="w-5 h-5 mr-2 opacity-70"
              />
              <span className="text-[#999] text-sm">동네명, 장소명 검색</span>
            </button>

            {/* 안내 문구 */}
            <p className="mt-2 text-[12px] text-[#FF6A00]">
              최소 1개, 최대 3개 선택
            </p>

            {/* 선택된 태그(있으면 표시) */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selected.map((r) => (
                <div
                  key={r.id}
                  className="px-3 py-1 rounded-full border border-[#DADADA] bg-white text-sm"
                >
                  {r.label} ✕
                </div>
              ))}
            </div>
          </div>

          {/* 하단: 토스트 + 시작하기 버튼 */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white px-6 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))]">
            {/* 토스트 (버튼 위 회색 바) */}
            {toastMessage && (
              <div className="mb-2 w-full flex justify-center">
                <div className="w-[354px] px-4 py-2.5 bg-[#9A7B6F]/80 text-white text-sm rounded-lg flex items-center gap-2 z-50 shadow-md">
                  <img
                    src={circleCheck}
                    alt="체크 아이콘"
                    className="w-5 h-5"
                  />
                  <span className="truncate">{toastMessage}</span>
                </div>
              </div>
            )}
            <button
              className="w-full h-[52px] rounded-xl bg-[#FF9700] text-white text-[16px] font-semibold shadow-[0_6px_12px_rgba(0,0,0,0.08)]"
              onClick={goSelect}
            >
              시작하기
            </button>
          </div>
        </>
      ) : (
        /* ===================== [피그마 0.2.3-2/0.2.4-x 검색·선택 단계] ===================== */
        <>
          {/* 헤더 (제목/보더 톤 자유) */}
          <div className="w-full h-[56px] flex items-center justify-center border-b">
            <span className="text-[18px] font-semibold">관심 동네 변경</span>
          </div>

          <div className="flex-1 px-4 pb-[140px]">
            {/* 검색 바 (포커스 시 오렌지 보더/그림자) */}
            <div
              className={`mt-4 h-[52px] w-full flex items-center px-[13px] rounded-[12px] bg-white
                ${
                  isSearching
                    ? "border-[3px] border-[rgba(255,170,51,0.87)] shadow-[4px_4px_4px_rgba(255,170,51,0.25)]"
                    : "border border-[#E0E0E0] shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                }`}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setIsSearching(false)}
            >
              <img
                src={SearchIcon}
                alt="검색"
                className="w-[25px] h-[25px] mr-[7px]"
              />
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent outline-none text-[16px] text-black placeholder-[#666]"
                placeholder="동네명, 장소명 검색"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                onKeyDown={handleEnterAddFirst}
                disabled={myInfoLoading}
              />
            </div>

            {/* 안내 문구 */}
            <p className="mt-2 text-[12px] text-[#FF6A00]">
              최소 1개, 최대 3개 선택
            </p>

            {/* 검색 결과 리스트 */}
            <div className="mt-4 flex flex-col gap-3">
              {isFetching && (
                <span className="text-sm text-gray-500">검색 중…</span>
              )}
              {options.map((opt) => {
                const checked = selectedIds.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 cursor-pointer"
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
                      alt="체크박스"
                      className="w-[24px] h-[24px] flex-shrink-0"
                    />
                    <span className="text-[16px] leading-[24px] text-[#000]">
                      {renderHighlighted(opt.label, areaInput)}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* 선택된 태그 */}
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {selected.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{r.label}</span>
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
          </div>

          {/* 하단 고정: 취소/확인 (토스트는 intro에서만) */}
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-200 px-6 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <div className="flex gap-2">
              <button
                onClick={() => setStep("intro")} // 취소 → 초기 화면으로
                className="w-1/2 h-[45px] rounded-[9px] bg-[#D9D9D9] text-[17px] font-bold leading-[150%]"
                disabled={myInfoLoading}
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={disabled}
                className={`w-1/2 h-[45px] rounded-[9px] text-[17px] font-bold leading-[150%] ${
                  disabled
                    ? "bg-[#D9D9D9] text-gray-500"
                    : "bg-[#FF9700] text-white"
                }`}
              >
                {saving ? "저장 중..." : "확인"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
