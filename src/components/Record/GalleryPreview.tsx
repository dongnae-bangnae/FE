// components/Record/GalleryPreview.tsx
import { useEffect, useState } from "react";
import CheckIcon from "../../assets/icon-selected.svg";
import MiniSpinner from "./MiniSpinner";

interface GalleryPreviewProps {
  images: string[];
  selectedImages: string[];
  onSelect: (src: string) => void;
}

const GalleryPreview = ({ images, selectedImages, onSelect }: GalleryPreviewProps) => {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const map: Record<string, boolean> = {};
    images.forEach((src) => {
      map[src] = true;
    });
    setLoadingMap(map);
  }, [images]);

  const handleImageLoad = (src: string) => {
    setLoadingMap((prev) => ({ ...prev, [src]: false }));
  };

  const handleImageError = (src: string) => {
    console.warn("이미지 로딩 실패:", src);
    setLoadingMap((prev) => ({ ...prev, [src]: false }));
  };

  return (
    <>
      <div className="grid grid-cols-3">
        {images.map((src, idx) => {
          const isSelected = selectedImages.includes(src);
          const isLoading = loadingMap[src];

          return (
            <div key={idx} className="relative h-[126px] w-[126px]">
              <img
                src={src}
                alt={`gallery-${idx}`}
                className="object-cover w-full h-full rounded-[10px] cursor-pointer"
                onClick={() => onSelect(src)}
                onLoad={() => handleImageLoad(src)}
                onError={() => handleImageError(src)}
                style={{ padding: "1px 5px" }}
              />

              {isLoading && (
                <div className="absolute inset-0 flex justify-center items-center z-20">
                    <div className="w-full h-full bg-[#D9D9D9] bg-opacity-70 rounded-[10px] flex justify-center items-center"
                         style={{padding:"2px 5px"}}
                    >
                        <MiniSpinner size={24} />
                    </div>
                </div>
              )}

              {isSelected && (
                <div className="absolute bottom-[10px] right-[10px] w-[24px] h-[24px] rounded-full bg-[orange] text-white flex items-center justify-center text-sm font-bold z-30">
                  <img src={CheckIcon} alt="check" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GalleryPreview;
