import { useEffect, useRef, useState } from "react";
import RepresentativeBadge from "./RepresentativeBadge";
import MiniSpinner from "./MiniSpinner";
import React from "react";

interface ImagePreviewProps {
  selectedImages: string[];
  onReorder?: (from: number, to: number) => void;
}

const ImagePreview = ({ selectedImages, onReorder }: ImagePreviewProps) => {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const dragFromRef = useRef<number | null>(null);

   useEffect(() => {
    setLoadingMap((prev) => {
      const next: Record<string, boolean> = { ...prev };
      selectedImages.forEach((src) => {
        if (!(src in next)) next[src] = true;
      });
      return next;
    });
  }, [selectedImages]);

  const handleImageLoad = (src: string) => {
    setLoadingMap((prev) => {
      if (!prev[src]) return prev;
      return { ...prev, [src]: false };
    });
  };

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    dragFromRef.current = index;
    e.dataTransfer.effectAllowed = "move";
    // 파이어폭스 호환: 반드시 setData 필요
    e.dataTransfer.setData("text/plain", String(index));
  };
  const handleDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault(); // drop 허용
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndexStr = e.dataTransfer.getData("text/plain");
    const fromIndex =
      fromIndexStr !== "" ? parseInt(fromIndexStr, 10) : dragFromRef.current;
    if (
      typeof fromIndex === "number" &&
      fromIndex >= 0 &&
      fromIndex < selectedImages.length &&
      toIndex >= 0 &&
      toIndex < selectedImages.length &&
      fromIndex !== toIndex
    ) {
      onReorder?.(fromIndex, toIndex);
    }
    dragFromRef.current = null;
  };

  const handleDragEnd = () => {
    dragFromRef.current = null;
  };

  const renderImage = (
    src: string,
    width: number,
    height: number,
    index: number,
    showBadge = false
  ) => (
      <div
        key={src}
        className="relative rounded-[15px]"
        style={{ width, height }}
        draggable
        onDragStart={handleDragStart(index)}
        onDragOver={handleDragOver(index)}
        onDrop={handleDrop(index)}
        onDragEnd={handleDragEnd}
      >
      <img
        src={src}
        alt={`preview-${index}`}
        className="w-full h-full object-cover rounded-[15px]"
        onLoad={() => handleImageLoad(src)}
        draggable={false}
      />
      {loadingMap[src] && (
        <div className="absolute inset-0 flex justify-center items-center bg-[#D9D9D9] rounded-[15px]">
          <MiniSpinner size={height <= 89 ? 24 : 48} />
        </div>
      )}
      {showBadge && <RepresentativeBadge />}
    </div>
  );

  if (selectedImages.length === 0) return null;

  const FiveImageGrid = ({ images }: { images: string[] }) => {
    const length = images.length;

    if (length === 1) {
      return (
        <div className="flex gap-[6px]">
          {renderImage(images[0], 375, 184, 0)}
        </div>
      );
    }

    if (length === 2) {
      return (
        <div className="flex gap-[6px]">
          {images.map((src, index) => renderImage(src, 184, 184, index, index === 0))}
        </div>
      );
    }

    if (length === 3) {
      return (
        <div className="flex gap-[6px]">
          {renderImage(images[0], 184, 184, 0, true)}
          <div className="flex flex-col gap-[6px]">
            {images.slice(1).map((src, index) => renderImage(src, 184, 89, index + 1))}
          </div>
        </div>
      );
    }

    if (length === 4) {
      return (
        <div className="flex gap-[6px]">
          {renderImage(images[0], 184, 184, 0, true)}
          <div className="flex flex-col gap-[6px]">
            {renderImage(images[1], 184, 89, 1)}
            <div className="flex gap-[6px]">
              {images.slice(2, 4).map((src, index) => renderImage(src, 89, 89, index + 2))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-[6px]">
        {renderImage(images[0], 184, 184, 0, true)}
        <div className="grid grid-cols-2 grid-rows-2 gap-[6px]">
          {images.slice(1, 5).map((src, index) => renderImage(src, 89, 89, index + 1))}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      <div
        className="absolute left-1/2 -translate-x-1/2 px-2"
        style={{ bottom: "320px", width: "375px" }}
      >
        {selectedImages.length <= 5 ? (
          <FiveImageGrid images={selectedImages} />
        ) : (
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex items-start w-max">
              <div className="flex-shrink-0">
                <FiveImageGrid images={selectedImages.slice(0, 5)} />
              </div>

              <div className="flex gap-[6px] flex-shrink-0 ml-[4px]">
                {selectedImages.length === 6 && renderImage(selectedImages[5], 184, 184, 5)}

                {selectedImages.length === 7 && (
                  <div className="flex flex-col gap-[6px]">
                    {renderImage(selectedImages[5], 184, 89, 5)}
                    {renderImage(selectedImages[6], 184, 89, 6)}
                  </div>
                )}

                {selectedImages.length === 8 && (
                  <div className="flex flex-col gap-[6px]">
                    {renderImage(selectedImages[5], 184, 89, 5)}
                    <div className="flex gap-[6px]">
                      {selectedImages.slice(6, 8).map((src, index) =>
                        renderImage(src, 89, 89, index + 6)
                      )}
                    </div>
                  </div>
                )}

                {selectedImages.length === 9 && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-[6px]">
                    {selectedImages.slice(5, 9).map((src, index) =>
                      renderImage(src, 89, 89, index + 5)
                    )}
                  </div>
                )}

                {selectedImages.length === 10 && (
                  <>
                    {renderImage(selectedImages[5], 184, 184, 5)}
                    <div className="grid grid-cols-2 grid-rows-2 gap-[6px]">
                      {selectedImages.slice(6, 10).map((src, index) =>
                        renderImage(src, 89, 89, index + 6)
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(ImagePreview);

