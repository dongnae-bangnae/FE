import { useLocation, useNavigate } from "react-router-dom";

import homeIcon from "../../assets/bottom/icon-bottom-home.svg";
import homeIconActive from "../../assets/bottom/icon-bottom-home-active.svg";
import mapIcon from "../../assets/bottom/icon-bottom-map.svg";
import mapIconActive from "../../assets/bottom/icon-bottom-map-active.svg";
import profileIcon from "../../assets/bottom/icon-bottom-profile.svg";
import profileIconActive from "../../assets/bottom/icon-bottom-profile-active.svg";
import writeIcon from "../../assets/bottom/icon-bottom-write.svg";
import writeIconActive from "../../assets/bottom/icon-bottom-write-active.svg";

interface BottomTabBarProps {
  className?: string;
}

const BottomTabBar = ({ className = "" }: BottomTabBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: "/home", label: "홈", icon: homeIcon, activeIcon: homeIconActive },
    { path: "/map", label: "지도", icon: mapIcon, activeIcon: mapIconActive },
    {
      path: "/record/new",
      label: "작성",
      icon: writeIcon,
      activeIcon: writeIconActive
    },
    {
      path: "/mypage",
      label: "마이",
      icon: profileIcon,
      activeIcon: profileIconActive
    }
  ];

  return (
    <div
      className={`w-full h-[60px] bg-white flex justify-center ${className}`}
    >
      <div className="w-[357px] border-t border-neutral-300 bg-white flex h-[60px]">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-1 items-center justify-center relative"
            >
              {/* 강조선 (선택된 탭만) */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30px] h-[2px] bg-orange-400" />
              )}

              {/* 실제 아이콘 */}
              <img
                src={isActive ? tab.activeIcon : tab.icon}
                alt={tab.label}
                className={`object-contain ${
                  isActive ? "w-[32px] h-[32px]" : "w-[26px] h-[26px]"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabBar;
