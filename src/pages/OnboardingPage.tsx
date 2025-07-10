import { useState } from "react";
import DefaultProfile from "../assets/icon-defaultProfile.svg";
import CameraIcon from "../assets/icon-camera.svg";

function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const handleNextFromNickname = () => {
    if (nickname.trim() === "") {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }
    setNicknameError("");
    setStep(2);
  };

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

  const handleRemoveArea = (area: string) => {
    setSelectedAreas(selectedAreas.filter((a) => a !== area));
  };

  const handleConfirmAreas = () => {
    if (selectedAreas.length === 0) return;
    setStep(3);
  };

  return (
    <div className="flex flex-col w-full max-w-[375px] mx-auto px-6 py-10 min-h-screen bg-white">
      {step === 1 && (
        <>
          <h1 className="text-center text-xl font-semibold mb-8">
            프로필 수정
          </h1>

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
            className={`w-full py-3 rounded mt-auto ${
              nickname.trim()
                ? "bg-orange-400 text-white"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            다음으로 넘어가기
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-center text-xl font-semibold mb-6">
            좋아하는 동네를 알려주세요!
          </h1>

          {/* 동네 입력 */}
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
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded"
            >
              이전
            </button>
            <button
              onClick={handleConfirmAreas}
              disabled={selectedAreas.length === 0}
              className={`flex-1 py-3 rounded ${
                selectedAreas.length === 0
                  ? "bg-gray-300 text-gray-500"
                  : "bg-orange-400 text-white"
              }`}
            >
              확인
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-center text-xl font-semibold mb-6">
            좋아하는 동네를 알려주세요!
          </h1>

          {/* 선택된 태그 다시 표시 */}
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

          {/* 시작하기 버튼 */}
          <button
            disabled={selectedAreas.length === 0}
            className={`w-full py-3 rounded mt-auto ${
              selectedAreas.length === 0
                ? "bg-gray-300 text-gray-500"
                : "bg-orange-400 text-white"
            }`}
          >
            시작하기
          </button>
        </>
      )}
    </div>
  );
}

export default OnboardingPage;
