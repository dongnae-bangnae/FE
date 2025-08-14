import { useState, useMemo } from "react";
import {
  normalizeToShort,
  normalizeToId,
  FULL_BY_SHORT
} from "../constants/regions";
import DefaultProfile from "../assets/icon-defaultProfile.svg";
import CameraIcon from "../assets/icon-camera.svg";
import SearchIcon from "../assets/icon-search.svg";
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";
import IconDefault from "../assets/icon-default.svg";
import IconRedChecked from "../assets/icon-redChecked.svg";

// 기존 훅 사용
import { usePatchNickname } from "../hooks/mutations/usePatchNickname";
import { usePatchProfileImage } from "../hooks/mutations/usePatchProfileImage";
import { usePatchRegions } from "../hooks/mutations/usePatchRegions";
import { postOnboarding } from "../apis/member";

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step1
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Step2/3
  const [areaInput, setAreaInput] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const toShort = (v: string | null | undefined) =>
    normalizeToShort(v ?? "") ?? "";

  // 기존 훅 사용
  const { mutateAsync: saveNickname, isPending: isNickSaving } =
    usePatchNickname();
  const { mutateAsync: saveImage, isPending: isImgSaving } =
    usePatchProfileImage();
  const { mutateAsync: saveRegions, isPending: isRegionSaving } =
    usePatchRegions();

  // 체크박스 토글 핸들러
  const handleToggleArea = (raw: string) => {
    const area = normalizeToShort(raw) ?? raw; // 항상 short 보관
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      if (selectedAreas.length >= 3) return;
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  // x표
  const handleRemoveArea = async (areaToRemove: string) => {
    const next = selectedAreas.filter((a) => a !== areaToRemove);
    setSelectedAreas(next);

    const nextIds = next
      .map((name) => normalizeToId(normalizeToShort(name) ?? name))
      .filter((id): id is number => typeof id === "number");

    await saveRegions(nextIds); // 서버에 바로 반영
  };

  // 닉네임 로컬 검사
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

  // STEP1: 이미지(선택) → 닉네임 저장 → Step2로 이동
  const handleNextFromNickname = async () => {
    if (!validateNickname()) return;
    try {
      if (imageFile) await saveImage(imageFile);
      await saveNickname(nickname.trim());
      setStep(2);
    } catch (e) {
      // 필요 시 에러코드 분기(중복 닉네임 등)
    }
  };

  // Enter로 태그 추가
  const handleAreaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = areaInput.trim();
      if (!keyword) return;
      const area = normalizeToShort(keyword) ?? keyword;
      if (selectedAreas.length >= 3) return;
      if (selectedAreas.includes(area)) return;
      setSelectedAreas([...selectedAreas, area]);
      setAreaInput("");
    }
  };

  const buildRegionIds = (): number[] => {
    const ids: number[] = [];
    selectedAreas.forEach((name) => {
      const short = normalizeToShort(name) ?? name;
      const id = normalizeToId(short) ?? normalizeToId(name);
      if (typeof id === "number") ids.push(id);
    });
    return ids;
  };

  // STEP2: 시작하기(완료 플래그만 호출)
  const [isFinishing, setIsFinishing] = useState(false);

  const handleOnboardingSubmit = async () => {
    if (selectedAreas.length === 0) return; // 상태 체크
    const ids = buildRegionIds();
    if (ids.length < 1 || ids.length > 3) {
      alert("좋아하는 동네는 최소 1개, 최대 3개까지 선택해 주세요.");
      return;
    }

    try {
      setIsFinishing(true);
      await saveRegions(ids); // ← 여기! (Step3에서 저장했어도 한 번 더 맞춰줌)
      await postOnboarding(); // 완료 플래그
      navigate("/home");
    } catch (err: any) {
      alert(
        err?.response?.data?.message ?? "온보딩 완료 처리 중 오류가 발생했어요."
      );
    } finally {
      setIsFinishing(false);
    }
  };

  // 검색 매칭
  const matchedFullAddress = useMemo(() => {
    const t = areaInput.trim();
    const short = normalizeToShort(t);
    return short ? (FULL_BY_SHORT.get(short) ?? null) : null;
  }, [areaInput]);

  // --------------------------------------------

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen bg-white flex flex-col">
      {/* Header */}
      {step === 1 && <Header title="프로필 수정" underline />}
      {step === 2 && <Header title="" onBack={() => setStep(1)} />}
      {step === 3 && <Header title="" onBack={() => setStep(2)} />}

      {/* STEP 1 */}
      {step === 1 && (
        <>
          {/* 이미지 업로드 영역 */}
          <div className="h-[188px] w-full flex justify-center items-center">
            <div className="relative w-[111px] h-[111px]">
              {/* 숨겨진 파일 인풋 (바깥에 위치) */}
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

          {/* 닉네임 */}
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

          {/* 버튼 */}
          <div className="mt-auto flex justify-center pb-[30px]">
            <button
              type="button"
              onClick={handleNextFromNickname}
              disabled={!nickname.trim() || isNickSaving || isImgSaving}
              className={`w-[264px] h-[56px] rounded-[10px] text-[17px] font-bold leading-[150%] flex items-center justify-center transition-all
                ${
                  !nickname.trim() || isNickSaving || isImgSaving
                    ? "bg-white text-black border border-black opacity-60 cursor-not-allowed"
                    : "bg-[#FFAC33] text-white shadow-[0_2px_4px_0_rgba(255,172,51,0.5)] border border-[#FFAC33]"
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
          {/* 상단 문구 */}
          <div className="mt-[69px] ml-[42px] mb-[22px]">
            <h2 className="text-[24px] font-normal text-black">
              좋아하는 동네를 알려주세요!
            </h2>
          </div>

          {/* 검색박스 */}
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
            {selectedAreas.map((area) => (
              <div
                key={area}
                className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded-full"
              >
                <span>{area}</span>
                <button
                  onClick={() => handleRemoveArea(area)}
                  className="ml-1 text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex-1" />

          {/* 시작하기기 */}
          <div className="flex justify-center pb-[30px]">
            <button
              disabled={isFinishing || selectedAreas.length === 0}
              onClick={handleOnboardingSubmit}
              className={`w-[264px] h-[56px] rounded-[10px] text-[17px] font-bold leading-[150%] flex items-center justify-center gap-[10px] px-[70px] py-[15px]
                ${
                  selectedAreas.length === 0
                    ? "bg-[#D9D9D9] text-gray-500 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                    : "bg-[#FFAC33] text-white shadow-[4px_4px_4px_rgba(255,170,51,0.25)]"
                }`}
            >
              {isFinishing ? "처리 중..." : "시작하기"}
            </button>
          </div>
        </>
      )}

      {/* STEP 3 
      확인 버튼 누르면 → formData 구성 후 postOnboarding 실행*/}
      {step === 3 && (
        <div className="relative flex flex-col flex-1">
          {/* 헤더 */}
          <div className="w-full h-[76px] flex items-center justify-center px-5">
            <span className="text-[24px] font-normal text-center w-full">
              좋아하는 동네를 알려주세요!
            </span>
          </div>
          {/* 검색박스 */}
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
                className="text-[16px] text-[#666] cursor-text"
                onClick={() => setIsSearching(true)}
              >
                동네명, 장소명 검색
              </span>
            )}
          </div>
          {/* 검색 결과 리스트 */}
          {matchedFullAddress &&
            (() => {
              const full = matchedFullAddress; // UI 노출은 풀네임
              const short = toShort(full); // 선택/저장은 숏
              const isChecked = selectedAreas.includes(short);

              return (
                <label className="flex items-center gap-[5px] mt-[20px] ml-[20px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleArea(full)} // 내부에서 short로 저장됨
                    className="hidden"
                  />

                  <img
                    src={isChecked ? IconRedChecked : IconDefault}
                    alt="체크박스 커스텀 아이콘"
                    className="w-[25px] h-[25px] flex-shrink-0"
                  />

                  <span className="text-[16px] leading-[24px] font-normal font-pretendard text-[#000]">
                    {full.split(areaInput).map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i !== arr.length - 1 && (
                          <span className="text-[#F95F00]">{areaInput}</span>
                        )}
                      </span>
                    ))}
                  </span>
                </label>
              );
            })()}

          {/* 상단선 + 문구 + 태그 묶음 */}
          <div className="mt-88">
            {/* 상단선 */}
            <div className="w-full border-t border-gray-300" />

            {/* 문구 */}
            <p className="mt-2 ml-6 text-[14px] font-normal text-[#FF6A00]">
              최소 1개, 최대 3개 선택
            </p>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 mx-6 mt-2">
              {selectedAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-center bg-white border border-gray-300 px-3 py-1 rounded-full"
                >
                  <span>{area}</span>
                  <button
                    onClick={() => handleRemoveArea(area)}
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
          {/* 버튼 */}
          <div className="flex gap-2 mt-auto pb-[30px] px-[63px]">
            <button
              onClick={() => setStep(2)}
              className="w-[110px] h-[45px] rounded-[9px] bg-[#D9D9D9] text-[17px] font-bold leading-[150%]"
            >
              취소
            </button>

            <button
              type="button"
              onClick={async () => {
                const ids = buildRegionIds();
                if (ids.length < 1 || ids.length > 3) {
                  alert(
                    "좋아하는 동네는 최소 1개, 최대 3개까지 선택해 주세요."
                  );
                  return;
                }
                await saveRegions(ids); // 서버에 즉시 저장
                setStep(2); // 요약 화면으로
              }}
              disabled={selectedAreas.length === 0 || isRegionSaving}
              className={`w-[110px] h-[45px] rounded-[9px] text-[17px] font-bold leading-[150%] ${
                selectedAreas.length === 0 || isRegionSaving
                  ? "bg-[#D9D9D9] text-gray-500"
                  : "bg-[#FF9700] text-white"
              }`}
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
