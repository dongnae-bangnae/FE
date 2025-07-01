import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider
} from "react-router-dom";

import Layout from "./layouts/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import MyLikesPage from "./pages/MyLikesPage";
import MyPage from "./pages/MyPage";
import MyProfilePage from "./pages/MyProfilePage";
import NewPlacePage from "./pages/NewPlacePage";
import NewRecordPage from "./pages/NewRecordPage";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import RecordDetailPage from "./pages/RecordDetailPage";
import SettingsPage from "./pages/SettingsPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/onboard", element: <OnboardingPage /> },
      { path: "record/new", element: <NewRecordPage /> },
      { path: "record/:id", element: <RecordDetailPage /> },
      { path: "map", element: <MapPage /> },
      { path: "map/new", element: <NewPlacePage /> },
      { path: "mypage", element: <MyPage /> },
      { path: "mypage/likes", element: <MyLikesPage /> },
      { path: "mypage/profile", element: <MyProfilePage /> },
      { path: "mypage/settings", element: <SettingsPage /> }
    ]
  }
];

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
