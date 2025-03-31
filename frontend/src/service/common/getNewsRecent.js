import { axiosInstance } from "../axiosInstance";

export const getNewsRecent = async () => {
  try {
    const response = await axiosInstance.get("/news/recent");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
};
