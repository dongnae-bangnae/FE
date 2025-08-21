import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import DefaultProfile from "../assets/icon-defaultProfile.svg";
import CameraIcon from "../assets/icon-camera.svg";
import SearchIcon from "../assets/icon-search.svg";
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";
import IconDefault from "../assets/icon-default.svg";
import IconRedChecked from "../assets/icon-redChecked.svg";

import { searchRegions, type RegionSearchItem } from "../apis/member";
import { checkNicknameAvailability } from "../apis/member";
import { useCompleteOnboarding } from "../hooks/mutations/useCompleteOnboarding";

type RegionOption = { id: number; label: string };

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step1 상태
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [isCheckingNick, setIsCheckingNick] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Step2/3 상태
  const [selected, setSelected] = useState<RegionOption[]>([]);
  const [areaInput, setAreaInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // 디바운스된 검색어
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(areaInput.trim()), 250);
    return () => clearTimeout(t);
  }, [areaInput]);

  // 검색 API 호출
  const { data: options = [] } = useQuery<RegionOption[]>({
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

  // 온보딩 완료(한 번에 전송) 훅
  const { mutateAsync: completeOnboarding, isPending: isFinishing } =
    useCompleteOnboarding();

  // 지역 추가/삭제 (서버 저장 X, 로컬만 관리)
  const addRegion = (opt: RegionOption) => {
    if (selected.find((s) => s.id === opt.id)) return;
    if (selected.length >= 3) return;
    setSelected((prev) => [...prev, opt]);
  };

  const removeRegion = (id: number) => {
    const next = selected.filter((s) => s.id !== id);
    setSelected(next);
  };

  // 닉네임 검증
  const validateNickname = (): boolean => {
    const t = nickname.trim();
    if (!t) {
      setNicknameError("닉네임을 입력해주세요");
      return false;
    }
    if (t.length > 10) {
      setNicknameError("닉네임은 최대 10자입니다.");
      return false;
    }
    setNicknameError("");
    return true;
  };

  const handleNextFromNickname = async () => {
    if (!validateNickname()) return;
    try {
      setIsCheckingNick(true);
      const res = await checkNicknameAvailability(nickname.trim());
      if (!res.available) {
        setNicknameError(res.message ?? "닉네임을 사용할 수 없어요.");
        return;
      }
      setStep(2);
    } catch {
      setNicknameError("닉네임 확인 중 오류가 발생했어요.");
    } finally {
      setIsCheckingNick(false);
    }
  };

  // Enter 키로 첫 번째 결과 추가
  const handleAreaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!options.length) return;
      addRegion(options[0]);
      setAreaInput("");
    }
  };

  // 온보딩 제출(명세서대로 한 번에 전송)
  const handleOnboardingSubmit = async () => {
    const ids = selected.map((s) => s.id);
    if (ids.length < 1 || ids.length > 3) {
      alert("좋아하는 동네는 최소 1개, 최대 3개까지 선택해 주세요.");
      return;
    }
    try {
      await completeOnboarding({
        nickname,
        regionIds: ids,
        imageFile
      });
      // 기록 남기지 않고 바로 홈 진입 (SPA, 히스토리 교체)
      navigate("/home", { replace: true });
    } catch (err: any) {
      alert(
        err?.response?.data?.message ?? "온보딩 완료 처리 중 오류가 발생했어요."
      );
    }
  };

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen bg-white flex flex-col">
      {/* Header */}
      {step === 1 && <Header title="프로필 수정" underline />}
      {step === 2 && <Header title="" onBack={() => setStep(1)} />}
      {step === 3 && <Header title="" onBack={() => setStep(2)} />}

      {/* STEP 1 */}
      {step === 1 && (
        <>
          {/* 이미지 업로드 */}
          <div className="h-[188px] w-full flex justify-center items-center">
            <div className="relative w-[111px] h-[111px]">
              <input
                type="file"
                accept="image/*"
                id="profile-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewUrl(reader.result as string);
                      setImageFile(file);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {/* 프로필 & 카메라 묶은 클릭 라벨 */}
              <label htmlFor="profile-upload" className="cursor-pointer">
                <div className="relative w-[111px] h-[111px]">
                  <img
                    src={previewUrl || DefaultProfile}
                    alt="프로필"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <img
                    src={CameraIcon}
                    alt="카메라"
                    className="absolute bottom-0 right-0 w-[37.44px] h-[32.222px]
                 filter contrast-[250%] brightness-[0.85] drop-shadow-[0_0_1px_black]"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* 닉네임 입력 */}
          <div className="w-[350px] h-[202px] relative">
            <label
              htmlFor="nickname"
              className="absolute top-[61px] left-[20px] text-[#1E1E1E] font-pretendard text-[14px] font-semibold leading-[18px]"
            >
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="
      absolute
      top-[92px]
      left-[20px]
      w-[336px]
      h-[49px]
      px-[16px]
      py-[15px]
      flex items-center gap-[16px] shrink-0
    rounded-[10px]
    border border-[#EBEBED]
    shadow-[0_2px_4px_0_rgba(0,0,0,0.25)]
    placeholder-[#B0B0B8]
    text-[#1E1E1E] text-[16px] font-pretendard
    focus:outline-none
    focus:shadow-[0_2px_4px_0_rgba(255,172,51,0.5)]
    focus:shadow-none
    focus:border-[#FFAC33]
    "
              style={{ fontWeight: 500 }}
            />
            <style>{`
    input::placeholder {
      color: #B0B0B8;
      font-family: Pretendard;
      font-size: 16px;
      font-weight: 500;
      text-align: left;
    }
  `}</style>
            {nicknameError && (
              <p className="text-red-500 text-sm mt-[160px] px-[20px]">
                {nicknameError}
              </p>
            )}
          </div>

          {/* 다음 버튼 */}
          <div className="mt-auto flex justify-center pb-[30px]">
            <button
              type="button"
              onClick={handleNextFromNickname}
              disabled={!nickname.trim() || isCheckingNick}
              className={`w-[264px] h-[56px] rounded-[10px] text-[17px] font-bold leading-[150%] flex items-center justify-center transition-all
                ${
                  !nickname.trim() || isCheckingNick
                    ? "bg-white text-black border border-black opacity-60 cursor-not-allowed"
                    : "bg-[#FFAC33] text-white shadow-[0_2px_4px_0_rgba(255,172,51,0.5)] border border-[#FFAC33]"
                }`}
            >
              {isCheckingNick ? "확인 중..." : "다음으로 넘어가기"}
            </button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <div className="mt-[69px] ml-[42px] mb-[22px]">
            <h2 className="text-[24px] font-normal text-black">
              좋아하는 동네를 알려주세요!
            </h2>
          </div>

          <div
            onClick={() => setStep(3)}
            className="flex items-center mx-[12.5px] h-[52px] w-[350px] px-[13px] cursor-pointer
             rounded-[12px] border border-[#E0E0E0] bg-white
             shadow-[0_2px_4px_0_rgba(0,0,0,0.25)]"
          >
            <img
              src={SearchIcon}
              alt="검색"
              className="w-[25px] h-[25px] mr-[7px]"
            />
            <span className="text-[16px] text-[#666]">동네명, 장소명 검색</span>
          </div>

          {/* 최대 3개 선택 */}
          <p className="mt-[22px] ml-[90px] text-[20px] text-[#FF6A00] font-normal font-pretendard leading-none">
            최소 1개, 최대 3개 선택
          </p>

          {/* 선택된 태그 */}
          <div className="flex flex-wrap gap-2 mx-[26px] mt-2">
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

          <div className="flex-1" />

          <div className="flex justify-center pb-[30px]">
            <button
              disabled={isFinishing || selected.length === 0}
              onClick={handleOnboardingSubmit}
              className={`w-[264px] h-[56px] rounded-[10px] text-[17px] font-bold leading-[150%] flex items-center justify-center gap-[10px] px-[70px] py-[15px]
                ${
                  selected.length === 0
                    ? "bg-[#D9D9D9] text-gray-500 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                    : "bg-[#FFAC33] text-white shadow-[4px_4px_4px_rgba(255,170,51,0.25)]"
                }`}
            >
              {isFinishing ? "처리 중..." : "시작하기"}
            </button>
          </div>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="relative flex flex-col flex-1">
          {/* 헤더 */}
          <div className="w-full h-[76px] flex items-center justify-center px-5">
            <span className="text-[24px] font-normal text-center w-full">
              좋아하는 동네를 알려주세요!
            </span>
          </div>

          <div
            className={`flex items-center mx-[12.5px] h-[52px] w-[350px] px-[13px]
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
                onKeyDown={handleAreaKeyDown}
                autoFocus
              />
            ) : (
              <span
                onClick={() => setIsSearching(true)}
                className="text-[16px] text-[#666] cursor-text"
              >
                동네명, 장소명 검색
              </span>
            )}
          </div>

          {/* 검색 결과 리스트 */}
          {isSearching && !!options.length && (
            <div className="mt-[20px] ml-[20px] flex flex-col gap-3">
              {options.map((opt) => {
                const checked = !!selected.find((s) => s.id === opt.id);

                // 기존 UI처럼 검색어 하이라이트(대소문자 무시)
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
                    <span className="text-[16px] leading-[24px] font-normal font-pretendard text-[#000]">
                      {renderHighlighted(opt.label, areaInput)}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {/* 선택된 태그 */}
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

          {/* 하단선: 화면 하단에서 100px 고정 */}
          <div className="absolute bottom-[100px] left-0 w-full border-t border-gray-300" />

          {/* 확인/취소 버튼 */}
          <div className="flex gap-2 mt-auto pb-[30px] px-[63px]">
            <button
              onClick={() => setStep(2)}
              className="w-[110px] h-[45px] rounded-[9px] bg-[#D9D9D9] text-[17px] font-bold leading-[150%]"
            >
              취소
            </button>

            <button
              type="button"
              onClick={() => {
                const ids = selected.map((s) => s.id);
                if (ids.length < 1 || ids.length > 3) {
                  alert(
                    "좋아하는 동네는 최소 1개, 최대 3개까지 선택해 주세요."
                  );
                  return;
                }
                setStep(2); // 요약 화면으로만 복귀 (서버 저장 X)
              }}
              disabled={selected.length === 0}
              className={`w-[110px] h-[45px] rounded-[9px] text-[17px] font-bold leading-[150%] ${
                selected.length === 0
                  ? "bg-[#D9D9D9] text-gray-500"
                  : "bg-[#FF9700] text-white"
              }`}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnboardingPage;
