import CheckIcon from "../assets/icon-check.svg";

interface SavedPlaceItemProps {
  name: string;
  category: string;
  icon: string;
  selected?: boolean;
  onClick?: () => void;
}

function SavedPlaceItem({
  name,
  category,
  icon,
  selected = false,
  onClick
}: SavedPlaceItemProps) {
  return (
    <div
      className="flex justify-between items-center py-4 border-b border-[#999] cursor-pointer"
      onClick={onClick}
    >
      <div>
        <p className="text-sm font-medium">{name}</p>
        <div className="flex items-center gap-1 mt-1">
          <img src={icon} alt="카테고리 아이콘" className="w-4 h-4" />
          <span className="text-xs text-black">{category}</span>
        </div>
      </div>
      {selected && <img src={CheckIcon} alt="선택됨" className="w-5 h-5" />}
    </div>
  );
}

export default SavedPlaceItem;
