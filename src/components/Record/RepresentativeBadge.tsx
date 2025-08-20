import fonts from "../../styles/fonts";

const RepresentativeBadge = () => {
  return (
    <div
      className="absolute top-[20px] right-[20px] bg-gradient-to-r from-[#FB8A1F] to-[#F2C94C] text-[black] w-[48px] h-[25px] flex items-center justify-center"
      style={{
        fontWeight: fonts.weight.regular,
        fontSize: fonts.size.minimal,
        borderRadius: "10px",
        border: "none",
      }}
    >
      <span>대표사진</span>
    </div>
  );
};

export default RepresentativeBadge;