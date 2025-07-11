interface MyPostItemProps {
  name: string;
  color: string;
  image: string;
  onClick?: () => void;
}

function MyPostItem({ name, color, image, onClick }: MyPostItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3 rounded-md mb-3 cursor-pointer"
      style={{ backgroundColor: `${color}AA` }}
    >
      <div className="flex items-center gap-2">
        <img
          src={image}
          alt="아이템 이미지"
          className="w-5 h-5 object-contain"
        />
        <span className="text-sm text-black font-medium">{name}</span>
      </div>
    </div>
  );
}

export default MyPostItem;
