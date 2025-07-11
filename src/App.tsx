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
import EditNicknamePage from "./pages/EditNicknamePage";
import HomePage from "./pages/HomePage";
import LikePlacePage from "./pages/LikePlacePage";
import LocationPostsPage from "./pages/LocationPostsPage";
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
import SelectedPinTypePage from "./pages/SelectPinTypePage";

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
      { path: "record/list", element: <RecordListPage /> },
      { path: "record/new", element: <NewRecordPage /> },
      { path: "record/:id", element: <RecordWritingPage /> },
      { path: "record/:id/detail", element: <RecordDetailPage /> },
      { path: "map", element: <MapPage /> },
      { path: "map/new", element: <NewPlacePage /> },
      { path: "map/select-pin", element: <SelectedPinTypePage /> },
      { path: "mypage", element: <MyPage /> },
      { path: "mypage/notification", element: <NotificationPage /> },
      { path: "mypage/profile", element: <MyProfilePage /> },
      { path: "mypage/profile/nickname", element: <EditNicknamePage /> },
      { path: "mypage/profile/likeplace", element: <LikePlacePage /> },
      { path: "mypage/saved/:placeId", element: <SavedPlaceListPage /> },
      { path: "mypage/saved/:placeId/list", element: <MyPostListPage /> },
      { path: "mypage/locationposts", element: <LocationPostsPage /> },
      { path: "category", element: <CategoryPage /> },
      { path: "category/new", element: <AddCategoryPage /> }
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
