import { useLocation } from "react-router-dom";
import MenuIcon from "../assets/record/icon-menubar.svg";
import fonts from "../styles/fonts";
import RecordBottomNav from "../components/Record/RecordBottomNav";
import { useState } from "react";
import MiniMap from "../components/Record/MiniMap";
import Header from "../components/common/Header";
import RecordSpinner from "../components/Record/RecordSpinner";


const RecordDetail = () => {
  const { state } = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  const { articleId, title, content,date, mainImageUuid, imageUuids, likeCount=0, }: {
    articleId: number,
    title: string;
    content: string;
    date: string;
    mainImageUuid: string;
    imageUuids: string[];
    likeCount?: number ;
  } = state || {};

  const allImages = mainImageUuid ? [mainImageUuid, ...imageUuids] : [];

  return (
    <>
      {/* 상단바 */}
      <Header title={date} 
              underline={false}
              right={
              <button onClick={() => setShowMenu((prev) => !prev)} className="absolute right-[20px]">
                <img src={MenuIcon} alt="menu" width={3} height={15} />
             </button>}
              
      />
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
                      paddingTop: "10px",
                      marginLeft: "20px"

          }}>
            <div
              dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br />") }}
            />
          </div>

          {/* 이미지 슬라이드 전체 */}
          {allImages.length > 0 && (
            <div className="flex flex-col items-center">
              {/* 가로 슬라이드 */}
              <div
                className="overflow-x-auto no-scrollbar"
                style={{
                  width: "375px",
                  paddingBottom: "15px",
                }}
              >
                <div className="flex gap-[6px] px-[10px]">
                  {allImages.map((src, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[147px] h-[147px] rounded-[12px] overflow-hidden relative"
                    >
                      <img
                        src={src}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                        onLoadStart={() => setIsLoading(true)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 지도 (위도, 경도 임시 지정 */}
          <div
          className="fixed left-1/2 -translate-x-1/2 z-30 mx-auto w-[375px] h-[293px]"
          style={{
            bottom: "70px"
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <MiniMap lat={37.558514} lng={126.925911} />
          </div>
        </div>

          

        </div>
      </div>
       
    
    {/* 하단바 */}
    <RecordBottomNav
      articleId={articleId}
      likes={likeCount}
      ban={3} //임시
      comments={3} //임시
    />
      
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

    {isLoading && <RecordSpinner />}


    </>
  );
};

export default RecordDetail;