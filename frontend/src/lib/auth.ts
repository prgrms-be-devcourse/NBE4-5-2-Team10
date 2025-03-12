export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = localStorage.getItem("accessToken");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // 액세스 토큰 만료 시 자동 갱신
  if (response.status === 401) {
    console.warn("🔄 액세스 토큰 만료됨, 리프레시 시도 중...");
    token = await refreshAccessToken();

    if (!token) throw new Error("로그인이 필요합니다.");

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  return response;
};

export const refreshAccessToken = async () => {
  try {
    const response = await fetch("http://localhost:8080/member/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) throw new Error("토큰 갱신 실패");

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.error("❌ 액세스 토큰 갱신 오류:", error);
    return null;
  }
};
