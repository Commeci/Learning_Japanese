import axios from "axios";

// 토큰 관리를 위한 유틸리티
const TokenStorage = {
  setToken: (token) => {
    localStorage.setItem("news_token", token); // 변경
  },
  getToken: () => {
    return localStorage.getItem("news_token"); // 변경
  },
  removeToken: () => {
    localStorage.removeItem("news_token"); // 변경
  },
  getAuthorizationHeader: () => {
    const token = localStorage.getItem("news_token"); // 변경
    return token ? `Bearer ${token}` : null;
  },
};

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}`,
  timeout: 50000,
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = TokenStorage.getAuthorizationHeader();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response Error:", error.response.data);

      switch (error.response.status) {
        case 401:
          // 인증 에러 처리
          console.error("Authentication error");
          TokenStorage.removeToken(); // 토큰 제거
          window.location.href = "/login"; // 로그인 페이지로 리다이렉트
          break;
        case 403:
          // 권한 없음 처리
          console.error("Permission denied");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("Other error occurred");
      }
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, TokenStorage };
