import { axiosInstance } from "../axiosInstance";

export const register = async ({ username, password }) => {
  try {
    const response = await axiosInstance.post(
      `/register?username=${username}&password=${password}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error("잘못된 요청입니다. 입력값을 확인해주세요.");
        case 409:
          throw new Error("이미 존재하는 아이디입니다.");
        default:
          throw new Error("회원가입 중 오류가 발생했습니다.");
      }
    }
    throw error;
  }
};
