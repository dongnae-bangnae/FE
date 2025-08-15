import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import DefaultProfile from "../assets/icon-defaultProfile.svg";
import CameraIcon from "../assets/icon-camera.svg";
import SearchIcon from "../assets/icon-search.svg";
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";
import IconDefault from "../assets/icon-default.svg";
import IconRedChecked from "../assets/icon-redChecked.svg";

import { usePatchNickname } from "../hooks/mutations/usePatchNickname";
import { usePatchProfileImage } from "../hooks/mutations/usePatchProfileImage";
import { usePatchRegions } from "../hooks/mutations/usePatchRegions";
//import { postOnboarding, searchRegions } from "../apis/member";
import {
  postOnboarding,
  searchRegions,
  type RegionSearchItem
} from "../apis/member";

type RegionOption = { id: number; label: string };

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step1 상태
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
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

  // 기존 훅
  const { mutateAsync: saveNickname, isPending: isNickSaving } =
    usePatchNickname({ silent: true });
  const { mutateAsync: saveImage, isPending: isImgSaving } =
    usePatchProfileImage();
  const { mutateAsync: saveRegions, isPending: isRegionSaving } =
    usePatchRegions();

  // 지역 추가/삭제
  const addRegion = (opt: RegionOption) => {
    if (selected.find((s) => s.id === opt.id)) return;
    if (selected.length >= 3) return;
    setSelected((prev) => [...prev, opt]);
  };

  const removeRegion = async (id: number) => {
    const next = selected.filter((s) => s.id !== id);
    setSelected(next);
    await saveRegions(next.map((s) => s.id));
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
      if (imageFile) await saveImage(imageFile);
      await saveNickname(nickname.trim());
      setStep(2);
    } catch (err: any) {
      const code = err?.response?.data?.code as string | undefined;
      const DUP = ["NICKNAME_DUPLICATE", "MEMBER4008", "MEMBERA008"];
      const EMPTY = ["NICKNAME_NOT_EXIST", "EMPTY_NICKNAME"];
      if (DUP.includes(code ?? ""))
        return setNicknameError("이미 사용 중인 닉네임입니다.");
      if (EMPTY.includes(code ?? ""))
        return setNicknameError("닉네임을 입력해주세요");
      if (nickname.trim().length > 10)
        return setNicknameError("닉네임은 최대 10자입니다.");
      setNicknameError(
        err?.response?.data?.message ?? "닉네임 변경에 실패했습니다."
      );
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

  // 온보딩 제출
  const [isFinishing, setIsFinishing] = useState(false);
  const handleOnboardingSubmit = async () => {
    const ids = selected.map((s) => s.id);
    if (ids.length < 1 || ids.length > 3) {
      alert("좋아하는 동네는 최소 1개, 최대 3개까지 선택해 주세요.");
      return;
    }
    try {
      setIsFinishing(true);
      await saveRegions(ids);
      await postOnboarding();
      navigate("/home");
    } catch (err: any) {
      alert(
        err?.response?.data?.message ?? "온보딩 완료 처리 중 오류가 발생했어요."
      );
    } finally {
      setIsFinishing(false);
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
                    className="absolute bottom-0 right-0 w-[37.44px] h-[32.222px]"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* 닉네임 입력 */}
          <div className="w-[350px] h-[202px] relative">
            <label
              htmlFor="nickname"
              className="absolute top-[61px] left-[20px] text-[#1E1E1E] font-pretendard text-[14px] font-semibold"
            >
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="absolute top-[92px] left-[20px] w-[336px] h-[49px] px-[16px] py-[15px] rounded-[10px] border border-[#EBEBED]"
            />
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
              disabled={!nickname.trim() || isNickSaving || isImgSaving}
              className={`w-[264px] h-[56px] rounded-[10px] font-bold ${
                !nickname.trim() || isNickSaving || isImgSaving
                  ? "bg-white text-black border border-black opacity-60"
                  : "bg-[#FFAC33] text-white"
              }`}
            >
              {isNickSaving || isImgSaving ? "저장 중..." : "다음으로 넘어가기"}
            </button>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <div className="mt-[69px] ml-[42px] mb-[22px]">
            <h2 className="text-[24px]">좋아하는 동네를 알려주세요!</h2>
          </div>

          <div
            onClick={() => setStep(3)}
            className="flex items-center mx-[12.5px] h-[52px] px-[13px] cursor-pointer border border-[#E0E0E0] bg-white"
          >
            <img
              src={SearchIcon}
              alt="검색"
              className="w-[25px] h-[25px] mr-[7px]"
            />
            <span className="text-[16px] text-[#666]">동네명, 장소명 검색</span>
          </div>

          <p className="mt-[22px] ml-[90px] text-[20px] text-[#FF6A00]">
            최소 1개, 최대 3개 선택
          </p>

          <div className="flex flex-wrap gap-2 mx-[26px] mt-2">
            {selected.map((r) => (
              <div
                key={r.id}
                className="flex items-center border px-3 py-1 rounded-full"
              >
                <span>{r.label}</span>
                <button onClick={() => removeRegion(r.id)}>✕</button>
              </div>
            ))}
          </div>

          <div className="flex-1" />

          <div className="flex justify-center pb-[30px]">
            <button
              disabled={isFinishing || selected.length === 0}
              onClick={handleOnboardingSubmit}
              className={`w-[264px] h-[56px] rounded-[10px] ${
                selected.length === 0
                  ? "bg-[#D9D9D9]"
                  : "bg-[#FFAC33] text-white"
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
          <div className="w-full h-[76px] flex items-center justify-center">
            <span className="text-[24px]">좋아하는 동네를 알려주세요!</span>
          </div>

          <div
            className={`flex items-center mx-[12.5px] h-[52px] px-[13px] border ${
              isSearching ? "border-[3px] border-[#FFAC33]" : "border-[#E0E0E0]"
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
                className="flex-1 bg-transparent outline-none"
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
                      alt="체크박스"
                      className="w-[25px] h-[25px]"
                    />
                    <span className="text-[16px]">{opt.label}</span>
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
                  className="flex items-center border px-3 py-1 rounded-full"
                >
                  <span>{r.label}</span>
                  <button onClick={() => removeRegion(r.id)}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* 확인/취소 버튼 */}
          <div className="flex gap-2 px-[63px] pb-[30px]">
            <button
              onClick={() => setStep(2)}
              className="w-[110px] bg-[#D9D9D9]"
            >
              취소
            </button>
            <button
              onClick={async () => {
                const ids = selected.map((s) => s.id);
                if (ids.length < 1 || ids.length > 3) {
                  alert(
                    "좋아하는 동네는 최소 1개, 최대 3개까지 선택해 주세요."
                  );
                  return;
                }
                await saveRegions(ids);
                setStep(2);
              }}
              disabled={selected.length === 0 || isRegionSaving}
              className={`w-[110px] ${selected.length === 0 ? "bg-[#D9D9D9]" : "bg-[#FF9700] text-white"}`}
            >
              {isRegionSaving ? "저장 중..." : "확인"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnboardingPage;
