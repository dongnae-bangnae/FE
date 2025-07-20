import RepresentativeBadge from "./RepresentativeBadge";

interface ImagePreviewProps {
  selectedImages: string[];
}

const ImagePreview = ({ selectedImages }: ImagePreviewProps) => {
  if (selectedImages.length === 0) return null;

  const FiveImageGrid = ({ images }: { images: string[] }) => {
    const length = images.length;

    if (length === 1) {
      return (
        <img
          src={images[0]}
          alt="preview-single"
          className="w-[375px] h-[184px] object-cover rounded-[15px]"
        />
      );
    }

    if (length === 2) {
      return (
        <div className="flex gap-[6px]">
          {images.map((src, index) => (
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
      );
    }

    if (length === 3) {
      return (
        <div className="flex gap-[6px]">
          <div className="w-[184px] h-[184px] relative">
            <img
              src={images[0]}
              alt="대표"
              className="w-full h-full object-cover rounded-[15px]"
            />
            <RepresentativeBadge />
          </div>
          <div className="flex flex-col gap-[6px]">
            {images.slice(1).map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`preview-${index + 1}`}
                className="w-[184px] h-[89px] object-cover rounded-[15px]"
              />
            ))}
          </div>
        </div>
      );
    }

    if (length === 4) {
      return (
        <div className="flex gap-[6px]">
          <div className="w-[184px] h-[184px] relative">
            <img
              src={images[0]}
              alt="대표"
              className="w-full h-full object-cover rounded-[15px]"
            />
            <RepresentativeBadge />
          </div>
          <div className="flex flex-col gap-[6px]">
            <img
              src={images[1]}
              alt="preview-2"
              className="w-[184px] h-[89px] object-cover rounded-[15px]"
            />
            <div className="flex gap-[6px]">
              {images.slice(2, 4).map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`preview-${index + 3}`}
                  className="w-[89px] h-[89px] object-cover rounded-[15px]"
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-[6px]">
        <div className="w-[184px] h-[184px] relative">
          <img
            src={images[0]}
            alt="대표"
            className="w-full h-full object-cover rounded-[15px]"
          />
          <RepresentativeBadge />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-[6px]">
          {images.slice(1, 5).map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`preview-${index + 2}`}
              className="w-[89px] h-[89px] object-cover rounded-[15px]"
            />
          ))}
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
          <div className="overflow-x-auto hide-scrollbar w-full">
            <div className="flex items-start w-max">
              <div className="flex-shrink-0">
                <FiveImageGrid images={selectedImages.slice(0, 5)} />
              </div>

              <div className="flex gap-[6px] flex-shrink-0 ml-[6px]">
                {selectedImages.length === 6 && (
                  <img
                    src={selectedImages[5]}
                    alt="preview-6"
                    className="w-[184px] h-[184px] object-cover rounded-[15px]"
                  />
                )}

                {selectedImages.length === 7 && (
                  <div className="flex flex-col gap-[6px]">
                    <img
                      src={selectedImages[5]}
                      alt="preview-6"
                      className="w-[184px] h-[89px] object-cover rounded-[15px]"
                    />
                    <img
                      src={selectedImages[6]}
                      alt="preview-7"
                      className="w-[184px] h-[89px] object-cover rounded-[15px]"
                    />
                  </div>
                )}

                {selectedImages.length === 8 && (
                  <div className="flex flex-col gap-[6px]">
                    <img
                      src={selectedImages[5]}
                      alt="preview-6"
                      className="w-[184px] h-[89px] object-cover rounded-[15px]"
                    />
                    <div className="flex gap-[6px]">
                      {selectedImages.slice(6, 8).map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`preview-${index + 7}`}
                          className="w-[89px] h-[89px] object-cover rounded-[15px]"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedImages.length === 9 && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-[6px]">
                    {selectedImages.slice(5, 9).map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`preview-${index + 6}`}
                        className="w-[89px] h-[89px] object-cover rounded-[15px]"
                      />
                    ))}
                  </div>
                )}

                {selectedImages.length === 10 && (
                  <>
                    <div className="w-[184px] h-[184px]">
                      <img
                        src={selectedImages[5]}
                        alt="preview-6"
                        className="w-full h-full object-cover rounded-[15px]"
                      />
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-[6px]">
                      {selectedImages.slice(6, 10).map((src, index) => (
                        <img
                          key={index}
                          src={src}
                          alt={`preview-${index + 7}`}
                          className="w-[89px] h-[89px] object-cover rounded-[15px]"
                        />
                      ))}
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

export default ImagePreview;
