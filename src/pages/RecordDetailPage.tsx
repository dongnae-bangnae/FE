import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import BackIcon from "../assets/top/icon-top-backArrow.svg";
import MenuIcon from "../assets/record/icon-menubar.svg";
import fonts from "../styles/fonts";
import RecordBottomNav from "../components/Record/RecordBottomNav";
import { useState } from "react";


const RecordDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const { title, content, images, date }: {
    title: string;
    content: string;
    images: string[];
    date: string;

  } = state || {};

  return (
    <>
      {/* 상단 바 */}
      <div
        className="w-full flex items-center justify-between "
        style={{ fontFamily: fonts.family, padding: "14px 20px", height: "56px" }}
      >
        <button onClick={() => navigate("/")} style={{ all: "unset", cursor: "pointer" }}>
          <img src={BackIcon} alt="back" width={30} height={28} />
        </button>
    
        <div className="flex items-center gap-[6px]" style={{ fontSize: fonts.size.body, fontWeight: fonts.weight.medium }}>
          <span>{date}</span>
        </div>

        <button onClick={() => setShowMenu((prev) => !prev)}>
          <img src={MenuIcon} alt="menu" width={3} height={15} />
        </button>

      </div>
      

      {/* 본문 */}
      <div className="w-full flex justify-center" style={{fontFamily: fonts.family}}>
        <div style={{width: "375px"}} >
          {/* 제목 */}
          <div className="border-b border-[#999999] text-left mx-auto"
              style={{fontSize: fonts.size.title, 
                          fontWeight: fonts.weight.medium,
                          height: "46px",
                          lineHeight: "48px",
                          marginBottom: "20px",
                          paddingTop: "20px",
                          paddingBottom: "70px",
                          paddingLeft: "20px"
                    

          }}>
            <span>{title}</span>
          </div>

          {/* 내용 */}
          <div className="text-left"
              style={{fontSize: fonts.size.body, 
                      fontWeight: fonts.weight.regular,
                      paddingBottom: "70px",
                      paddingTop: "20px",
                      marginLeft: "20px"

          }}>
            <span>{content}</span>
          </div>

          {/* 이미지 슬라이드 전체 */}
          {images.length > 0 && (
            <div className="flex flex-col items-center mb-[30px]">
              {/* 가로 슬라이드 */}
              <div
                className="overflow-x-auto no-scrollbar"
                style={{
                  width: "390px",
                  paddingBottom: "10px",
                }}
              >
                <div className="flex gap-[6px] px-[10px]">
                  {images.map((src, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[147px] h-[147px] rounded-[12px] overflow-hidden relative"
                    >
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}




          

          {/* 지도 */}
          <div className="mx-auto w-[370px] h-[250px] border text-center mt-[50px]">
         미니맵
          </div>

        </div>
      </div>
    
    {/* 하단바 */}
    <RecordBottomNav likes={8} ban={1} comments={3} active="comment"/>
      
    {showMenu && (
      <div
        className="absolute right-5 top-[76px] z-50 bg-white border border-gray-300 rounded-[10px] shadow-md"
        style={{ width: "100px" }}
      >
        <button
          className="w-full px-4 py-2 border-b text-sm text-left hover:bg-gray-100"
          onClick={() => {
            setShowMenu(false);
            // 수정 
          }}
        >
          수정
        </button>
        <button
          className="w-full px-4 py-2 border-b text-sm text-left hover:bg-gray-100"
          onClick={() => {
            setShowMenu(false);
            // 삭제 
          }}
        >
          삭제
        </button>
        <button
          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
          onClick={() => setShowMenu(false)}
        >
          취소
        </button>
      </div>
    )}


    </>
  );
};

export default RecordDetail;