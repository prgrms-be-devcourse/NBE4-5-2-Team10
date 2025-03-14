"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check login status when component mounts and when component updates
  useEffect(() => {
    const checkLoginStatus = () => {
      // 1. localStorage에서 토큰 확인
      const token = localStorage.getItem("accessToken");

      // 2. 쿠키에서 토큰 확인
      const getCookieValue = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
      };

      const accessTokenCookie = getCookieValue("accessToken");

      // localStorage나 쿠키 중 하나라도 토큰이 있으면 로그인 상태로 설정
      setIsLoggedIn(!!token || !!accessTokenCookie);
    };

    // Initial check
    checkLoginStatus();

    // Set up event listeners
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" || e.key === null) {
        checkLoginStatus();
      }
    };

    // 쿠키 변경 감지를 위한 간단한 폴링 설정 (옵션)
    const cookieCheckInterval = setInterval(checkLoginStatus, 5000);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("login", checkLoginStatus);
    window.addEventListener("logout", checkLoginStatus);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("login", checkLoginStatus);
      window.removeEventListener("logout", checkLoginStatus);
      clearInterval(cookieCheckInterval);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const logoutUrl = `${apiUrl}/member/logout`;

      console.log("로그아웃 요청 URL:", logoutUrl);

      // First remove tokens from localStorage to ensure client-side logout happens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Update state immediately
      setIsLoggedIn(false);

      // Call the Spring logout API endpoint
      const response = await fetch(logoutUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important to include cookies
      });

      console.log("로그아웃 응답 상태:", response.status);

      // RsData 응답 처리
      if (response.ok) {
        try {
          const rsData = await response.json();
          console.log("로그아웃 응답:", rsData);

          // resultCode가 아닌 code로 접근해야 합니다
          if (!rsData.code.startsWith("200")) {
            console.warn("로그아웃 처리 경고:", rsData.msg);
          }
        } catch (e) {
          console.error("로그아웃 응답 파싱 오류:", e);
        }
      }

      // Dispatch a custom event for logout
      window.dispatchEvent(new Event("logout"));

      // Force a page refresh to ensure all components update
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);

      // Notify user (optional)
      alert("로그아웃 처리 중 문제가 발생했습니다. 하지만 로그아웃되었습니다.");

      // Redirect anyway
      router.push("/");
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
              TripFriend
            </h1>
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link
            href="/recruit/list"
            className="text-gray-700 hover:text-blue-600"
          >
            여행 동행 찾기
          </Link>
          <Link
            href="/recruit/create"
            className="text-gray-700 hover:text-blue-600"
          >
            동행 등록하기
          </Link>
          <Link href="/community" className="text-gray-700 hover:text-blue-600">
            커뮤니티
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600">
            서비스 소개
          </Link>
          <Link href="/qna" className="text-gray-700 hover:text-blue-600">
            Q&A
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-600"
              >
                로그아웃
              </button>
              <Link
                href="/member/my"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                마이페이지
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/member/login"
                className="text-gray-700 hover:text-blue-600"
              >
                로그인
              </Link>
              <Link
                href="/member/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
