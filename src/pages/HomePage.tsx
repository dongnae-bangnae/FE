import Header from "../components/common/Header";
import BottomTabBar from "../components/common/BottomTabBar";
import PreviewPost from "../components/Home/PostCardPreview";
import { useNavigate } from "react-router-dom";
import sampleImage from "../assets/record/img1.jpg";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen relative bg-[#f5f5f5]">
      {/* 헤더 */}
      <Header
        title=""
        left={<span className="text-[18px] font-semibold ml-1">홈</span>}
      />

      {/* 메인 스크롤 영역 */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Section: 새글 */}
        <section className="w-full flex flex-col gap-2 bg-[#FFDEAE] px-0 py-4">
          <div className="flex justify-between items-center w-full px-4 py-[5px]">
            <h2 className="text-[20px] font-bold">새 글</h2>
            <button
              onClick={() => navigate("/record/list")} // 여기!
              className="text-[14px] bg-[#fff] rounded-[8px] px-4 py-1 border border-gray-300"
            >
              게시물 확인하기
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <PreviewPost
                key={i}
                id={String(i)}
                profileImage="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png"
                author="커비"
                date="2025.8.25"
                title="연남동 파스타 맛집에서 데이트"
                image={sampleImage}
                onClick={() => navigate(`/post/${i}`)}
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
              className="absolute top-[-11px] left-[7px] text-[12px] font-medium"
              style={{
                background: "#FFD700",
                borderRadius: "15px 0px 20px 0px",
                padding: "11px 7px"
              }}
            >
              동네방네 8월 기록 챌린지
            </span>

            {/* 텍스트 */}
            <div className="flex flex-col gap-1 mt-[30px] ml-[20px]">
              <div className="flex items-center gap-1">
                <span
                  style={{
                    color: "#FFFFFF",
                    fontSize: "20px",
                    fontWeight: 900,
                    fontFamily: "Inter"
                  }}
                >
                  올 여름,
                </span>
                <span
                  style={{
                    color: "#000",
                    fontSize: "30px",
                    fontWeight: 900,
                    fontFamily: "Inter",
                    lineHeight: "normal",
                    textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
                    transform: "rotate(-10deg)"
                  }}
                >
                  💌
                </span>
                <span
                  style={{
                    color: "#000",
                    fontSize: "30px",
                    fontWeight: 900,
                    fontFamily: "Inter",
                    lineHeight: "normal",
                    textShadow: "0px 4px 4px rgba(0,0,0,0.25)",
                    transform: "rotate(10deg)"
                  }}
                >
                  🏝️
                </span>
              </div>
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "17px",
                  fontWeight: 900,
                  fontFamily: "Inter"
                }}
              >
                내 동네 풍경을 담아보자!
              </span>
            </div>

            {/* 버튼 */}
            <div
              className="flex flex-col gap-[10px]"
              style={{
                position: "absolute",
                top: "35px",
                right: "19px"
              }}
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
      <BottomTabBar />
    </div>
  );
}

export default HomePage;
