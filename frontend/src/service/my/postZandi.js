import { axiosInstance } from "../axiosInstance";

export const postZandi = async (uid) => {
  try {
    const response = await axiosInstance.post(`/zandi/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Failed to submit zandi:", error);
    throw error;
  }
};
