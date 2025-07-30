import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/common/Header";
import { usePatchNickname } from "../hooks/mutations/usePatchNickname";
import { useMyInfo } from "../hooks/queries/useMyInfo";

function EditNicknamePage() {
  const navigate = useNavigate();
  const { mutate } = usePatchNickname();
  const { data: myInfo, isLoading } = useMyInfo();

  const [nickname, setNickname] = useState("");

  // 유저 닉네임 초기값 설정
  useEffect(() => {
    if (myInfo?.nickname) {
      setNickname(myInfo.nickname);
    }
  }, [myInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 10) {
      setNickname(e.target.value);
    }
  };

  const handleSubmit = () => {
    mutate(nickname, {
      onSuccess: () => {
        navigate("/mypage/profile", {
          replace: true,
          state: { message: "닉네임이 변경되었어요" }
        });
      }
    });
  };

  const isActive = nickname.trim().length > 0 && nickname !== myInfo?.nickname;

  return (
    <>
      <Header title="닉네임 수정" underline={false} />

      <div className="w-full flex justify-center overflow-hidden">
        <div className="w-[375px] h-[calc(100vh-56px-60px)] px-4 mt-8">
          <p className="text-sm font-medium mb-2">
            새로운 닉네임을 입력해주세요
          </p>
          <input
            type="text"
            value={nickname}
            onChange={handleChange}
            placeholder={myInfo?.nickname || "현재 닉네임"}
            className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-0"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[375px] px-4 py-6 bg-white z-50">
        <button
          disabled={!isActive}
          onClick={handleSubmit}
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
