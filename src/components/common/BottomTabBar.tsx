import { useLocation, useNavigate } from "react-router-dom";

import homeIcon from "../../assets/bottom/icon-bottom-home.svg";
import mapIcon from "../../assets/bottom/icon-bottom-map.svg";
import profileIcon from "../../assets/bottom/icon-bottom-profile.svg";
import writeIcon from "../../assets/bottom/icon-bottom-write.svg";

const BottomTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const visiblePaths = ["/", "/map", "/record/new", "/mypage"];
  if (!visiblePaths.includes(location.pathname)) return null;

  const tabs = [
    { path: "/", icon: homeIcon, label: "홈" },
    { path: "/map", icon: mapIcon, label: "지도" },
    { path: "/record/new", icon: writeIcon, label: "작성" },
    { path: "/mypage", icon: profileIcon, label: "마이" }
  ];

  return (
    <div className="w-full h-[60px] bg-white flex">
      {/* 탭바 wrapper */}
      <div className="w-full max-w-[375px] border-t-[2px] border-[#999999] bg-white flex h-[60px]">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-1 flex-col items-center justify-center"
          >
            <img src={tab.icon} alt={tab.label} className="w-6 h-6" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomTabBar;
