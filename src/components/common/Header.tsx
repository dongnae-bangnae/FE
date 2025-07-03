import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import BackArrowIcon from "../../assets/top/icon-top-backArrow.svg";

interface HeaderProps {
  left?: ReactNode;
  title: string;
  right?: ReactNode;
  underline?: boolean;
}

const Header = ({ left, title, right, underline = false }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`w-full h-[56px] flex items-center px-4 bg-white ${
        underline ? "border-b border-[#999999]" : ""
      }`}
    >
      {/* 왼쪽 */}
      <div className="flex items-center min-w-[24px]">
        {left ?? (
          <button onClick={() => navigate(-1)}>
            <img
              src={BackArrowIcon}
              alt="뒤로가기"
              style={{
                width: "24px",
                height: "24px",
                objectFit: "contain",
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
      <div className="flex items-center min-w-[24px] justify-end">
        {right ?? null}
      </div>
    </div>
  );
};

export default Header;
