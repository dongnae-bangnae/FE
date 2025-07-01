import { Outlet } from "react-router-dom";

import BottomTabBar from "../components/common/BottomTabBar";
import Header from "../components/common/Header";

const Layout = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center overflow-hidden">
      <div className="w-full max-w-[375px] min-h-screen bg-white flex flex-col">
        {/* 상단 바 */}
        <Header />

        {/* 페이지 콘텐츠 */}
        <main className="flex-grow overflow-auto">
          <Outlet />
        </main>

        {/* 하단 탭 바 */}
        <BottomTabBar />
      </div>
    </div>
  );
};

export default Layout;
