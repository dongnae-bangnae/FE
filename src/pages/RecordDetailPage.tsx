import { useLocation, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import MenuIcon from "../assets/record/icon-menubar.svg";
// import CheckIcon_g from "../assets/icon-check-green.svg";
import fonts from "../styles/fonts";
import RecordBottomNav from "../components/Record/RecordBottomNav";
import MiniMap from "../components/Record/MiniMap";
import Header from "../components/common/Header";
import RecordSpinner from "../components/Record/RecordSpinner";
import MypageModal from "../components/MypageModal";
import { useToggleSpamReport } from "../hooks/mutations/useToggleSpamReport";
// import MessagePopup from "../components/MessagaePopup";

const RecordDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    articleId,
    title,
    content,
    date,
    mainImageUuid,
    imageUuids,
    likeCount = 0,
    spamCount = 0,
    latitude,
    longitude,
    // placeName,
    // detailAddress,
  }: {
    articleId: number;
    title: string;
    content: string;
    date: string;
    mainImageUuid: string;
    imageUuids: string[];
    likeCount?: number;
    spamCount?: number;
    latitude: number;
    longitude: number;
    placeName: string;
    detailAddress: string;
  } = state || {};

  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [spamCountState, setSpamCountState] = useState(spamCount);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [isReported, setIsReported] = useState(spamCount>0);
  const [showMessage, setShowMessage] = useState(false);
  const { mutate: toggleSpam } = useToggleSpamReport(articleId);

  useEffect(() => {
    if (state?.from === "writing") {
      setShowMessage(true);
    }
  }, [state]);
  
  
  const allImages = mainImageUuid
    ? [mainImageUuid, ...imageUuids]
    : imageUuids;


  const handleOpenReportModal = () => {
    setShowConfirm(true);
  };  

  const handleConfirmReport = () => {
    if (isReported) return;

    toggleSpam(true, {
      onSuccess: () => {
        setIsReported(true);
        setSpamCountState((prev) => prev + 1);
        setShowConfirm(false);
      },
      onError: () => {
        alert("신고 처리 중 오류가 발생했습니다.");
      },
    });
  };

  const handleCancelReport = () => {
    toggleSpam(false, {
      onSuccess: () => {
        setIsReported(false);
        setSpamCountState((prev) => Math.max(prev - 1, 0));
      },
      onError: () => {
        alert("신고 취소 중 오류가 발생했습니다.");
      },
    });
  };


  return (
    <>
     {/* {showMessage && (
        <MessagePopup
          icon={<img src={CheckIcon_g} alt="확인" className="w-[16px] h-[16px]" />}
          message="게시물이 등록되었어요"
        />
      )} */}

      {/* <MessagePopup 
          icon={CheckIcon_g}
          message="게시물이 등록되었어요"
      /> */}

      {/* 상단바 */}
      <Header
        title={date}
        underline={false}
        onBack={() => navigate('/home')}
        right={
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="absolute right-[20px]"
          >
            <img src={MenuIcon} alt="menu" width={3} height={15} />
          </button>
        }
      />

      {/* 본문 */}
      <div className="w-full flex justify-center" style={{ fontFamily: fonts.family }}>
        <div style={{ width: "375px" }}>
          {/* 제목 */}
          <div
            className="border-b border-[#999999] text-left mx-auto"
            style={{
              fontSize: fonts.size.title,
              fontWeight: fonts.weight.medium,
              height: "46px",
              lineHeight: "48px",
              marginBottom: "20px",
              paddingTop: "20px",
              paddingBottom: "70px",
              paddingLeft: "20px",
            }}
          >
            <span>{title}</span>
          </div>

          {/* 내용 */}
          <div
            className="text-left"
            style={{
              fontSize: fonts.size.body,
              fontWeight: fonts.weight.regular,
              paddingBottom: "70px",
              paddingTop: "10px",
              marginLeft: "20px",
            }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: content.replace(/\n/g, "<br />"),
              }}
            />
          </div>


          {/* 지도 - 임시 위치 */}
          <div
            className="fixed left-1/2 -translate-x-1/2 z-30 mx-auto w-[375px] h-[270px]"
            style={{ bottom: "70px"}}
          >
            {/* 이미지 슬라이드 */}
            {allImages.length > 0 && (
              <div className="absolute left-0 bottom-[270px] w-full overflow-x-auto no-scrollbar px-[10px]"
                   style={{marginBottom: "20px"}}
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
            )}

            <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
              <MiniMap latitude={latitude} longitude={longitude} />
            </div>
          </div>
        </div>
      </div>

      {/* 하단 바 */}
      <RecordBottomNav
        articleId={articleId}
        likes={likeCount}
        spam={spamCountState}
        comments={commentCount} 
        isReported={isReported}
        onShowReportModal={handleOpenReportModal}
        onCancelReport={handleCancelReport}

      />

      {/* 메뉴 모달 */}
      {showMenu && (
        <div
          className="absolute right-5 top-[76px] z-50 bg-white border border-gray-300 rounded-[10px] shadow-md"
          style={{ width: "100px" }}
        >
          <button
            className="w-full px-4 py-2 border-b text-sm text-left hover:bg-gray-100"
            onClick={() => {
              setShowMenu(false);
              // 수정 기능
            }}
          >
            수정
          </button>
          <button
            className="w-full px-4 py-2 border-b text-sm text-left hover:bg-gray-100"
            onClick={() => {
              setShowMenu(false);
              // 삭제 기능
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

      {showConfirm && (
        <MypageModal
          title="정말 광고 의심 신고를 하시겠어요?"
          description="허위 신고는 제재 대상이 될 수 있습니다."
          cancelText="취소"
          confirmText="신고"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleConfirmReport}
        />
      )}

      {/* 로딩 스피너 */}
      {isLoading && <RecordSpinner />}
    </>
  );
};

export default RecordDetailPage;