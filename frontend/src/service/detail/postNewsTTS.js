import { axiosInstance } from "../axiosInstance";

export const postNewsTTS = async (text) => {
  try {
    const response = await axiosInstance.post(
      `/news/tts`,
      { text: text },
      {
        responseType: "blob",
        headers: {
          Accept: "audio/opus",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Failed to generate TTS:", error);
    throw error;
  }
};
