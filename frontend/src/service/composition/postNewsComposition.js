import { axiosInstance } from "../axiosInstance";

export const postNewsComposition = async (question, uid, formData) => {
  try {
    const response = await axiosInstance.post(
      `/writing/question/${question}/uid/${uid}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to submit writing answer:", error);
    throw error;
  }
};
