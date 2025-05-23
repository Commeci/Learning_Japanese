import { axiosInstance } from "../axiosInstance";

export const getNewsByCategory = async (categoryNumber) => {
  try {
    const response = await axiosInstance.get(`/news/${categoryNumber}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
};
