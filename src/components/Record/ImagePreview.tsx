// src/components/Record/ImagePreview.tsx
import RepresentativeBadge from "./RepresentativeBadge";

interface ImagePreviewProps {
  selectedImages: string[];
}

const ImagePreview = ({ selectedImages }: ImagePreviewProps) => {
  if (selectedImages.length === 0) return null;

  return (
    <div
      className="w-full absolute left-1/2 -translate-x-1/2 px-2"
      style={{ bottom: "320px" }}
    >
      {selectedImages.length === 1 ? (
        <img
          src={selectedImages[0]}
          alt="preview-single"
          className="w-[375px] h-[184px] object-cover rounded-[15px]"
        />
      ) : selectedImages.length === 2 ? (
        <div className="flex gap-[6px]">
          {selectedImages.map((src, index) => (
            <div key={index} className="w-[184px] h-[184px] relative">
              <img
                src={src}
                alt={`preview-${index}`}
                className="w-full h-full object-cover rounded-[15px]"
              />
              {index === 0 && <RepresentativeBadge />}
            </div>
          ))}
        </div>
      ) : selectedImages.length === 3 ? (
        <div className="flex gap-[6px]">
          <div className="w-[184px] h-[184px] relative">
            <img
              src={selectedImages[0]}
              alt="대표"
              className="w-full h-full object-cover rounded-[15px]"
            />
            <RepresentativeBadge />
          </div>
          <div className="flex flex-col gap-[6px]">
            {selectedImages.slice(1).map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`preview-${index + 1}`}
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
              className="relative flex-shrink-0 w-[184px] h-[184px] rounded-[12px] overflow-hidden"
            >
              <img
                src={src}
                alt={`scroll-preview-${index}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && <RepresentativeBadge />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
