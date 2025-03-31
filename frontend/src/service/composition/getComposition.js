import { axiosInstance } from "../axiosInstance";

export const getComposition = async () => {
  try {
    const response = await axiosInstance.get(`/writing`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch writing:", error);
    throw error;
  }
};
