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
import { useEditArticle } from "../hooks/mutations/useEditArticle";
import { useCategorySelectionStore } from "../stores/categorySelection";
import { useShallow } from "zustand/react/shallow";

function RecordWritingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showCalendar, setShowCalendar] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mainImageUuid, setMainImageUuid] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [latitude, setLatitude] = useState(location.state?.latitude);
  const [longitude, setLongitude] = useState(location.state?.longitude);
  const [detailAddress, setDetailAddress] = useState(location.state?.detailAddress ?? "");
  const [placeName, setPlaceName] = useState(location.state?.placeName ?? "해옫연남");
  const [pinCategory, setPinCategory] = useState(location.state?.pinCategory ?? "FOOD");
  const [regionId, setregionId] = useState(location.state?.regionId ?? 1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ isLoading, setIsLoading ] = useState(false);

  const { mutateAsync: uploadArticle } = useCreateArticle();

  const { categoryId, categoryName, reset } =  useCategorySelectionStore(
    useShallow((s) => ({
      categoryId: s.categoryId,
      categoryName: s.categoryName,
      reset: s.reset,  
    }))
  ); 


  useEffect(() => {
    if (selectedImages.length > 0) {
      setMainImageUuid(selectedImages[0]);
    } else {
      setMainImageUuid(null);
    }
  }, [selectedImages]);

  const handleSubmit = async () => {
    if (categoryId== null) {
      alert("카테고리를 먼저 선택해 주세요.");
      return;
    }

    const missing: string[] = [];
    if (!title.trim()) missing.push("제목");
    if (!content.trim()) missing.push("내용");
    if (!Array.isArray(selectedImages) || selectedImages.length < 1) {
      missing.push("사진(1장 이상)");
    }
    const hasLatLng = typeof latitude === "number" && typeof longitude === "number";
    if (!hasLatLng) missing.push("핀 등록");

    if (missing.length > 0) {
      alert(`${missing.join(", ")} ${missing.length > 1 ? "이" : "가"} 필요해요.`);
      return;
    }

    

    // 등록
    setIsLoading(true);
    try {
      const imageUuids = selectedImages.filter((uuid) => uuid !== mainImageUuid); // 대표 이미지 제외

      const articleData = {
        categoryId,          
        latitude,
        longitude,
        detailAddress,
        regionId,
        title,
        content,
        date: selectedDate,
        mainImageUuid: mainImageUuid ?? "",
        imageUuids,
        placeName,
        pinCategory,
      };

      const articleId = await uploadArticle(articleData);

      reset();

      navigate(`/record/${articleId}`, {
        state: {
          articleId,
          title,
          content,
          latitude,
          longitude,
          detailAddress,
          regionId,
          date: selectedDate,
          mainImageUuid,
          imageUuids,
          likeCount: 0,
          spamCount: 0,
          from: "writing",
          showPopup: true,
        },
      });
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
      setSelectedImages((prev) => {
        const merged = [...prev, ...imageUrls];
        return merged.slice(0, 10); // 최대 10개 제한
      });
    });
  };

  const handleImageSelect = (src: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(src)) {
        return prev.filter((img) => img !== src);
      }
      if (prev.length >= 10) return prev;
      return [...prev, src];
    });
  };

  return (
    
    <div className="flex flex-col h-full relative" style={{ fontFamily: fonts.family }}>
      {/* 상단 바 */}
      <div className="w-full h-[56px] flex items-center border-b border-[#000] justify-between">
        <div className="w-[60px] flex items-center justify-start pl-2">
          <button onClick={() => {
              reset();
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
            {latitude !== null && longitude !== null && (
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
                    onClick={() => navigate("/map/new", {
                      state: {
                        pinCategory,
                        placeName,
                        detailAddress,
                        latitude,
                        longitude,
                        title,
                        content,
                        selectedImages,
                        selectedDate,
                        regionId,
                      }
                    })}>
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
            setSelectedDate(date);
            setShowCalendar(false);
          }}
        />
      )}

      
</div>

);
}

export default RecordWritingPage;