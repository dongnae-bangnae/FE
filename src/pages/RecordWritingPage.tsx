import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import colors from "../styles/colors";
import fonts from "../styles/fonts";
import BackIcon from "../assets/top/icon-top-backArrow.svg";
import SelectIcon from "../assets/top/icon-top-select.svg";
import CalendarIcon from "../assets/icon-calendar.svg";
import GalleryIcon from "../assets/icon-gallery.svg";
import CameraIcon from "../assets/icon-camera.svg";
import PinIcon from "../assets/icon-pin.svg";
import { galleryImages } from "../../src/components/Record/GalleryImages";
import CalendarModal from "../components/Record/CalendarModal";
import MapPage from "./MapPage";


function RecordWritingPage() {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    navigate('/record/:id/detail', {
        state: {
            title,
            content,
            images: selectedImages,
            date: selectedDate, 
            },
    });
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

  return (
    <div className="flex flex-col h-full relative" style={{ fontFamily: fonts.family }}>
      {/* 상단 바 */}
      <div
        className="w-full flex items-center justify-between border-b border-[#999999]"
        style={{ padding: "14px 20px",  gap: "10px", height: "56px" }}
      >
        <button onClick={() => navigate("/")} style={{ all: "unset", cursor: "pointer" }}>
          <img src={BackIcon} alt="back" width={30} height={28} />
        </button>
        <div>
          <div className="flex items-center gap-[6px]" style={{ fontSize: fonts.size.subtitle, fontWeight: fonts.weight.bold }}>
            <span>카테고리</span>
            <button onClick={() => navigate("/category/new")} style={{ all: "unset", cursor: "pointer" }}>
              <img src={SelectIcon} alt="select" width={15} height={15} />
            </button>
          </div>
        </div>
        <button onClick={handleSubmit}
          style={{
            backgroundColor: colors.gray200,
            width: "65px",
            height: "39px",
            fontSize: "15px",
            fontWeight: fonts.weight.medium,
            padding: "8px 18px",
            borderRadius: "6px",
            border: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.gray200)}
        >
          등록
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
        {selectedImages.length > 0 && (
        <div className="w-full absolute left-1/2 -translate-x-1/2 px-2" style={{ bottom: "320px" }}>
            {selectedImages.length === 1 ? (
            <img
                src={selectedImages[0]}
                alt="preview-single"
                className="w-[375px] h-[184px] object-cover rounded-[15px]"
            />
            ) : selectedImages.length <= 3 ? (
            <div className="flex gap-[6px]">
                <div className="w-[184px] h-[184px] relative">
                <img
                    src={selectedImages[0]}
                    alt="대표"
                    className="w-full h-full object-cover rounded-[15px]"
                />
                <div className="absolute top-[10px] left-[10px] bg-[orange] text-[white] w-[65px] h-[24px] rounded-full text-center">
                    대표사진
                </div>
                </div>
                <div className="flex flex-col gap-[6px]">
                {selectedImages.slice(1).map((src, index) => (
                    <img
                    key={index}
                    src={src}
                    alt={`preview-${index}`}
                    className="w-[184px] h-[89px] object-cover rounded-[15px]"
                    />
                ))}
                </div>
            </div>
            ) : (
            <div className="flex gap-[6px] overflow-x-auto no-scrollbar">
                {selectedImages.map((src, index) => (
                <div
                    key={index}
                    className="relative flex-shrink-0 w-[140px] h-[140px] rounded-[12px] overflow-hidden"
                >
                    <img
                    src={src}
                    alt={`scroll-preview-${index}`}
                    className="w-full h-full object-cover"
                    />
                    {index === 0 && (
                    <div className="absolute top-[10px] left-[10px] bg-[orange] text-white text-sm px-2 py-1 rounded-full">
                        대표사진
                    </div>
                    )}
                </div>
                ))}
            </div>
            )}
        </div>
        )}

      </div>

      {/* 갤러리 모달 열렸을 때 가로 툴바 */}
      {!showCalendar && showGallery && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-50"
          style={{
            bottom: "250px",
            width: "390px",
            height: "58px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#F2F2F2",
            padding: "0 53px",
          }}
        >
          <div style={{ display: "flex", gap: "55px", alignItems: "center" }}>
            <button style={{ all: "unset" }} onClick={() => setShowCalendar(true)}>
              <img src={CalendarIcon} alt="달력" className="w-[23.96px] h-[25px]" />
            </button>

            <button style={{ all: "unset" }} onClick={() => setShowGallery(false)}>
              <img src={GalleryIcon} alt="갤러리 닫기" className="w-[27px] h-[27px]" />
            </button>

            <button style={{ all: "unset" }} onClick={handleGalleryClick}>
              <img src={CameraIcon} alt="카메라" className="w-[27px] h-[27px]" />
            </button>

            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            <button style={{ all: "unset" }} onClick={() => setShowMap(true)}>
              <img src={PinIcon} alt="지도" className="w-[26px] h-[27px]" />
            </button>
          </div>
        </div>
      )}

      {/* 기본 세로형 플로팅 버튼 툴바 (갤러리/달력 모달 off시) */}
      {!showCalendar && !showGallery && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-0 z-50" style={{ width: "390px", height: "100%", pointerEvents: "none"}}>
        <div className="absolute bottom-[20px] right-[20px] flex flex-col gap-[6px]"
             style={{pointerEvents: "auto"}}  
        >
          <button
            className="w-[52px] h-[52px] rounded-full flex justify-center items-center shadow"
            onClick={() => setShowCalendar(true)}
            style={{backgroundColor: colors.primaryDark}}
          >
            <img src={CalendarIcon} alt="달력" className="w-[24px] h-[24px]" />
          </button>

          <button
            className="w-[52px] h-[52px] rounded-full flex justify-center items-center shadow"
            onClick={() => setShowGallery(true)}
            style={{backgroundColor: colors.primaryDark}}
          >
            <img src={GalleryIcon} alt="갤러리" className="w-[24px] h-[24px]" />
          </button>

          <button
            className="w-[52px] h-[52px] rounded-full bg-[#E5AC45] flex justify-center items-center shadow"
            onClick={handleGalleryClick}
            style={{backgroundColor: colors.primaryDark}}
          >
            <img src={CameraIcon} alt="카메라" className="w-[24px] h-[24px]" />
          </button>

          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

          <button
            className="w-[52px] h-[52px] rounded-full bg-[#E5AC45] flex justify-center items-center shadow"
            onClick={() => navigate("/map/new")}
            style={{backgroundColor: colors.primaryDark}}
          >
            <img src={PinIcon} alt="지도" className="w-[24px] h-[24px]" />
          </button>
        </div>
      </div>

      )}


      {/* 선택 사진 미리보기 */}
      {showGallery && (
        <div
          className="fixed left-1/2 -translate-x-1/2 bottom-[0] z-40"
          style={{ width: "390px", height: "250px", padding: "7px", overflowY: "auto" }}
        >
          <div className="grid grid-cols-3">
            {galleryImages.map((src, idx) => {
              const isSelected = selectedImages.includes(src);
              return (
                <div key={idx} className="relative h-[126px] w-[126px]">
                  <img
                    src={src}
                    alt={`gallery-${idx}`}
                    className="object-cover w-full h-full rounded-[10px] cursor-pointer"
                    onClick={() => handleImageSelect(src)}
                    style={{padding: "3px 4px"}}
                  />
                  {isSelected && (
                    <div className="absolute bottom-[10px] right-[10px] w-[24px] h-[24px] rounded-full bg-[orange] text-[white] flex items-center justify-center text-sm font-bold z-10">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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

      {showMap && (
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 bg-white rounded-t-xl border-t"
        style={{ width: "390px", height: "250px" }}
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-end p-2">
          <button
            onClick={() => setShowMap(false)}
            className="text-sm px-3 py-1 border rounded"
          >
            닫기
          </button>
        </div>
        <MapPage />
      </div>
)}
</div>

);
}

export default RecordWritingPage;
