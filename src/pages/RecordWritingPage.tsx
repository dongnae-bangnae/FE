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

function RecordWritingPage() {
  const navigate = useNavigate();

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

  const [ isLoading, setIsLoading ] = useState(false);

  const { categoryId, categoryName, reset } =  useCategorySelectionStore(
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

  
  const { mutateAsync: createAtPlace } = useCreateArticle();  //기존핀
  const { mutateAsync: createWithLocation } = useCreateArticleWithLocation(); //미등록장소

  const [showCalendar, setShowCalendar] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (selectedImages.length > 0) {
      setMain(selectedImages[0]);
    } else {
      setMain(null);
    }
  }, [selectedImages, setMain]);
  
  const uuidRe = /^[0-9a-fA-F-]{36}$/;

const isDefaultImageUrl = (src: string) => {
  try { return new URL(src).pathname.includes("/default-images/"); }
  catch { return src.includes("/default-images/"); }
};

const extractUuidFromDefaultUrl = (src: string) => {
  try {
    const u = new URL(src);
    const last = u.pathname.split("/").filter(Boolean).pop() || "";
    return last.split("?")[0];
  } catch {
    const last = src.split("/").filter(Boolean).pop() || "";
    return last.split("?")[0];
  }
};

// src(=uuid|S3 URL|data:) → uuid 또는 "" 로 표준화
const asUuid = (src?: string | null) => {
  if (!src) return "";
  if (uuidRe.test(src)) return src;
  if (isDefaultImageUrl(src)) return extractUuidFromDefaultUrl(src);
  return ""; // data: 등은 여기선 무시(파일 업로드 미사용 플로우)
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

  const collectFilesFromSelection = async (urls: string[], baseFiles: File[]) => {
    if (baseFiles.length > 0) return baseFiles; 
    const files: File[] = [];
    for (let i = 0; i < urls.length; i++) {
      const src = urls[i];
      try {
        if (src.startsWith("data:")) {
          files.push(dataUrlToFile(src, `image_${i}.png`));
        } else {
          const res = await fetch(src, { mode: "cors" }); 
          const blob = await res.blob();
          const ext = (blob.type.split("/")[1] || "jpg").split(";")[0];
          files.push(new File([blob], `image_${i}.${ext}`, { type: blob.type || "image/jpeg" }));
        }
      } catch (err) {
        console.warn("이미지 변환 실패:", src, err);
      }
    }
    return files;
  };

  const handleSubmit = async () => {
    if (categoryId== null) {
      alert("카테고리를 먼저 선택해 주세요.");
      return;
    }
    // if (latitude == null || longitude == null) {
    //   alert("위치 정보가 필요합니다.");
    //   return;
    // }

    if (pinCategory == null) {
      alert("핀 카테고리를 선택해 주세요.");
      return;
    }
    if (detailAddress == null || detailAddress.trim() === "") {
      alert("상세 주소가 필요해요.");
      return;
    }
    const addr = detailAddress.trim();

    const missing: string[] = [];
    if (!title.trim()) missing.push("제목");
    if (!content.trim()) missing.push("내용");
    if (!Array.isArray(selectedImages) || selectedImages.length < 1) {
      missing.push("사진(1장 이상)");
    }

    const normalizedUuids = selectedImages.map(asUuid).filter((s): s is string => !!s);
    if (normalizedUuids.length < 1) missing.push("사진(1장 이상)");

      if (missing.length > 0) {
        alert(`${missing.join(", ")} ${missing.length > 1 ? "이" : "가"} 필요해요.`);
        return;
      }

      let mainUuid = asUuid(mainImageUuid ?? "");
    if (!mainUuid) mainUuid = normalizedUuids[0];
    const imageUuids = normalizedUuids.filter((u) => u !== mainUuid);


    // 등록
    setIsLoading(true);
    try {
      // 기존 핀 & 미등록 장소 분기
      let result;
      if (typeof placeId === "number") {
        result = await createAtPlace({
          categoryId,
          placeId,
          regionId: 1,
          title,
          content,
          date: selectedDate,
          detailAddress: addr,
          placeName,
          pinCategory,
          mainImageUuid: mainUuid,
          imageUuids,
        });
      } else if (typeof latitude === "number" && typeof longitude === "number") {
        result = await createWithLocation({
          categoryId,
          regionId: 1,
          title,
          content,
          date: selectedDate,
          latitude,
          longitude,
          detailAddress: addr,
          placeName,
          pinCategory,
          mainImageUuid: mainUuid,
          imageUuids,
        });
      } else {
        alert("위치 정보가 없습니다. 기존 핀을 선택하거나 지도로 위치를 지정해 주세요.");
        setIsLoading(false);
        return;
      }

      useArticleViewStore.getState().hydrate({
        articleId: result.articleId,
        title: result.title,
        content: result.content,
        date: result.date,
        mainImageUuid: result.mainImageUuid ?? null,
        imageUuids: result.imageUuids ?? [],
        latitude: typeof latitude === "number" ? latitude : null,
        longitude: typeof longitude === "number" ? longitude : null,
        likeCount: result.likeCount ?? 0,
        spamCount: result.spamCount ?? 0,
        commentCount: 0,
        liked: false,
        isReported: false,
      });

      reset();
      resetPin();
      resetDraft();
      navigate(`/record/${result.articleId}`, { state: { from: "writing" } });
    } catch (e) {
      console.error("게시글 등록 실패:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    const readers = fileArray.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((imageUrls) => {
     addImages(imageUrls);
    });

    setSelectedFiles((prev) => [...prev, ...fileArray].slice(0, 10));
  };

  const handleImageSelect = (src: string) => {
    toggleImage(src);
  };

  return (
    <div className="flex flex-col h-full relative" style={{ fontFamily: fonts.family }}>
      {/* 상단 바 */}
      <div className="w-full h-[56px] flex items-center border-b border-[#000] justify-between">
        <div className="w-[60px] flex items-center justify-start pl-2">
          <button onClick={() => {
              reset();
              resetPin();
              resetDraft();
              navigate('/home');}}>
            <img
              src={BackIcon}
              alt="뒤로가기"
              style={{
                width: "25px",
                height: "22px",
                objectFit: "contain",
                display: "block"
              }}
            />
          </button>
        </div>

        <div>
          <div className="flex items-center gap-[10px]">
            <span className="text-base font-semibold text-center flex-1 truncate">{categoryName}</span>
            <button onClick={() => navigate("/category", { state: {mode: 
              "write",
            }})} style={{ all: "unset", cursor: "pointer" }}>
              <img src={SelectIcon} alt="select" width={15} height={15} style={{ marginTop: "2px" }} />
            </button>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? (
            <div className="submit-loading-dots">
              <span className="submit-dot" />
              <span className="submit-dot" />
              <span className="submit-dot" />
            </div>
          ) : (
            "등록"
          )}
        </button>
      </div>

      {/* 본문 */}
      <div className="flex-1" style={{ padding: "29px 20px 14px 20px",}}>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="새 게시물"
          className="w-full h-[34px] resize-none focus:outline-none"
          style={{
            fontFamily: fonts.family,
            fontSize: "30px",
            lineHeight: fonts.lineHeight.subtitle,
            fontWeight: fonts.weight.regular,
            border: "none", 
            borderBottom: `1px solid ${colors.gray300}`,
            marginBottom: "10px", 
            height: "56px"
          }}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="나의 동네 풍경, 순간을 기록하고 함께 나눠보세요."
          className="w-full resize-none box-border focus:outline-none"
          style={{
            fontFamily: fonts.family,
            fontSize: fonts.size.body,
            lineHeight: fonts.lineHeight.body,
            fontWeight: fonts.weight.regular,
            border: "none",
            height: "150px", 
          }}
        />

        {/* 미리보기 */}
        <div
          className="fixed left-1/2 -translate-x-1/2 z-30 mx-auto w-[375px]"
          style={{
            bottom: "15px"
          }}
        >
          <ImagePreview selectedImages={selectedImages} />
        </div>

        {/* 지도 미리보기 */}
        <div
          className="fixed left-1/2 -translate-x-1/2 z-30 mx-auto w-[375px] h-[240px]"
          style={{
            bottom: "15px"
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {typeof latitude === "number" && typeof longitude === "number" && (
              <>
                <MiniMap latitude={latitude} longitude={longitude} />
              </>
            )}
          </div>
        </div>

      </div>

      {/* 갤러리 모달 열렸을 때 가로 툴바 */}
      {!showCalendar && showGallery && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50 rounded-[15px]"
          style={{
            bottom: "265px",
            width: "365px",
            height: "58px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: "0 53px",
            boxShadow: "0px 4px 12px #D4D4D4",
          }}
        >
          <div style={{ display: "flex", gap: "55px", alignItems: "center"}}>
            <button style={{ all: "unset" }} onClick={() => setShowCalendar(true)}>
              <img src={CalendarIcon} alt="달력" className="w-[25px] h-[25px]" 
                   style={{ filter: "drop-shadow(0px 4px 12px rgba(30,30,30,0.25))" }}
              />
            </button>

            <button style={{ all: "unset" }} onClick={() => setShowGallery(false)}>
              <img src={GalleryIcon} alt="갤러리 닫기" className="w-[28px] h-[28px]" 
                   style={{ filter: "drop-shadow(0px 4px 12px rgba(30,30,30,0.25))" }}
              />
            </button>

            <button style={{ all: "unset" }} onClick={handleGalleryClick}>
              <img src={FileIcon} alt="카메라" className="w-[27px] h-[27px]" 
                   style={{ filter: "drop-shadow(0px 4px 12px rgba(30,30,30,0.25))" }}
              />
            </button>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />


            <button style={{ all: "unset" }} 
                    onClick={() => navigate("/map/new")}>
              <img src={PinIcon} alt="지도" className="w-[26px] h-[27px]" 
                   style={{ filter: "drop-shadow(0px 4px 12px rgba(30,30,30,0.25))" }}
              />
            </button>
          </div>
        </div>
      )}

      {/* 세로형 툴바*/}
      <VerticalToolbar
        show={!showCalendar && !showGallery}
        onCalendarClick={() => setShowCalendar(true)}
        onGalleryClick={() => setShowGallery(true)}
        onFileChange={handleFileChange}
      />


      {/* 갤러리 팝업 */}
      {showGallery && (
        <div
          className="fixed left-1/2 -translate-x-1/2 bottom-[0] z-40"
          style={{ width: "375px", height: "265px", padding: "7px", overflowY: "auto", backgroundColor: "white"}}
        >
          <GalleryPreview
            selectedImages={selectedImages}
            onSelect={handleImageSelect}
          />
        </div>
      )}


      {/* CalendarModal */}
      {showCalendar && (
        <CalendarModal
          onClose={() => setShowCalendar(false)}
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setDate(date);
            setShowCalendar(false);
          }}
        />
      )}

      
</div>

);
}

export default RecordWritingPage;