import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCreateArticle } from "../hooks/mutations/useCreateArticle";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import BackIcon from "../assets/top/icon-top-backArrow.svg";
import SelectIcon from "../assets/top/icon-top-select.svg";
import CalendarIcon from "../assets/icon-calendar.svg";
import GalleryIcon from "../assets/record/icon-image-yellow.svg";
import FileIcon from "../assets/icon-file.svg";
import PinIcon from "../assets/icon-pin.svg";
import CalendarModal from "../components/Record/CalendarModal";
import ImagePreview from "../components/Record/ImagePreview";
import GalleryPreview from "../components/Record/GalleryPreview";
import VerticalToolbar from "../components/Record/VerticalToolbar";
import MiniMap from "../components/Record/MiniMap";
// import { useEditArticle } from "../hooks/mutations/useEditArticle";
import { useCategorySelectionStore } from "../stores/categorySelection";
import { useShallow } from "zustand/react/shallow";
import { usePinDraftStore } from "../stores/pinDraftStore";
import { useArticleDraftStore } from "../stores/articleDraft";
import { useArticleViewStore } from "../stores/articleView";
import { useCreateArticleWithLocation } from "../hooks/mutations/useCreateArticleWithLocation";
import { useEditArticle } from "../hooks/mutations/useEditArticle";
import { editArticle, fetchArticleDetail } from "../apis/article";
import { useSaveModeStore } from "../stores/saveModeStore";
import { useMapViewStore } from "../stores/mapViewStore";

//S3 경로 변환
const S3_BASE = "https://dnbn-bucket.s3.ap-northeast-2.amazonaws.com";
const ARTICLE_PHOTO_BASE = `${S3_BASE}/article/photo`;

const buildImageUrl = (v?: string | null) => {
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `${ARTICLE_PHOTO_BASE}/${v}`;
};

function RecordWritingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const articleIdFromStore = Number(useArticleViewStore((s) => s.articleId)) || 0; 
  const rawState = (location.state as any) || {};                                  
  const fromEdit = rawState?.mode === "edit";                                                
  const stateArticleId = Number(rawState.articleId) || 0;                      
  const editArticleId = stateArticleId || articleIdFromStore;                     
  const isEditMode = fromEdit && editArticleId > 0;

  const { reset: resetSaveMode } = useSaveModeStore();
  useEffect(() => {

    resetSaveMode();
  }, [resetSaveMode]);

  const { reset: resetMapSearch } = useMapViewStore();
  useEffect(() => {
    resetMapSearch();
  }, [resetMapSearch]); 



  const {
    title, content, selectedImages, mainImageUuid, selectedDate,
    setTitle, setContent, setDate, addImages, toggleImage, setMain, hydrateFromEdit, reset: resetDraft,
  } = useArticleDraftStore(useShallow((s) => ({
    title: s.title,
    content: s.content,
    selectedImages: s.selectedImages,
    mainImageUuid: s.mainImageUuid,
    selectedDate: s.selectedDate,
    setTitle: s.setTitle,
    setContent: s.setContent,
    setDate: s.setDate,
    addImages: s.addImages,
    toggleImage: s.toggleImage,
    setMain: s.setMain,
    hydrateFromEdit: s.hydrateFromEdit,
    reset: s.reset,
  })));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { categoryId, categoryName, reset } = useCategorySelectionStore(
    useShallow((s) => ({
      categoryId: s.categoryId,
      categoryName: s.categoryName,
      reset: s.reset,
    }))
  );

  const { mode, placeName, pinCategory, detailAddress, placeId, latitude, longitude } = usePinDraftStore(
    useShallow((s) => {
      if (s.mode === "existing") {
        return {
          mode: s.mode,
          placeName: s.placeName,
          pinCategory: s.pinCategory,
          detailAddress: s.detailAddress,
          placeId: s.placeId,
          latitude: null,
          longitude: null,
        };
      } else if (s.mode === "new") {
        return {
          mode: s.mode,
          placeName: s.placeName,
          pinCategory: s.pinCategory,
          detailAddress: s.detailAddress,
          placeId: null,
          latitude: s.latitude,
          longitude: s.longitude,
        };
      } else {
        return {
          mode: s.mode,
          placeName: null,
          pinCategory: null,
          detailAddress: null,
          placeId: null,
          latitude: null,
          longitude: null,
        };
      }
    })
  );
  const resetPin = usePinDraftStore((s) => s.reset);

  const { mutateAsync: createAtPlace } = useCreateArticle(); // 기존핀
  const { mutateAsync: createWithLocation } = useCreateArticleWithLocation(); // 미등록장소
  // const { mutateAsync: editMutate } = useEditArticle(editArticleId);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  // dataURL ↔ File 매핑
  const fileMapRef = useRef<Map<string, File>>(new Map());

  /** 수정 진입: 서버 uuid를 article/photo URL로 매핑해 미리보기 표시 */
  useEffect(() => {
    if (!isEditMode || !editArticleId) return;

    (async () => {
      try {
        const d = await fetchArticleDetail(editArticleId);
        setTitle(d.title ?? "");
        setContent(d.content ?? "");
        setDate(d.date ?? "");

        const imgs: string[] = [];
        if (d.mainImageUuid) imgs.push(buildImageUrl(d.mainImageUuid)); // [FIX: S3 PATH]
        if (Array.isArray(d.imageUuids)) {
          imgs.push(...d.imageUuids.map((u) => buildImageUrl(u))); // [FIX: S3 PATH]
        }
        if (imgs.length) {
          addImages(imgs);
          setMain(imgs[0]);
        }
      } catch (e) {
        console.error("수정 로딩 실패:", e);
        alert("게시글 정보를 불러오지 못했습니다.");
        navigate(-1);
      }
    })();
  }, [isEditMode, editArticleId]);

  // 선택 첫 번째를 메인으로 유지
  useEffect(() => {
    setMain(selectedImages.length > 0 ? selectedImages[0] : null);
  }, [selectedImages, setMain]);

  //uuid 추출
  const uuidRe = /^[0-9a-fA-F-]{36}$/;
  const isArticlePhotoUrl = (src: string) => {
    try { return new URL(src).pathname.includes("/article/photo/"); }
    catch { return src.includes("/article/photo/"); }
  };
  const isDefaultImageUrl = (src: string) => {
    try { return new URL(src).pathname.includes("/default-images/"); }
    catch { return src.includes("/default-images/"); }
  };
  const extractLastPathSegment = (src: string) => {
    try {
      const u = new URL(src);
      const last = u.pathname.split("/").filter(Boolean).pop() || "";
      return last.split("?")[0];
    } catch {
      const last = src.split("/").filter(Boolean).pop() || "";
      return last.split("?")[0];
    }
  };

  const stripExt = (name: string) => name.replace(/\.(png|jpe?g|webp|gif|bmp|svg)$/i, "");

   const asUuid = (src?: string | null) => {
    if (!src) return "";
    if (uuidRe.test(src)) return src; // 이미 uuid인 경우

    if (isDefaultImageUrl(src) || isArticlePhotoUrl(src)) {
      return stripExt(extractLastPathSegment(src));
    }
    return "";
  };

  const dataUrlToFile = (dataUrl: string, filename: string) => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
    return new File([u8arr], filename, { type: mime });
  };

  const commitReorder = (from: number | null, to: number | null) => {
    if (from == null || to == null || from === to) return;

    const next = [...selectedImages];
    const [dragged] = next.splice(from, 1); 
    next.splice(to, 0, dragged);            

    hydrateFromEdit({
      title,
      content,
      selectedDate,
      selectedImages: next,
      mainImageUuid: next[0] ?? null,
    } as any);
    setMain(next[0] ?? null);
  };

  const handleSubmit = async () => {
    if (categoryId == null) return alert("카테고리를 먼저 선택해 주세요.");
    if (pinCategory == null) return alert("핀 카테고리를 선택해 주세요.");
    if (!detailAddress?.trim()) return alert("상세 주소가 필요해요.");
    const addr = detailAddress.trim();

    const missing: string[] = [];
    if (!title.trim()) missing.push("제목");
    if (!content.trim()) missing.push("내용");

    // 전체 선택 목록에서 파일/uuid 분리
   const firstSelected = selectedImages[0];

    // 업로드 파일 대상(= uuid 없는 것)만 파일로 묶기
    const fileCandidates = selectedImages
      .map((src, idx) => ({ src, idx }))
      .filter(({ src }) => asUuid(src) === "");

      const filesForUpload: File[] = [];
      for (const { src, idx } of fileCandidates) {
      // 1) 파일 input에서 온 dataURL은 fileMapRef에 File로 저장되어 있음
      let file = fileMapRef.current.get(src);

      // 2) 혹시 없으면 dataURL/Blob/HTTP에서 직접 File 생성
      if (!file) {
        if (src.startsWith("data:")) {
          file = dataUrlToFile(src, `image-${idx + 1}.png`);
        } else if (src.startsWith("blob:") || /^https?:\/\//i.test(src)) {
          try {
            const res = await fetch(src);
            const blob = await res.blob();
            const ext = (blob.type && blob.type.split("/")[1]) || "png";
            file = new File([blob], `image-${idx + 1}.${ext}`, {
              type: blob.type || "image/png",
            });
          } catch (e) {
            console.warn("파일 변환 실패:", src, e);
            continue; // 실패한 항목은 건너뜀
          }
        } else {
          // 그 외는 업로드 불가 소스 → 건너뜀
          continue;
        }
      }

      filesForUpload.push(file);
    }

    // 서버로 보낼 uuid 배열 (디폴트/기존 이미지 모두 포함)
    const orderedUuids = selectedImages
      .map(asUuid)
      .filter(Boolean);

    // 대표사진: 1번이 uuid면 mainImageUuid, 아니면 파일 대표(mainIndex)
    let mainUuid = "";
    let mainIndex: number | undefined;
    const firstUuid = asUuid(firstSelected);
    if (firstUuid) {
      mainUuid = firstUuid;
    } else {
      const idxInFiles = fileCandidates.findIndex(fc => fc.src === firstSelected);
      mainIndex = idxInFiles >= 0 ? idxInFiles : 0;
    }

    const imageUuids = mainUuid
      ? orderedUuids.filter((u) => u !== mainUuid)
      : orderedUuids;

      console.log({
        firstSelected,
        orderedUuids,
        mainUuid,
        imageUuids,
        filesForUploadCount: filesForUpload.length,
        mainIndex,
      }); 
      console.log({ isEditMode, editArticleId })

      //확인용 디버그 로그

    setIsLoading(true);
    try {
      if (isEditMode && editArticleId) {
        const payload: any = {
          title,
          content,
          date: selectedDate,
          mainImageUuid: mainUuid || undefined,
          imageUuids,
          files: filesForUpload,
          mainIndex,
        };

         await editArticle(editArticleId, payload);

         const snap = {
          articleId: editArticleId,
          title,
          content,
          date: selectedDate,
          mainImageUuid: mainUuid ? buildImageUrl(mainUuid) : null,
          imageUuids: imageUuids.map(buildImageUrl),
          latitude: typeof latitude === "number" ? latitude : null,
          longitude: typeof longitude === "number" ? longitude : null,
          likeCount: 0,
          spamCount: 0,
          commentCount: 0,
          liked: false,
          isReported: false,
        };
        localStorage.setItem(`articleView:${editArticleId}`, JSON.stringify(snap));

        // 로컬 뷰(표시는 article/photo/{uuid})
        useArticleViewStore.getState().hydrate({
          articleId: editArticleId,
          title,
          content,
          date: selectedDate,
          mainImageUuid: mainUuid ? buildImageUrl(mainUuid) : null,         
          imageUuids: imageUuids.map(buildImageUrl),                      
          latitude: typeof latitude === "number" ? latitude : null,
          longitude: typeof longitude === "number" ? longitude : null,
          likeCount: 0,
          spamCount: 0,
          commentCount: 0,
          liked: false,
          isReported: false,
        });

        reset(); resetPin(); resetDraft();
        navigate(`/record/${editArticleId}`, { state: { from: "writing" } });
        return;
      }

      // 등록
      let result;
      if (typeof placeId === "number") {
        result = await createAtPlace({
          categoryId,
          placeId,
          title,
          content,
          date: selectedDate,
          detailAddress: addr,
          placeName,
          pinCategory,
          mainImageUuid: mainUuid || undefined,                              
          imageUuids,
          files: filesForUpload,                                             
          mainIndex,                                                       
        });
      } else if (typeof latitude === "number" && typeof longitude === "number") {
        result = await createWithLocation({
          categoryId,
          title,
          content,
          date: selectedDate,
          latitude,
          longitude,
          detailAddress: addr,
          placeName,
          pinCategory,
          mainImageUuid: mainUuid || undefined,                              // [FIX: MAIN ORDER]
          imageUuids,
          files: filesForUpload,                                             // [FIX: MAIN ORDER]
          mainIndex,                                                         // [FIX: MAIN ORDER]
        });
      } else {
        alert("위치 정보가 없습니다. 기존 핀을 선택하거나 지도로 위치를 지정해 주세요.");
        setIsLoading(false);
        return;
      }

      // 응답 uuid → 표시 URL 매핑
      useArticleViewStore.getState().hydrate({
        articleId: result.articleId,
        title: result.title,
        content: result.content,
        date: result.date,
        mainImageUuid: result.mainImageUuid ? buildImageUrl(result.mainImageUuid) : null, // [FIX: S3 PATH]
        imageUuids: Array.isArray(result.imageUuids) ? result.imageUuids.map(buildImageUrl) : [], // [FIX: S3 PATH]
        latitude: typeof latitude === "number" ? latitude : null,
        longitude: typeof longitude === "number" ? longitude : null,
        likeCount: result.likeCount ?? 0,
        spamCount: result.spamCount ?? 0,
        commentCount: 0,
        liked: false,
        isReported: false,
      });

      const snap = {
        articleId: result.articleId,
        title: result.title,
        content: result.content,
        date: result.date,
        mainImageUuid: result.mainImageUuid
          ? buildImageUrl(result.mainImageUuid)
          : (mainUuid ? buildImageUrl(mainUuid) : null), 
        imageUuids: Array.isArray(result.imageUuids) && result.imageUuids.length
          ? result.imageUuids.map(buildImageUrl)
          : selectedImages.map(buildImageUrl), 
        latitude: typeof latitude === "number" ? latitude : null,
        longitude: typeof longitude === "number" ? longitude : null,
        likeCount: result.likeCount ?? 0,
        spamCount: result.spamCount ?? 0,
        commentCount: 0,
        liked: false,
        isReported: false,
      };
      localStorage.setItem(`articleView:${result.articleId}`, JSON.stringify(snap));

      reset(); resetPin(); resetDraft();
      navigate(`/record/${result.articleId}`, { state: { from: "writing" } });
    } catch (e) {
      console.error("게시글 저장 실패:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const MAX_FILES = 10;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const remain = MAX_FILES - selectedImages.length;
    if (remain <= 0) {
      alert(`이미지는 최대 ${MAX_FILES}장까지 업로드할 수 있어요.`);
      return;
    }

    const valid = fileArray.slice(0, remain);

    // 미리보기
    const readers = valid.map((file) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          fileMapRef.current.set(dataUrl, file);
          resolve(dataUrl);
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      })
    );

    Promise.all(readers).then((imageUrls) => addImages(imageUrls));
  };

  const handleImageSelect = (src: string) => {
    const wasSelected = selectedImages.includes(src);
    toggleImage(src);
    if (wasSelected && src.startsWith("data:")) {
      fileMapRef.current.delete(src);
    }
  };

  return (
    <div className="flex flex-col h-full relative" style={{ fontFamily: fonts.family }}>
      {/* 상단 바 */}
      <div className="w-full h-[56px] flex items-center border-b border-[#000] justify-between">
        <div className="w-[60px] flex items-center justify-start pl-2">
          <button onClick={() => { reset(); resetPin(); resetDraft(); navigate('/home'); }}>
            <img src={BackIcon} alt="뒤로가기" style={{ width: "25px", height: "22px", objectFit: "contain", display: "block" }} />
          </button>
        </div>

        <div>
          <div className="flex items-center gap-[10px]">
            <span className="text-base font-semibold text-center flex-1 truncate">{categoryName}</span>
            <button onClick={() => navigate("/category", { state: { mode: "write" } })} style={{ all: "unset", cursor: "pointer" }}>
              <img src={SelectIcon} alt="select" width={15} height={15} style={{ marginTop: "2px" }} />
            </button>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={isLoading} className="submit-button">
          {isLoading ? (
            <div className="submit-loading-dots"><span className="submit-dot" /><span className="submit-dot" /><span className="submit-dot" /></div>
          ) : ("등록")}
        </button>
      </div>

      {/* 본문 */}
      <div className="flex-1" style={{ padding: "29px 20px 14px 20px" }}>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="새 게시물"
          className="w-full h-[30px] resize-none focus:outline-none"
          style={{ fontFamily: fonts.family, fontSize: "23px", lineHeight: fonts.lineHeight.subtitle, fontWeight: fonts.weight.regular, border: "none", borderBottom: `1px solid ${colors.gray300}`, marginBottom: "10px", height: "56px" }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="나의 동네 풍경, 순간을 기록하고 함께 나눠보세요."
          className="w-full resize-none box-border focus:outline-none"
          style={{ fontFamily: fonts.family, fontSize: "15px", lineHeight: fonts.lineHeight.body, fontWeight: fonts.weight.regular, border: "none", height: "150px" }}
        />

        {/* 미리보기 */}
        <div className="fixed left-1/2 -translate-x-1/2 z-30 mx-auto w-[375px]" style={{ bottom: "15px" }}>
          <ImagePreview 
          selectedImages={selectedImages} 
          onReorder={(from, to) => commitReorder(from, to)}
          />
        </div>

        {/* 지도 미리보기 */}
        <div className="fixed left-1/2 -translate-x-1/2 z-30 mx-auto w-[375px] h-[240px]" style={{ bottom: "15px" }}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            {typeof latitude === "number" && typeof longitude === "number" && (<MiniMap latitude={latitude} longitude={longitude} />)}
          </div>
        </div>
      </div>

      {/* 갤러리 모달 열렸을 때 가로 툴바 */}
      {!showCalendar && showGallery && (
        <div className="fixed left-1/2 -translate-x-1/2 z-50 rounded-[15px]"
             style={{ bottom: "265px", width: "365px", height: "58px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", padding: "0 53px", boxShadow: "0px 4px 12px #D4D4D4" }}>
          <div style={{ display: "flex", gap: "55px", alignItems: "center" }}>
            <button style={{ all: "unset" }} onClick={() => setShowCalendar(true)}>
              <img src={CalendarIcon} alt="달력" className="w-[25px] h-[25px]" style={{ filter: "drop-shadow(0px 4px 12px rgba(30,30,30,0.25))" }} />
            </button>
            <button style={{ all: "unset" }} onClick={() => setShowGallery(false)}>
              <img src={GalleryIcon} alt="갤러리 닫기" className="w-[28px] h-[28px]" style={{ filter: "drop-shadow(0px 4px 12px rgba(30,30,30,0.25))" }} />
            </button>
            <button style={{ all: "unset" }} onClick={() => fileInputRef.current?.click()}>
              <img src={FileIcon} alt="카메라" className="w-[27px] h-[27px]" style={{ filter: "drop-shadow(0px 4px 12px rgba(30,30,30,0.25))" }} />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button style={{ all: "unset" }} onClick={() => navigate("/map/new")}>
              <img src={PinIcon} alt="지도" className="w-[26px] h-[27px]" style={{ filter: "drop-shadow(0px 4px 12px rgba(30,30,30,0.25))" }} />
            </button>
          </div>
        </div>
      )}

      {/* 세로형 툴바 */}
      <VerticalToolbar
        show={!showCalendar && !showGallery}
        onCalendarClick={() => setShowCalendar(true)}
        // onGalleryClick={() => setShowGallery(true)}
        onFileChange={handleFileChange}
      />

      {/* 갤러리 팝업 */}
      {showGallery && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[0] z-40"
             style={{ width: "375px", height: "265px", padding: "7px", overflowY: "auto", backgroundColor: "white" }}>
          <GalleryPreview selectedImages={selectedImages} onSelect={handleImageSelect} />
        </div>
      )}

      {/* CalendarModal */}
      {showCalendar && (
        <CalendarModal
          onClose={() => setShowCalendar(false)}
          selectedDate={selectedDate}
          onDateSelect={(date) => { setDate(date); setShowCalendar(false); }}
        />
      )}
    </div>
  );
}

export default RecordWritingPage;