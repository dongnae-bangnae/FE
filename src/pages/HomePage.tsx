import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import BottomTabBar from "../components/common/BottomTabBar";
import PreviewPost from "../components/Home/PostCardPreview";
import ChallengeRewardModal from "../components/Home/ChallengeRewardModal";
import sampleImage from "../assets/record/img1.jpg";
import { getChallengeDetail } from "../apis/home";
import { getNewArticles } from "../apis/home";
import { ArticlePreview } from "../types/article";
import DefaultProfile from "../assets/icon-defaultProfile.svg";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

function HomePage() {
  const navigate = useNavigate();
  const [isRewardOpen, setIsRewardOpen] = useState(false);

  const { data: challengeDetail } = useQuery({
    queryKey: ["challengeDetail", "1"],
    queryFn: () => getChallengeDetail("1"),
    enabled: isRewardOpen,
    staleTime: 1000 * 60 * 10 // 10분 동안은 stale 아님 → 캐시 유지
  });

  const { data: newArticles = [] } = useQuery<ArticlePreview[]>({
    queryKey: ["newArticles"],
    queryFn: () => getNewArticles(1),
    staleTime: 1000 * 60 * 5
  });

  return (
    <div className="flex flex-col min-h-screen relative bg-[#f5f5f5]">
      {/* 헤더 */}
      <Header
        title=""
        left={<span className="text-[18px] font-semibold ml-1">홈</span>}
      />
      <div style={{ height: "10px" }} className="bg-white" />
      {/* 메인 스크롤 영역 */}
      <div className="relative flex-1 flex flex-col overflow-y-auto pb-[67px]">
        {/* Section: 새글 */}
        <section className="w-full flex flex-col gap-2 bg-[#FFDEAE] px-0 py-4 min-h-[317px]">
          <div className="flex justify-between items-center w-full px-4 py-[5px]">
            <h2 className="text-[20px] font-bold">새 글</h2>
            <button
              onClick={() => navigate("/record/list")}
              className="text-[14px] bg-[#fff] rounded-[8px] px-4 py-1 border border-gray-300"
            >
              게시물 확인하기
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
            {newArticles.map((article) => (
              <PreviewPost
                key={article.id}
                id={String(article.id)}
                profileImage={article.profileImageUrl || DefaultProfile}
                author={article.authorNickname}
                date={formatDate(article.createdAt)}
                title={article.title}
                image={article.imageUrl || sampleImage}
                onClick={() => navigate(`/record/${article.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Section: 챌린지 */}
        <section className="w-full flex justify-center items-center h-[198px] bg-white relative">
          <div
            className="w-[359px] h-[124px] flex flex-col justify-center px-4"
            style={{
              borderRadius: "10px",
              border: "5px solid #FFD700",
              background:
                "linear-gradient(100deg, #FFCB0C -14.48%, #FF9700 99.42%)",
              boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
              position: "relative"
            }}
          >
            {/* 라벨 */}
            <span
              className="absolute top-[-11px] left-[7px] text-[12px] font-medium flex justify-center items-center"
              style={{
                width: "149px",
                height: "39px",
                background: "linear-gradient(0deg, #FFD700 0%, #FFD700 100%)",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                borderRadius: "15px 0px 20px 0px",
                padding: "11px 7px",
                gap: "10px",
                flexShrink: 0
              }}
            >
              동네방네 8월 기록 챌린지
            </span>

            {/* 텍스트 영역 (relative로 기준 잡기) */}
            <div className="flex flex-col gap-1 mt-[30px] ml-[20px] relative">
              {/* 💌 이모지 */}
              <span
                style={{
                  position: "absolute",
                  top: "-15px",
                  left: "73px",
                  width: "35.334px",
                  height: "38.026px",
                  transform: "rotate(-16.858deg)",
                  flexShrink: 0,
                  color: "#000",
                  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  fontFamily: "Pretendard",
                  fontSize: "30px",
                  fontStyle: "normal",
                  fontWeight: 900,
                  lineHeight: "normal",
                  display: "inline-block",
                  zIndex: 0
                }}
              >
                💌
              </span>
              {/* 🏝️ 이모지 */}
              <span
                style={{
                  position: "absolute",
                  top: "-15.11px",
                  left: "132.5px",
                  width: "28.843px",
                  height: "32.648px",
                  transform: "rotate(9.938deg)",
                  flexShrink: 0,
                  color: "#000",
                  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  fontFamily: "Pretendard",
                  fontSize: "30px",
                  fontStyle: "normal",
                  fontWeight: 900,
                  lineHeight: "normal",
                  display: "inline-block",
                  zIndex: 0
                }}
              >
                🏝️
              </span>

              {/* 텍스트 */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "20px",
                    fontWeight: 900,
                    fontFamily: "Pretendard",
                    display: "block"
                  }}
                >
                  올 여름,
                </span>
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "20px",
                    fontWeight: 900,
                    fontFamily: "Pretendard"
                  }}
                >
                  내 동네 풍경{" "}
                </span>
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "17px",
                    fontWeight: 900,
                    fontFamily: "Pretendard"
                  }}
                >
                  을 담아보자!
                </span>
              </div>
            </div>

            {/* 버튼 */}
            <div
              className="flex flex-col gap-[10px]"
              style={{ position: "absolute", top: "35px", right: "19px" }}
            >
              <button
                style={{
                  width: "83px",
                  height: "30px",
                  background: "rgba(255,245,245,0.90)",
                  borderRadius: "8px",
                  fontFamily: "Pretendard",
                  fontSize: "10px",
                  fontWeight: 400,
                  lineHeight: "150%",
                  textAlign: "center"
                }}
              >
                기록하기
              </button>
              <button
                onClick={() => setIsRewardOpen(true)}
                style={{
                  width: "83px",
                  height: "30px",
                  background: "rgba(255,245,245,0.90)",
                  borderRadius: "8px",
                  fontFamily: "Pretendard",
                  fontSize: "10px",
                  fontWeight: 400,
                  lineHeight: "150%",
                  textAlign: "center"
                }}
              >
                보상 확인하기
              </button>
            </div>
          </div>
        </section>

        {/* Section: 맞춤 큐레이션 */}
        <section className="w-full flex flex-col gap-2 bg-[#D6EBFF] px-0 py-4">
          <div className="w-full px-4">
            <h2 className="text-[20px] font-bold">맞춤 큐레이션</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <PreviewPost
                key={i}
                id={String(i)}
                profileImage="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png"
                author="푸짐바오"
                date="2시간 전"
                title="연남동 지브리 카페 다녀왔어요"
                image={sampleImage}
                onClick={() => navigate(`/post/${i}`)}
              />
            ))}
          </div>
        </section>
      </div>

      {/* 하단 탭바 */}
      <BottomTabBar className="fixed bottom-0 left-0 w-full z-50" />

      <ChallengeRewardModal
        isOpen={isRewardOpen}
        onClose={() => setIsRewardOpen(false)}
        data={challengeDetail}
      />
    </div>
  );
}

export default HomePage;
