import { postNewsTTS } from "@/service/detail/postNewsTTS";
import NewsContent from "./NewsContent";
import { useState } from "react";
import Loading from "@/components/Loading";

export default function OriginContent({ content }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSentenceClick = async (sentence) => {
    setIsLoading(true);
    try {
      const response = await postNewsTTS(sentence);
      const audioBlob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: "audio/opus" });

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio();
      audio.src = audioUrl;

      audio.onloadeddata = async () => {
        try {
          await audio.play();
          setIsLoading(false);
        } catch (playError) {
          console.error("오디오 재생 실패:", playError);
          setIsLoading(false);
        }
      };

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("TTS 생성 실패:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 rounded-lg bg-contentGray">
      {isLoading && <Loading />}
      <NewsContent
        content={content}
        handleSentenceClick={handleSentenceClick}
        type="J"
      />
    </div>
  );
}
