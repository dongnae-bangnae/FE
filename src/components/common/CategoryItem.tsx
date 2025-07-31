import { useState } from "react";

import StarIcon from "../../assets/category-star.svg?react";
import CheckIcon from "../../assets/icon-checked.svg?react";
import PencilIcon from "../../assets/icon-pencil.svg?react";

interface CategoryItemProps {
  name: string;
  color: string;
  selected?: boolean;
  onClick?: () => void;
  iconType?: "pencil"; // 이 값이 없으면 기본 StarIcon
}

function CategoryItem({
  name,
  color,
  selected = false,
  onClick,
  iconType
}: CategoryItemProps) {
  const [focused, setFocused] = useState(false);

  // 아이콘 결정
  const IconComponent = iconType === "pencil" ? PencilIcon : StarIcon;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
      className={`flex items-center justify-between px-3 py-3 rounded-md mb-4 cursor-pointer transition-all`}
      style={{
        outlineStyle: "solid",
        outlineWidth: "1px",
        outlineColor: focused || selected ? color : "#D1D5DB",
        backgroundColor: selected ? `${color}30` : "transparent",
        boxShadow:
          focused || selected
            ? `2px 3px 4px  ${color}80`
            : "0 2px 4px #D1D5DB80"
      }}
    >
      <div className="flex items-center gap-1.5">
        <IconComponent
          className="w-5 h-5"
          style={{
            color: color,
            backgroundColor: "#FFFFFF",
            borderRadius: "9999px"
          }}
        />{" "}
        <span className="text-md text-black font-medium">{name}</span>
      </div>

      <CheckIcon
        className={`w-5 h-5 transition-opacity duration-200 ${
          focused || selected ? "opacity-100" : "opacity-0"
        }`}
        style={{ color }}
      />
    </div>
  );
}

export default CategoryItem;
