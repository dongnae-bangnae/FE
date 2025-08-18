import { useLocation, useNavigate, useParams} from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import MenuIcon from "../assets/record/icon-menubar.svg";
// import CheckIcon_g from "../assets/icon-check-green.svg";
import fonts from "../styles/fonts";
import RecordBottomNav from "../components/Record/RecordBottomNav";
import MiniMap from "../components/Record/MiniMap";
import Header from "../components/common/Header";
import RecordSpinner from "../components/Record/RecordSpinner";
import MypageModal from "../components/MypageModal";
import { useToggleSpamReport } from "../hooks/mutations/useToggleSpamReport";
import { useDeleteArticle } from "../hooks/mutations/useDeleteArticle";
import EditModal from "../components/Record/EditModal";
// import MessagePopup from "../components/MessagaePopup";
import { useArticleViewStore } from "../stores/articleView";
import { fetchArticleDetail } from "../apis/article";

const S3_BASE = "https://dnbn-bucket.s3.ap-northeast-2.amazonaws.com";
const buildImageUrl = (v?: string | null) => {              
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;                    
  return `${S3_BASE}/article/photo/${v}`;                    
};

const cacheKey = (id: number) => `articleView:${id}`;

const RecordDetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
   const { articleId: articleIdParam } = useParams<{ articleId?: string }>();

  const {
    articleId, title, content, date,
    mainImageUuid, imageUuids,
    latitude, longitude,
    likeCount, spamCount, commentCount,
    isReported,
    hydrate, setReported, incSpam, decSpam,
    setCommentCount,
  } = useArticleViewStore((s) => s);

  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const idFromUrl =
    articleIdParam && /^\d+$/.test(articleIdParam) ? Number(articleIdParam) : 0; 
  const idFromState =
    state && typeof state === "object" && (state as any).articleId
      ? Number((state as any).articleId)
      : 0; 
  const stableId = articleId || idFromUrl || idFromState || 0;          

  const { mutate: toggleSpam } = useToggleSpamReport(stableId);       
  const { mutate: deleteArticle } = useDeleteArticle();

  useEffect(() => {
    if (state?.from === "writing") {
      setShowMessage(true);
    }
  }, [state]);

  const toNum = (v: unknown): number | null => {
    const n = 
      typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
    return Number.isFinite(n) ? n : null;
  };

  useEffect(() => {
    if (!stableId) return;
    try {
      const raw = localStorage.getItem(cacheKey(stableId));
      if (!raw) return;
      const cached = JSON.parse(raw);
      // 캐시된 값으로 먼저 화면 채우기
      hydrate({
        articleId: cached.articleId ?? stableId,
        title: cached.title ?? "",
        content: cached.content ?? "",
        date: cached.date ?? "",
        mainImageUuid: cached.mainImageUuid ?? null, 
        imageUuids: Array.isArray(cached.imageUuids) ? cached.imageUuids : [],
        latitude: typeof cached.latitude === "number" ? cached.latitude : null,
        longitude: typeof cached.longitude === "number" ? cached.longitude : null,
        likeCount: typeof cached.likeCount === "number" ? cached.likeCount : 0,
        spamCount: typeof cached.spamCount === "number" ? cached.spamCount : 0,
        commentCount: typeof cached.commentCount === "number" ? cached.commentCount : 0,
        liked: !!cached.liked,
        isReported: !!cached.isReported,
      });
    } catch {
    }
  }, [stableId]);

  useEffect(() => {
    if (!stableId) return;

    (async () => {
      try {
        setIsLoading(true);
        const d = await fetchArticleDetail(stableId);

        // 현재 화면의 값(캐시/작성 하이드레이트 포함)을 유지
        const prev = useArticleViewStore.getState();

        const lat = toNum((d as any).latitude);
        const lng = toNum((d as any).longitude);

        // [IMG MAP] 서버가 uuid만 준 경우 article/photo로 매핑하여 절대 URL 저장
        const srvMainUrl = d.mainImageUuid ? toArticlePhotoUrl(d.mainImageUuid) : null;
        const srvSubUrls: string[] = Array.isArray(d.imageUuids)
        ? d.imageUuids
            .map((u: string) => toArticlePhotoUrl(u))
            .filter((u): u is string => typeof u === "string" && u.length > 0)
        : [];

        // 빈 문자열로 기존 값을 덮어쓰지 않도록 방어
        const safeText = (next: unknown, prevText: string | undefined) =>
          typeof next === "string" && next.trim() !== "" ? next : (prevText ?? "");

        hydrate({
          articleId: d.articleId ?? stableId,
          title: safeText(d.title, prev.title),
          content: safeText(d.content, prev.content),
          date: safeText(d.date, prev.date),
          mainImageUuid: srvMainUrl || prev.mainImageUuid || null, // 서버에 없으면 기존 표시 유지
          imageUuids: srvSubUrls.length ? srvSubUrls : (prev.imageUuids ?? []),
          latitude: lat ?? prev.latitude ?? null,    // 서버 값 없으면 기존 좌표 유지
          longitude: lng ?? prev.longitude ?? null,  // 서버 값 없으면 기존 좌표 유지
          likeCount: d.likeCount ?? prev.likeCount ?? 0,
          spamCount: d.spamCount ?? prev.spamCount ?? 0,
          commentCount: (d as any).commentCount ?? prev.commentCount ?? 0,
          liked: (d as any).liked ?? prev.liked ?? false,
          isReported: (d as any).isReported ?? prev.isReported ?? ((d.spamCount ?? 0) > 0),
        });
      } catch (err) {
        console.error("상세 불러오기 실패:", err);
        alert("게시글을 불러오지 못했어요.");
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableId]);

  useEffect(() => {
    if (!stableId) return;
    const snap = {
      articleId: stableId,
      title,
      content,
      date,
      mainImageUuid,    // 절대 URL
      imageUuids,       // 절대 URL 배열
      latitude,
      longitude,
      likeCount,
      spamCount,
      commentCount,
      isReported,
      liked: false,
    };
    try {
      localStorage.setItem(cacheKey(stableId), JSON.stringify(snap));
    } catch {
      // 저장 실패시 무시
    }
  }, [
    stableId,
    title,
    content,
    date,
    mainImageUuid,
    imageUuids,
    latitude,
    longitude,
    likeCount,
    spamCount,
    commentCount,
    isReported,
  ]);

  const toArticlePhotoUrl = (uuid?: string | null) =>
  uuid ? `${S3_BASE}/article/photo/${uuid}` : null;

  const toImgSrc = (v?: string | null) => {
    if (!v) return "";
    return /^https?:\/\//i.test(v) ? v : `${S3_BASE}/article/photo/${v}`;
  };
  
  const allImages = (mainImageUuid ? [mainImageUuid, ...(imageUuids ?? [])] : (imageUuids ?? []))
    .map((s) => toImgSrc(s));

  const mapLat = useMemo(() => (typeof latitude === "number" && Number.isFinite(latitude) ? latitude : null), [latitude]);
  const mapLng = useMemo(() => (typeof longitude === "number" && Number.isFinite(longitude) ? longitude : null), [longitude]);
  
  const canShowMap = mapLat !== null && mapLng !== null; 

  const handleOpenReportModal = () => {
    setShowConfirm(true);
  };  

  const handleConfirmReport = () => {
    if (isReported) return;

    toggleSpam(true, {
      onSuccess: () => {
        setReported(true);
        incSpam();
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
        setReported(false);
        decSpam()
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
            className="mr-[10px] p-2"
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
              {canShowMap && <MiniMap latitude={mapLat!} longitude={mapLng!} />}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 바 */}
      <RecordBottomNav
        articleId={articleId}
        likes={likeCount}
        spam={spamCount}
        comments={commentCount} 
        isReported={isReported}
        onShowReportModal={handleOpenReportModal}
        onCancelReport={handleCancelReport}
      />

      {showMenu && (
        <EditModal
          onClose={() => setShowMenu(false)}
          onEdit={() => {
            setShowMenu(false);
            // 작성 화면으로 이동
            navigate("/record/write", {
              state: {
                mode: "edit",
                articleId,
              },
            });
          }}
          onDelete={() => {
            setShowMenu(false);
            setShowDeleteModal(true);
          }}
        />
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

      {showDeleteModal && (
        <MypageModal
          title="정말 게시글을 삭제하시겠어요?"
          description="삭제된 게시글은 복구할 수 없습니다."
          cancelText="취소"
          confirmText="삭제"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            if (articleId <= 0) {
              alert("잘못된 접근, 게시글 ID가 없습니다");
              return;
            }
            deleteArticle(articleId, {
              onSuccess: () => {
                alert("게시글이 삭제되었습니다.");
                navigate("/home");
              },
              onError: () => {
                alert("게시글 삭제에 실패했습니다.");
              },
            });
          }}
        />
      )}

      {/* 로딩 스피너 */}
      {isLoading && <RecordSpinner />}
    </>
  );
};

export default RecordDetailPage;
