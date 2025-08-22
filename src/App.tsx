import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider
} from "react-router-dom";

import Layout from "./layouts/Layout";
import AddCategoryPage from "./pages/AddCategoryPage";
import CategoryPage from "./pages/CategoryPage";
import CommentPage from "./pages/CommentPage";
import EditCategoryDetailPage from "./pages/EditCategoryDetailPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import EditNicknamePage from "./pages/EditNicknamePage";
import HomePage from "./pages/HomePage";
import LikePlacePage from "./pages/LikePlacePage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import MyPage from "./pages/MyPage";
import MyPostListPage from "./pages/MyPostListPage";
import MyProfilePage from "./pages/MyProfilePage";
import NewPlacePage from "./pages/NewPlacePage";
import NewRecordPage from "./pages/NewRecordPage";
import NotFound from "./pages/NotFound";
import NotificationPage from "./pages/NotificationPage";
import OAuthRedirect from "./pages/OAuthRedirect";
import OnboardingPage from "./pages/OnboardingPage";
import RecordDetailPage from "./pages/RecordDetailPage";
import RecordListPage from "./pages/RecordListPage";
import RecordWritingPage from "./pages/RecordWritingPage";
import SavedPlaceListPage from "./pages/SavedPlaceListPage";
import SavedPlaceMapPage from "./pages/SavedPlaceMapPage";
import SavedPlacePage from "./pages/SavedPlacePage";
import HomeListPage from "./pages/HomeListPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "oauth-redirect", element: <OAuthRedirect /> },
      { path: "onboard", element: <OnboardingPage /> },
      { path: "home", element: <HomePage /> },
      { path: "home/list", element: <HomeListPage /> },
      { path: "record/list", element: <RecordListPage /> },
      { path: "record/new", element: <NewRecordPage /> },
      { path: "record/new/write", element: <RecordWritingPage /> },
      { path: "record/:id", element: <RecordDetailPage /> },
      { path: "record/:id/comments", element: <CommentPage /> },
      { path: "map", element: <MapPage /> },
      { path: "map/new", element: <NewPlacePage /> },
      { path: "mypage", element: <MyPage /> },
      { path: "mypage/notification", element: <NotificationPage /> },
      { path: "mypage/profile", element: <MyProfilePage /> },
      { path: "mypage/profile/nickname", element: <EditNicknamePage /> },
      { path: "mypage/profile/likeplace", element: <LikePlacePage /> },
      { path: "mypage/saved/:categoryId", element: <SavedPlacePage /> },
      { path: "mypage/saved/:placeId/list", element: <SavedPlaceListPage /> },
      { path: "mypage/saved/map", element: <SavedPlaceMapPage /> },
      { path: "mypage/locationposts/:placeId", element: <MyPostListPage /> },
      { path: "category", element: <CategoryPage /> },
      { path: "category/new", element: <AddCategoryPage /> },
      { path: "category/edit", element: <EditCategoryPage /> },
      { path: "category/edit/:categoryId", element: <EditCategoryDetailPage /> }
    ]
  }
];

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const setScreenSize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setScreenSize();
    window.addEventListener("resize", setScreenSize);
    return () => window.removeEventListener("resize", setScreenSize);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
