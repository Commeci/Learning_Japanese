import { axiosInstance } from "../axiosInstance";

export const getNewsDetail = async (postID) => {
  try {
    const response = await axiosInstance.get(`/news/content/${postID}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
};
