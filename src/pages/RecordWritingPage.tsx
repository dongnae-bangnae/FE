import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
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

function RecordWritingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const selectedCategory = location.state?.selectedCategory ?? "카테고리";
  const lat = location.state?.latitude ?? 37.5665;
  const lng = location.state?.longitutde ?? 126.9080; //임시 위도, 경도 지정

  const [ isLoading, setIsLoading ] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // 로딩 스피너 보기 위한 딜레이
      navigate('/record/:id', {
        state: {
          title,
          content,
          images: selectedImages,
          date: selectedDate,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setSelectedImages([imageUrl]);
    };
    reader.readAsDataURL(file);
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


  // const isFormValid =
  // title.trim() !== "" &&
  // content.trim() !== "" &&
  // selectedImages.length > 0 &&
  // pinLocation !== null;

  return (
    
    <div className="flex flex-col h-full relative" style={{ fontFamily: fonts.family }}>
      {/* 상단 바 */}
      <div className="w-full h-[56px] flex items-center border-b border-[#000] justify-between">
        <div className="w-[60px] flex items-center justify-start pl-2">
          <button onClick={() => navigate('/home')}>
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
            <span className="text-base font-semibold text-center flex-1 truncate">{selectedCategory}</span>
            <button onClick={() => navigate("/category")} style={{ all: "unset", cursor: "pointer" }}>
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
        <div>
          <ImagePreview selectedImages={selectedImages} />
        </div>

        {/* 지도 미리보기 */}
        <div
          className="fixed left-1/2 -translate-x-1/2 z-30 mx-auto w-[375px] h-[293px]"
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
            <MiniMap lat={lat} lng={lng} />
          </div>
        </div>

      </div>

      {/* 갤러리 모달 열렸을 때 가로 툴바 */}
      {!showCalendar && showGallery && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50 rounded-[15px]"
          style={{
            bottom: "232px",
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


            <button style={{ all: "unset" }} onClick={() => navigate("/map/new")}>
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
          style={{ width: "390px", height: "240px", padding: "7px", overflowY: "auto" }}
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