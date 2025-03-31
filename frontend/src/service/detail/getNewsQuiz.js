import { axiosInstance } from "../axiosInstance";

export const getNewsQuiz = async (postID) => {
  try {
    const response = await axiosInstance.get(`/quiz/news/${postID}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch news quiz:", error);
    throw error;
  }
};
