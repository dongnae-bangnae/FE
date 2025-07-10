import { useState } from "react";

import Header from "../components/common/Header";

function EditNicknamePage() {
  const [nickname, setNickname] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
  };

  const isActive = nickname.trim().length > 0;

  return (
    <>
      <Header title="닉네임 수정" underline={false} />

      {/* 콘텐츠 영역 */}
      <div className="w-full flex justify-center overflow-hidden">
        <div className="w-[375px] h-[calc(100vh-56px-60px)] px-4 mt-8">
          <p className="text-sm font-medium mb-2">
            새로운 닉네임을 입력해주세요
          </p>
          <input
            type="text"
            value={nickname}
            onChange={handleChange}
            placeholder="현재 닉네임"
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[375px] px-4 py-3 bg-white z-50">
        <button
          disabled={!isActive}
          className={`w-full h-10 rounded-md text-sm font-semibold ${
            isActive ? "bg-[#F59E0B]" : "bg-gray-300"
          }`}
        >
          변경 완료
        </button>
      </div>
    </>
  );
}

export default EditNicknamePage;
