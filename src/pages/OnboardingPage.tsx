import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "../apis/axiosInstance";
import CameraIcon from "../assets/icon-camera.svg";
import IconDefault from "../assets/icon-default.svg";
import DefaultProfile from "../assets/icon-defaultProfile.svg";
import IconRedChecked from "../assets/icon-redChecked.svg";
import SearchIcon from "../assets/icon-search.svg";
import Header from "../components/common/Header";
import { FULL_BY_SHORT, ID_BY_SHORT } from "../constants/regions";

// 쿠키에서 값을 읽는 유틸리티 함수
function getCookieValue(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return m ? m[2] : null;
}

// CSRF 토큰을 미리 가져오는 함수
const ensureCSRFToken = async (): Promise<boolean> => {
  try {
    const existingToken = getCookieValue("XSRF-TOKEN");
    if (existingToken) {
      console.log("CSRF token already exists:", existingToken);
      return true;
    }

    // CSRF 토큰을 가져오기 위한 GET 요청
    await axiosInstance.get("/api/csrf");

    const newToken = getCookieValue("XSRF-TOKEN");
    if (newToken) {
      console.log("CSRF token obtained:", newToken);
      return true;
    }

    console.warn("Failed to obtain CSRF token");
    return false;
  } catch (error) {
    console.error("Error obtaining CSRF token:", error);
    return false;
  }
};

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 컴포넌트 마운트 시 CSRF 토큰 확보
  useEffect(() => {
    const initCSRF = async () => {
      const success = await ensureCSRFToken();
      if (!success) {
        console.warn("Failed to initialize CSRF token");
      }
    };

    initCSRF();

    console.log("=== 온보딩 페이지 로드 ===");
    console.log("현재 쿠키:", document.cookie);
    console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);
  }, []);

  // 체크박스 토글 핸들러
  const handleToggleArea = (area: string) => {
    console.log("지역 토글:", area);
    console.log("현재 선택된 지역들:", selectedAreas);

    if (selectedAreas.includes(area)) {
      const newAreas = selectedAreas.filter((a) => a !== area);
      console.log("지역 제거 후:", newAreas);
      setSelectedAreas(newAreas);
    } else {
      if (selectedAreas.length >= 3) {
        console.log("최대 3개 제한으로 추가 불가");
        return;
      }
      const newAreas = [...selectedAreas, area];
      console.log("지역 추가 후:", newAreas);
      setSelectedAreas(newAreas);
    }
  };

  const handleRemoveArea = (areaToRemove: string) => {
    setSelectedAreas(selectedAreas.filter((area) => area !== areaToRemove));
  };

  // 동기 로컬 검사로 단순화
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

  const handleNextFromNickname = () => {
    if (validateNickname()) setStep(2);
  };

  const handleAreaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = areaInput.trim();
      console.log("Enter 키 입력, 키워드:", keyword);

      if (!keyword) return;
      if (selectedAreas.length >= 3) return;
      if (selectedAreas.includes(keyword)) return;

      console.log("지역 추가:", keyword);
      console.log("현재 선택된 지역들:", selectedAreas);

      setSelectedAreas([...selectedAreas, keyword]);
      setAreaInput("");
    }
  };

  const handleOnboardingSubmit = async () => {
    if (!nickname || selectedAreas.length === 0) return;

    console.log("=== 온보딩 제출 시작 ===");
    console.log("닉네임:", nickname);
    console.log("선택된 지역:", selectedAreas);
    console.log("이미지 파일:", imageFile);

    const formData = new FormData();
    formData.append("nickname", nickname);
    if (imageFile) formData.append("profileImage", imageFile);

    // 동이름 → 풀주소 → regionId로 변환해서 formData에 넣기
    console.log("=== 지역 ID 변환 과정 ===");
    selectedAreas.forEach((area, index) => {
      console.log(`지역 ${index + 1}: "${area}"`);
      const id = ID_BY_SHORT.get(area);
      console.log(`  -> ID: ${id}`);

      if (id) {
        formData.append("chosenRegionIds", String(id));
        console.log(`  -> FormData에 추가됨: ${id}`);
      } else {
        console.warn(`  -> 경고: "${area}"에 대한 ID를 찾을 수 없습니다!`);
        // ID를 찾을 수 없는 경우, 지역명을 그대로 사용하거나 기본값 사용
        console.log("ID_BY_SHORT 맵 내용:", ID_BY_SHORT);
        console.log("FULL_BY_SHORT 맵 내용:", FULL_BY_SHORT);

        // 임시 해결책: 지역명이 '동탄'이면 임시 ID 사용
        if (area === "동탄") {
          console.log("동탄에 대한 임시 ID 1 사용");
          formData.append("chosenRegionIds", "1");
        }
      }
    });

    // chosenRegionIds가 하나도 없으면 경고
    const regionIdsCount = formData.getAll("chosenRegionIds").length;
    console.log(`총 ${regionIdsCount}개의 지역 ID가 FormData에 추가됨`);

    if (regionIdsCount === 0) {
      console.error("경고: chosenRegionIds가 하나도 없습니다!");
      alert("선택된 지역의 ID를 찾을 수 없습니다. 개발팀에 문의해주세요.");
      return;
    }

    // FormData 내용 디버깅
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // 순수 fetch API 사용 (axios 완전히 우회)
    try {
      const csrfToken = getCookieValue("XSRF-TOKEN");
      console.log("Using CSRF Token:", csrfToken);

      // JWT 토큰도 쿠키에서 가져오기 (만약 쿠키에 저장되어 있다면)
      const jwtToken =
        getCookieValue("accessToken") ||
        getCookieValue("ACCESS_TOKEN") ||
        getCookieValue("jwt");
      console.log("JWT Token found:", jwtToken ? "YES" : "NO");

      const fetchHeaders: HeadersInit = {
        "X-XSRF-TOKEN": csrfToken || "",
        "X-DEBUG-INSTANCE": "fetch-api"
      };

      // JWT 토큰이 있으면 Authorization 헤더 추가
      if (jwtToken) {
        fetchHeaders["Authorization"] = `Bearer ${jwtToken}`;
        console.log("Authorization 헤더 추가됨");
      }

      console.log("Fetch headers:", fetchHeaders);
      console.log("FormData being sent:", formData);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/member/onboarding`,
        {
          method: "POST",
          credentials: "include", // 쿠키 포함 (JWT가 HttpOnly 쿠키로 저장된 경우)
          headers: fetchHeaders,
          body: formData // Content-Type은 브라우저가 자동으로 multipart/form-data로 설정
        }
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const data = await response.json();
        console.log("온보딩 성공:", data);

        // 온보딩 완료 후 쿠키 업데이트 확인
        console.log("온보딩 완료 후 쿠키:", document.cookie);

        navigate("/home");
      } else {
        const errorText = await response.text();
        console.error("온보딩 실패 응답:", errorText);
        console.error("응답 상태:", response.status, response.statusText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        const code = errorData.code;
        const message = errorData.message;

        // 인증 관련 에러 (401, 403)
        if (response.status === 401) {
          alert("로그인이 필요합니다. 다시 로그인해주세요.");
          window.location.href = "/login";
          return;
        }

        // CSRF 관련 에러 처리
        if (response.status === 403) {
          if (
            message?.includes("CSRF") ||
            message?.includes("토큰") ||
            code === "TOKEN4004"
          ) {
            alert("보안 인증에 실패했습니다. 페이지를 새로고침해주세요.");
            window.location.reload();
            return;
          }
        }

        // 닉네임 중복
        if (code === "NICKNAME_DUPLICATE" || code === "MEMBER4008") {
          setStep(1);
          setNicknameError("이미 사용 중인 닉네임입니다.");
          return;
        }

        // 닉네임 비어있음
        if (code === "NICKNAME_NOT_EXIST" || code === "EMPTY_NICKNAME") {
          setStep(1);
          setNicknameError("닉네임을 입력해주세요");
          return;
        }

        // 지역 개수 오류
        if (code === "INVALID_REGION_COUNT" || code === "MEMBERA004") {
          alert("좋아하는 동네는 최소 1개, 최대 3개까지 선택할 수 있어요.");
          return;
        }

        // 그 외
        alert(message || "온보딩에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("네트워크 에러:", error);
      alert("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
    }
  };

  const matchedFullAddress = useMemo(() => {
    const t = areaInput.trim();
    return FULL_BY_SHORT.get(t) ?? null;
  }, [areaInput]);

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
              onClick={handleNextFromNickname}
              className={`w-[264px] h-[56px] rounded-[10px] text-[17px] font-bold leading-[150%] flex items-center justify-center transition-all
      ${
        nickname.trim()
          ? "bg-[#FFAC33] text-white shadow-[0_2px_4px_0_rgba(255,172,51,0.5)] border border-[#FFAC33]"
          : "bg-white text-black border border-black"
      }`}
            >
              다음으로 넘어가기
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

          {/* 버튼 */}
          <div className="flex justify-center pb-[30px]">
            <button
              disabled={selectedAreas.length === 0}
              onClick={handleOnboardingSubmit}
              className={`w-[264px] h-[56px] rounded-[10px] text-[17px] font-bold leading-[150%] flex items-center justify-center gap-[10px] px-[70px] py-[15px]
      ${
        selectedAreas.length === 0
          ? "bg-[#D9D9D9] text-gray-500 shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
          : "bg-[#FFAC33] text-white shadow-[4px_4px_4px_rgba(255,170,51,0.25)]"
      }
    `}
            >
              시작하기
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
          {matchedFullAddress && (
            <label className="flex items-center gap-[5px] mt-[20px] ml-[20px] cursor-pointer">
              <input
                type="checkbox"
                checked={selectedAreas.includes(matchedFullAddress)}
                onChange={() => handleToggleArea(matchedFullAddress)}
                className="hidden"
              />
              <img
                src={
                  selectedAreas.includes(matchedFullAddress)
                    ? IconRedChecked
                    : IconDefault
                }
                alt="체크박스 커스텀 아이콘"
                className="w-[25px] h-[25px] flex-shrink-0"
              />
              <span className="text-[16px] leading-[24px] font-normal font-pretendard text-[#000]">
                {matchedFullAddress
                  .split(areaInput)
                  .map((part: string, i: number, arr: string[]) => {
                    const isLast = i === arr.length - 1;
                    return (
                      <span key={i}>
                        {part}
                        {!isLast && (
                          <span className="text-[#F95F00]">{areaInput}</span>
                        )}
                      </span>
                    );
                  })}
              </span>
            </label>
          )}

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
              onClick={() => setStep(2)}
              disabled={selectedAreas.length === 0}
              className={`w-[110px] h-[45px] rounded-[9px] text-[17px] font-bold leading-[150%] ${
                selectedAreas.length === 0
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
