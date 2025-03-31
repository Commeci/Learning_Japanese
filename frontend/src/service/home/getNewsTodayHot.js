import { axiosInstance } from "../axiosInstance";

export const getNewsTodayHot = async () => {
  try {
    const response = await axiosInstance.get("/news/today_hot");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
};
