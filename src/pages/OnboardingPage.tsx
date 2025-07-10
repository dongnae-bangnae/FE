import { useState } from "react";
import DefaultProfile from "../assets/icon-defaultProfile.svg";
import CameraIcon from "../assets/icon-camera.svg";
import SearchIcon from "../assets/icon-search.svg";
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [areaInput, setAreaInput] = useState("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

  const handleNextFromNickname = () => {
    if (nickname.trim() === "") {
      setNicknameError("닉네임을 입력해주세요!");
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

  return (
    <div className="w-full max-w-[390px] mx-auto min-h-screen bg-white flex flex-col">
      {/* Header */}
      {step === 1 && <Header title="프로필 수정" underline />}
      {step === 2 && <Header title="" onBack={() => setStep(1)} />}
      {step === 3 && <Header title="동네 선택" onBack={() => setStep(2)} />}

      {/* STEP 1 */}
      {step === 1 && (
        <>
          {/* 이미지 */}
          <div className="flex justify-center pt-[38.5px] pb-[40px]">
            <div className="relative w-[111px] h-[111px]">
              <img
                src={DefaultProfile}
                alt="프로필"
                className="w-full h-full"
              />
              <img
                src={CameraIcon}
                alt="카메라"
                className="absolute bottom-0 right-0 w-8 h-8"
              />
            </div>
          </div>

          {/* 닉네임 */}
          <div className="px-6">
            <label className="block mb-4 text-[14px] font-semibold">
              닉네임
            </label>
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
          </div>

          {/* 버튼 */}
          <div className="mt-auto flex justify-center pb-[30px]">
            <button
              onClick={handleNextFromNickname}
              className={`w-[264px] h-[56px] rounded-[10px] text-[17px] font-bold leading-[150%] ${
                nickname.trim()
                  ? "bg-[#FFAC33] text-white"
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
          <div className="mt-[69px] ml-[26px] mb-[22px]">
            <h2 className="text-[24px] font-normal text-black">
              좋아하는 동네를 알려주세요!
            </h2>
          </div>

          {/* 검색박스 */}
          <div
            onClick={() => setStep(3)}
            className="flex items-center mx-[26px] border border-[#A9A9A9] rounded-[5px] h-[48px] px-[13px] cursor-pointer"
          >
            <img
              src={SearchIcon}
              alt="검색"
              className="w-[25px] h-[25px] mr-[7px]"
            />
            <span className="text-[16px] text-[#666]">동네명 검색</span>
          </div>

          {/* 최대 3개 선택 */}
          <p className="mt-[22px] ml-[26px] text-[20px] text-[#FF6A00]">
            최대 3개 선택
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
              className={`w-[264px] h-[56px] rounded-[10px] text-[17px] font-bold leading-[150%] ${
                selectedAreas.length === 0
                  ? "bg-[#D9D9D9] text-gray-500"
                  : "bg-[#FFAC33] text-white"
              }`}
              onClick={() => {
                if (selectedAreas.length > 0) {
                  navigate("/home");
                }
              }}
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

          {/* 주황색 박스 */}
          <div className="flex flex-col justify-center items-center gap-[10px] bg-[#FFAC33] mt-4 w-full px-4 h-[76px]">
            <div className="flex items-center w-full h-[48px] px-[13px] border border-gray-300 rounded-[5px] bg-white">
              <img
                src={SearchIcon}
                alt="검색"
                className="w-[25px] h-[25px] mr-[7px]"
              />
              <input
                type="text"
                placeholder="동네명 검색"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                onKeyDown={handleAreaKeyDown}
                className="flex-1 text-[16px] outline-none"
              />
            </div>
          </div>

          {/* 상단선 + 문구 + 태그 묶음 */}
          <div className="mt-88">
            {/* 상단선 */}
            <div className="w-full border-t border-gray-300" />

            {/* 문구 */}
            <p className="mt-2 ml-6 text-[14px] font-normal text-[#FF6A00]">
              최대 3개 선택
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
