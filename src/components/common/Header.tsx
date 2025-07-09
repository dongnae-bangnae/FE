import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import BackArrowIcon from "../../assets/top/icon-top-backArrow.svg";

interface HeaderProps {
  left?: ReactNode;
  title: string;
  right?: ReactNode;
  underline?: boolean;
  bgColor?: string;
}

const Header = ({
  left,
  title,
  right,
  underline = false,
  bgColor = "bg-white"
}: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`w-full h-[56px] flex items-center ${bgColor} ${
        underline ? "border-b border-[#999999]" : ""
      }`}
    >
      {/* 왼쪽 */}
      <div className="w-[60px] flex items-center justify-start pl-2">
        {left ?? (
          <button onClick={() => navigate(-1)}>
            <img
              src={BackArrowIcon}
              alt="뒤로가기"
              style={{
                width: "25px",
                height: "22px",
                objectFit: "contain", // 화살표 뜨지 않게 설정
                display: "block"
              }}
            />
          </button>
        )}
      </div>

      {/* 가운데 타이틀 */}
      <div className="text-base font-semibold text-center flex-1 truncate">
        {title}
      </div>

      {/* 오른쪽 */}
      <div className="w-[60px] flex items-center justify-end">
        {right ?? null}
      </div>
    </div>
  );
};

export default Header;
