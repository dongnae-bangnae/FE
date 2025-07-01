import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import BottomTabBar from "../components/common/BottomTabBar";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단바 */}
      <Header />

      {/* 페이지 컨텐츠 */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 하단 탭바 */}
      <BottomTabBar />
    </div>
  );
};

export default Layout;
