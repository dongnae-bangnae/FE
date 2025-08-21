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
        if (diff > 50) setVisible(false); // 오른쪽 스와이프 → 숨김
        if (diff < -50) setVisible(true);  // 왼쪽 스와이프 → 다시 보임
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
      <div
        className="absolute bottom-[20px] right-[20px] flex flex-col gap-[6px]"
        style={{ pointerEvents: "auto" }}
      >
        <button
          className="w-[52px] h-[52px] rounded-full flex justify-center items-center shadow"
          onClick={onCalendarClick}
          onMouseEnter={() => setHoveredIcon("calendar")}
          onMouseLeave={() => setHoveredIcon(null)}
          style={{ backgroundColor: colors.primaryDark }}
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
          style={{ backgroundColor: colors.primaryDark }}
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
          style={{ backgroundColor: colors.primaryDark }}
        >
          <img
            src={hoveredIcon === "map" ? PinIcon_o : PinIcon_w}
            alt="지도"
            className="w-[24px] h-[24px]"
          />
        </button>
      </div>
    </div>
  );
};

export default VerticalToolbar;
