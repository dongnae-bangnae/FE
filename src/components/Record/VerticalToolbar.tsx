import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import colors from "../../styles/colors";
import CalendarIcon_w from "../../assets/record/icon-calendar-white.svg";
import CalendarIcon_o from "../../assets/record/icon-calendar-orange.svg";
import GalleryIcon_w from "../../assets/record/icon-gallery-white.svg";
import GalleryIcon_o from "../../assets/record/icon-gallery-orange.svg";
import FileIcon_w from "../../assets/record/icon-file-white.svg";
import FileIcon_o from "../../assets/record/icon-file-orange.svg";
import PinIcon_w from "../../assets/record/icon-map-white.svg";
import PinIcon_o from "../../assets/record/icon-map-orange.svg";
import Writing_w from "../../assets/record/icon-writing_w.svg";
import Writing_o from "../../assets/record/icon-writing_o.svg";
import Back_y from "../../assets/record/icon-back_y.svg";
import Back_o from "../../assets/record/icon-back_o.svg";

interface VerticalToolbarProps {
  show: boolean;
  onCalendarClick: () => void;
  // onGalleryClick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VerticalToolbar = ({
  show,
  onCalendarClick,
  // onGalleryClick,
  onFileChange,
}: VerticalToolbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  // 스와이프 이벤트 등록
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].screenX;
      if (touchStartX.current !== null && touchEndX.current !== null) {
        const diff = touchEndX.current - touchStartX.current;
        if (diff > 50) setVisible(false); 
        if (diff < -50) setVisible(true);  
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  if (!show || !visible) return null;

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 bottom-0 z-50"
      style={{ width: "390px", height: "100%", pointerEvents: "none" }}
    >
      {!isExpanded && (
        <button
          aria-label="편집 열기"
          onClick={() => setIsExpanded(true)}
          onMouseEnter={() => setHoveredIcon("write")}
          onMouseLeave={() => setHoveredIcon(null)}
          className="absolute"
          style={{
            right: 24,
            bottom: 110,
            width: 78,
            height: 78,
            borderRadius: "50%",
            backgroundColor: colors.primaryDark,      // 배경 지정
            boxShadow: "0 10px 22px #FFAC33",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
            border: "none",
          }}
        >
          <img
            src={hoveredIcon === "write" ? Writing_o : Writing_w}
            alt="연필"
            style={{ width: 22, height: 22 }}
          />
        </button>
      )}

      {isExpanded && (
        <div
          className="absolute"
          style={{
            right: 20,
            bottom: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "flex-end",
            pointerEvents: "auto",
          }}
        >
        <button
          className="w-[52px] h-[52px] rounded-full flex justify-center items-center shadow"
          onClick={onCalendarClick}
          onMouseEnter={() => setHoveredIcon("calendar")}
          onMouseLeave={() => setHoveredIcon(null)}
          style={{ backgroundColor: colors.primaryDark, boxShadow: "0 10px 22px #FFAC33", }}
        >
          <img
            src={hoveredIcon === "calendar" ? CalendarIcon_o : CalendarIcon_w}
            alt="달력"
            className="w-[24px] h-[24px]"
          />
        </button>
{/* 
        <button
          className="w-[52px] h-[52px] rounded-full flex justify-center items-center shadow"
          onClick={onGalleryClick}
          onMouseEnter={() => setHoveredIcon("gallery")}
          onMouseLeave={() => setHoveredIcon(null)}
          style={{ backgroundColor: colors.primaryDark }}
        >
          <img
            src={hoveredIcon === "gallery" ? GalleryIcon_o : GalleryIcon_w}
            alt="갤러리"
            className="w-[24px] h-[24px]"
          />
        </button> */}

        <button
          className="w-[52px] h-[52px] rounded-full flex justify-center items-center shadow"
          onClick={handleGalleryClick}
          onMouseEnter={() => setHoveredIcon("file")}
          onMouseLeave={() => setHoveredIcon(null)}
          style={{ backgroundColor: colors.primaryDark, boxShadow: "0 10px 22px #FFAC33", }}
        >
          <img
            src={hoveredIcon === "file" ? GalleryIcon_o : GalleryIcon_w}
            alt="갤러리"
            className="w-[24px] h-[24px]"
          />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
        />

        <button
            aria-label="접기"
            onClick={() => setIsExpanded(false)}
            onMouseEnter={() => setHoveredIcon("back")}
            onMouseLeave={() => setHoveredIcon(null)}
            style={{
              boxShadow: "0 10px 22px #D9D9D9", 
              backgroundColor: "white", 
              borderRadius: "50%",
              width: "78px",
              height: "78px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

            }}
          >
            <img
              src={hoveredIcon === "back" ? Back_o : Back_y}
              alt="접기"
              style={{ width: 22, height: 22,}}
            />
          </button>

        <button
          className="w-[52px] h-[52px] rounded-full flex justify-center items-center shadow"
          onClick={() => navigate("/map/new", {
            state: {
              categoryColor: location.state?.categoryColor,
              categoryName: location.state?.categoryName,
              categoryId: location.state?.categoryId,
              title: location.state?.title,
              content: location.state?.content,
              selectedImages: location.state?.selectedImages,
              selectedDate: location.state?.selectedDate,
            }
          })}
          onMouseEnter={() => setHoveredIcon("map")}
          onMouseLeave={() => setHoveredIcon(null)}
          style={{ backgroundColor: colors.primaryDark, boxShadow: "0 10px 22px #D9D9D9", }}
        >
          <img
            src={hoveredIcon === "map" ? PinIcon_o : PinIcon_w}
            alt="지도"
            className="w-[24px] h-[24px]"
          />
        </button>
      </div>
      )}
    </div>
  );
};

export default VerticalToolbar;
