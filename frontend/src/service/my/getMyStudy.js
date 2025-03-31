import { axiosInstance } from "../axiosInstance";

export const getMyStudy = async (uid) => {
  try {
    const response = await axiosInstance.get(`/learnBox/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch zandi:", error);
    throw error;
  }
};
