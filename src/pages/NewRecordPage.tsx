import { useNavigate } from "react-router-dom";
import colors from "../styles/colors"; 
import fonts from "../styles/fonts";

import PencilIcon from "../assets/icon-pencil.svg";

function NewRecordPage() {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col flex-1 h-full"
      style={{
        fontFamily: fonts.family,
      }}
    >
      
      {/* 상단바 */}
      <div className="w-full">
        <div className="w-full">
          <div className="border-b">
            <header className="h-[76px] flex items-center justify-between"
                    style={{ fontFamily: fonts.family, gap: "10px", padding: "5px 22px"}}>
              <h1
                style={{
                  fontSize: fonts.size.subtitle,
                  fontWeight: fonts.weight.medium,
                  lineHeight: fonts.lineHeight.subtitle,
                  color: "#000",
                }}
              >
                기록
              </h1>
            </header>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1 flex items-center justify-center">
        <button
          onClick={() => navigate("/record/:id")}
          className="flex items-center justify-center gap-[9px]"
          style={{
            backgroundColor: colors.primaryLight,
            color: "#000",
            fontSize: fonts.size.subtitle,
            fontWeight: 600,
            width: "174px",
            height: "60px",
            padding: "12px 25px",
            borderRadius: "15px",
            border: "none",
          }}
        >
          <img src={PencilIcon} alt="글쓰기" />
          새 글쓰기
        </button>
      </div>
    </div>
  );
}

export default NewRecordPage;
