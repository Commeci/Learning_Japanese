import { axiosInstance } from "../axiosInstance";

export const userInfo = async () => {
  try {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users me:", error);
    throw error;
  }
};
