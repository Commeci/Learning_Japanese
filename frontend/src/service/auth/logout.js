import { axiosInstance } from "../axiosInstance";

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/logout");
    return response.data;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("잘못된 요청입니다.");
        case 401:
          throw new Error("인증되지 않은 사용자입니다.");
        case 403:
          throw new Error("로그아웃 권한이 없습니다.");
        default:
          throw new Error("로그아웃 처리 중 오류가 발생했습니다.");
      }
    }
    throw error;
  }
};
