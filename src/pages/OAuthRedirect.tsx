import { useEffect } from "react";
// import { useEffect, useLayoutEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// import OnBoardingLoadingSpinner from "../components/OnBoardingLoadingSpinner";

function getCookieValue(name: string): string | null {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function OAuthRedirect() {
  // const TIMEOUT_MS = 5000; // 최대 대기 5초
  // const INTERVAL_MS = 100; // 100ms 간격

  // export default function OAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    // 온보딩 여부만 보고 라우팅
    const isOnboardingCompleted =
      getCookieValue("isOnboardingCompleted") === "true";

    // 1) 동기 쿠키 읽기
    // const initial = useMemo(() => getCookieValue("isOnboardingCompleted"), []);

    if (isOnboardingCompleted === true) navigate("/home");
    else if (isOnboardingCompleted === false) navigate("/onboard");
    // const routeBy = (val: string | null) => {
    //   if (val === "true") navigate("/home");
    //   else if (val === "false") navigate("/onboard");
    else navigate("/");
  }, [navigate]);
  // };

  return (
    <div className="flex items-center justify-center h-screen text-lg">
      로그인 중입니다...
    </div>
  );
}

// // 2) 쿠키가 이미 있다면, 페인트 전에 즉시 이동
// useLayoutEffect(() => {
//   if (initial !== null) routeBy(initial);
// }, [initial, navigate]);

// // 3) 쿠키가 없을 때만 잠깐 대기(도착 즉시 이동)
// useEffect(() => {
//   if (initial !== null) return; // 이미 처리됨
export default OAuthRedirect;
//     let alive = true;
//     const started = Date.now();

//     const tick = () => {
//       if (!alive) return;
//       const v = getCookieValue("isOnboardingCompleted");
//       if (v !== null) return routeBy(v);

//       if (Date.now() - started >= TIMEOUT_MS) return routeBy(null); // 안전망
//       setTimeout(tick, INTERVAL_MS);
//     };

//     tick();
//     return () => {
//       alive = false;
//     };
//   }, [initial, navigate]);

//   // 4) 기다릴 때만 스피너 표시
//   if (initial !== null) return null;
//   return (
//     <div className="min-h-screen bg-white">
//       <OnBoardingLoadingSpinner overlay={false} />
//     </div>
//   );
// }
