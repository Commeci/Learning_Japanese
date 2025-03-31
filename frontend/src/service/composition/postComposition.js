import { axiosInstance } from "../axiosInstance";

export const postComposition = async (writing_id, uid, formData) => {
  try {
    const response = await axiosInstance.post(
      `/writing/${writing_id}/uid/${uid}`,
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
