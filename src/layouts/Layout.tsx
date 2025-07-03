import { Outlet } from "react-router-dom";

import BottomTabBar from "../components/common/BottomTabBar";
import Header from "../components/common/Header";

const Layout = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center items-center">
      <div
        className="w-full max-w-[375px] bg-white flex flex-col shadow-lg rounded-xl overflow-hidden"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        {/* 상단 바 */}
        <div className="flex-none h-[56px] shrink-0">
          <Header />
        </div>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* 하단 탭 바 */}
        <div className="flex-none h-[64px] shrink-0">
          <BottomTabBar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
