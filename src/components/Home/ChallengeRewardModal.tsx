import { IoClose } from "react-icons/io5";

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return ""; // 또는 "날짜 없음"
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

interface ChallengeRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    challengeId: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
  };
}

export default function ChallengeRewardModal({
  isOpen,
  onClose,
  data
}: ChallengeRewardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 본체 */}
      <div className="relative w-[360px] h-[406px] z-10">
        {/* 노란 테두리 박스 */}
        <div
          className="w-full h-full rounded-[10px] shadow-xl flex flex-col"
          style={{
            background:
              "linear-gradient(100deg, #FFCB0C 2.49%, #FF9700 53.97%)",
            border: "5px solid #FFD700",
            boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)"
          }}
        >
          {/* X 버튼 영역 */}
          <div className="flex justify-end items-center p-[10px_13px] gap-[10px]">
            <button className="text-black text-xl" onClick={onClose}>
              <IoClose />
            </button>
          </div>

          {/* 본문 콘텐츠 영역 */}
          <div className="flex flex-col px-5 pb-5 gap-4 text-center text-[#1E1E1E] text-[16px] leading-snug items-center">
            {/* 타이틀 */}
            <h2 className="text-white text-[24px] font-extrabold text-center leading-normal font-pretendard">
              {data?.title || "동네방네 8월 기록 챌린지 안내"}
            </h2>

            {/* 본문 영역 – 제목과 15px 간격 */}
            <div className="mt-[15px] flex flex-col items-center text-center text-[#1E1E1E] text-[16px] font-normal leading-normal font-pretendard gap-[10px]">
              {/* 챌린지 기간 */}
              <div>
                <p className="font-bold">📅 챌린지 기간</p>
                <p>
                  {data
                    ? `${formatDate(data.startDate)} ~ ${formatDate(data.endDate)}`
                    : "8월 1일 ~ 8월 31일"}
                </p>
              </div>

              {/* 우수 기록 */}
              <div>
                <p className="font-bold">🎁 우수 기록 선정 시!</p>
                <p>
                  ✔ 모든 사용자의 홈탭 새 글 최상단에
                  <br />
                  1주일간 고정 노출
                </p>
                <p>✔ 챌린지 배지와 함께 특별 표시</p>
              </div>

              {/* 선정 기준 */}
              <div>
                <p className="font-bold">🏅 선정 기준</p>
                <p>
                  8월 챌린지 참여 게시물 중<br />
                  좋아요 수가 가장 높은 글
                </p>
                <p className="text-white text-[14px] font-normal font-pretendard">
                  (동점일 경우, 더 먼저 작성된 글 우선)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
