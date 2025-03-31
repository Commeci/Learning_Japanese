import { axiosInstance } from "../axiosInstance";

export const getZandi = async (uid) => {
  try {
    const response = await axiosInstance.get(`/zandi/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch zandi:", error);
    throw error;
  }
};
