import { axiosInstance } from "../axiosInstance";

export const login = async ({ username, password }) => {
  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);
    formData.append("scope", "");
    formData.append("client_id", "string");
    formData.append("client_secret", "string");

    const response = await axiosInstance.post("/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
        case 401:
          throw new Error("인증에 실패했습니다.");
        default:
          throw new Error("로그인 중 오류가 발생했습니다.");
      }
    }
    throw error;
  }
};
