import { Outlet, useLocation } from "react-router-dom";

import BottomTabBar from "../components/common/BottomTabBar";

const Layout = () => {
  const location = useLocation();
  const visiblePaths = ["/", "/map", "/record/new", "/mypage"];
  const showBottomTabBar = visiblePaths.includes(location.pathname);

  return (
    <div className="w-full min-h-screen flex justify-center bg-gray-100">
      <div
        className="flex flex-col w-full max-w-[375px] bg-white shadow-lg"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* 하단 탭바 */}
        {showBottomTabBar && (
          <div className="h-[60px] flex-none">
            <BottomTabBar />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
