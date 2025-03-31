import { axiosInstance } from "../axiosInstance";

export const postLearnBox = async (news_id, uid) => {
  try {
    const response = await axiosInstance.post(
      `/learnBox/${news_id}/user/${uid}`,
    );
    return response;
  } catch (error) {
    console.error("Failed to Post LearnBox:", error);
    throw error;
  }
};
