import { useState } from "react";
import DefaultProfile from "../assets/icon-defaultProfile.svg";
import CameraIcon from "../assets/icon-camera.svg";
import Header from "../components/common/Header";

function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  // 닉네임 단계 -> 동네 선택 단계
  const handleNextFromNickname = () => {
    if (nickname.trim() === "") {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }
    setNicknameError("");
    setStep(2);
  };

  // 동네 키워드 엔터 입력
  const handleAreaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const keyword = areaInput.trim();
      if (!keyword) return;
      if (selectedAreas.length >= 3) return;
      if (selectedAreas.includes(keyword)) return;
      setSelectedAreas([...selectedAreas, keyword]);
      setAreaInput("");
    }
  };

  // 동네 삭제
  const handleRemoveArea = (area: string) => {
    setSelectedAreas(selectedAreas.filter((a) => a !== area));
  };

  // 동네 선택 확인 -> 완료화면
  const handleConfirmAreas = () => {
    if (selectedAreas.length === 0) return;
    setStep(3);
  };

  return (
    <div className="flex flex-col w-full max-w-[390px] mx-auto min-h-screen bg-white">
      {/* STEP 1: 프로필 수정 */}
      {step === 1 && (
        <>
          <Header title="프로필 수정" underline />

          <div className="flex flex-col flex-1 px-6 py-6">
            {/* 프로필 이미지 */}
            <div className="relative w-[111px] h-[111px] mx-auto mb-6">
              <img
                src={DefaultProfile}
                alt="프로필 기본 아이콘"
                className="w-[111px] h-[111px]"
              />
              <img
                src={CameraIcon}
                alt="카메라 아이콘"
                className="absolute bottom-0 right-0 w-[32px] h-[32px]"
              />
            </div>

            {/* 닉네임 입력 */}
            <label className="block mb-2 font-medium">닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력해주세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
            />
            {nicknameError && (
              <p className="text-red-500 text-sm mb-4">{nicknameError}</p>
            )}

            {/* 다음 버튼 */}
            <button
              onClick={handleNextFromNickname}
              className={`w-[264px] h-[56px] mt-10 mx-auto rounded-[10px] text-sm font-semibold ${
                nickname.trim()
                  ? "bg-[#FFAC33] text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
            >
              다음으로 넘어가기
            </button>
          </div>
        </>
      )}

      {/* STEP 2: 동네 선택 */}
      {step === 2 && (
        <>
          <Header title="좋아하는 동네를 알려주세요!" />

          <div className="flex flex-col flex-1 px-6 py-6">
            <input
              type="text"
              placeholder="동네명 검색"
              value={areaInput}
              onChange={(e) => setAreaInput(e.target.value)}
              onKeyDown={handleAreaKeyDown}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            />
            <p className="text-orange-500 text-sm mb-4">최대 3개 선택</p>

            {/* 선택된 태그 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
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

            {/* 확인 버튼 */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => setStep(1)}
                className="flex-1 h-[56px] rounded-[10px] bg-gray-200 text-gray-700 text-sm font-semibold"
              >
                이전
              </button>
              <button
                onClick={handleConfirmAreas}
                disabled={selectedAreas.length === 0}
                className={`flex-1 h-[56px] rounded-[10px] text-sm font-semibold ${
                  selectedAreas.length === 0
                    ? "bg-gray-300 text-gray-500"
                    : "bg-[#FFAC33] text-white"
                }`}
              >
                확인
              </button>
            </div>
          </div>
        </>
      )}

      {/* STEP 3: 동네 선택 완료 */}
      {step === 3 && (
        <>
          {/* 뒤로가기 버튼 없음 */}
          <Header title="좋아하는 동네를 알려주세요!" left={null} />

          <div className="flex flex-col flex-1 px-6 py-6">
            <p className="text-orange-500 text-sm mb-4">최대 3개 선택</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {selectedAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span>{area}</span>
                </div>
              ))}
            </div>

            <button
              disabled={selectedAreas.length === 0}
              className={`w-[264px] h-[56px] mx-auto mt-auto rounded-[10px] text-sm font-semibold ${
                selectedAreas.length === 0
                  ? "bg-gray-300 text-gray-500"
                  : "bg-[#FFAC33] text-white"
              }`}
            >
              시작하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default OnboardingPage;
