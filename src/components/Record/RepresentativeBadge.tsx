import fonts from "../../styles/fonts";

const RepresentativeBadge = () => {
  return (
    <div
      className="absolute top-[10px] right-[10px] bg-[#FB8A1F] text-[black] w-[48px] h-[25px] rounded-full flex items-center justify-center"
      style={{
        fontWeight: fonts.weight.medium,
        fontSize: fonts.size.minimal,
      }}
    >
      <span>대표사진</span>
    </div>
  );
};

export default RepresentativeBadge;