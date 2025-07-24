import { useState } from "react";

import Header from "../components/common/Header";

function EditNicknamePage() {
  const [nickname, setNickname] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 10) {
      setNickname(e.target.value);
    }
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
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[375px] px-4 py-6 bg-white z-50 boxShadow:'0px 4px 4px rgba(0, 0, 0, 0.25)' borderRadius: 10,">
        <button
          disabled={!isActive}
          className={`w-full h-10 rounded-[10px] text-sm font-semibold text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)] ${
            isActive ? "bg-[#FFAC33]" : "bg-[#D9D9D9]"
          }`}
        >
          변경 완료
        </button>
      </div>
    </>
  );
}

export default EditNicknamePage;
