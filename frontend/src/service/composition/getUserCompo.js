import { axiosInstance } from "../axiosInstance";

export const getUserCompo = async (uid) => {
  try {
    const response = await axiosInstance.get(`/writing/uid/${uid}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user writing:", error);
    throw error;
  }
};
