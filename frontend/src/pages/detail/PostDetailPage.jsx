import { useNavigate, useParams } from "react-router-dom";
import PostTop from "./components/PostTop";
import PostBody from "./components/PostBody";
import PostBottom from "./components/PostBottom";
import { useEffect, useRef, useState } from "react";
import { getNewsDetail } from "@/service/detail/getNewsDetail";
import { postNewsTTS } from "@/service/detail/postNewsTTS";
import QuizContainer from "../quiz/components/QuizContainer";
import CompositionCard from "../composition/components/CompositionCard";
import FeedbackModal from "../composition/components/FeedbackModal";
import Loading from "@/components/Loading";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("origin");
  const [ttsBtn, setTTSBtn] = useState(false);
  const [quizContent, setQuizContent] = useState(false);

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedSentence, setSelectedSentence] = useState("");
  const [feedback, setFeedback] = useState(null);

  const audioRef = useRef(null);

  const handleSentenceClick = (sentence) => {
    setSelectedSentence(sentence);
    setIsWriteModalOpen(true);
  };

  useEffect(() => {
    if (!/^\d+$/.test(id)) {
      navigate("/error");
      return;
    }

    const fetchNewsDetail = async () => {
      try {
        const response = await getNewsDetail(id);
        setNewsData(response);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  useEffect(() => {
    if (activeTab === "kanji") {
      setTTSBtn(true);
    } else {
      setTTSBtn(false);
    }
  }, [activeTab]);

  useEffect(() => {
    return () => {
      console.log(audioRef.current)
      if (audioRef.current) {
        audioRef.current.stop();
      }
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    navigate("/error");
    return null;
  }
  if (!newsData) {
    navigate("/error");
    return null;
  }

  const handleTTSClick = async () => {
    setIsLoading(true);
    try {
      const content =
        activeTab === "origin"
          ? newsData.news.content
          : newsData.news.translated_content;

      const response = await postNewsTTS(content);
      const audioBlob =
        response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: "audio/opus" });

      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;

      audioRef.current.onloadeddata = async () => {
        try {
          await audio.current.play();
        } catch (playError) {
          console.error("오디오 재생 실패:", playError);
        }
      };

      audioRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("TTS 생성 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex justify-center">
        <audio ref={audioRef} autoPlay={false} />
        <div
          className={`flex ${
            quizContent
              ? "md:flex-row flex-col max-w-[1920px]"
              : "max-w-[1440px]"
          } w-full gap-4 transition-all duration-300 ease-in-out`}
        >
          <div
            className={`w-full py-4 p-4 3xl:m-auto ${
              quizContent ? "md:w-2/3" : ""
            } transition-all duration-300 ease-in-out`}
          >
            <PostTop news={newsData.news} />
            <PostBody
              news={newsData.news}
              kanjis={newsData.kanji_list}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleSentenceClick={handleSentenceClick}
            />
            <PostBottom
              handleTTSClick={handleTTSClick}
              disabled={ttsBtn}
              setQuizContent={setQuizContent}
            />
          </div>
          {quizContent && (
            <div className="hidden md:block w-full md:w-1/3 transition-all duration-300 ease-in-out opacity-0 md:animate-fadeIn">
              <div className="sticky top-40">
                <QuizContainer />
              </div>
            </div>
          )}
        </div>
      </div>
      {isWriteModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsWriteModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <CompositionCard
              type="type2"
              write_type="news"
              korean={selectedSentence}
              setIsModalOpen={setIsFeedbackModalOpen}
              setFeedback={setFeedback}
            />
          </div>
        </div>
      )}

      {/* 피드백 모달 */}
      {isFeedbackModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
          onClick={() => {
            setIsFeedbackModalOpen(false);
            setIsWriteModalOpen(false);
          }}
        >
          <div
            className="bg-white rounded-lg p-4 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <FeedbackModal
              type="handwrite"
              isCorrect={false}
              ai_score={feedback.ai_score}
              ai_feedback={feedback.ai_feedback}
              grammar_error={feedback.grammar_errors}
              onClose={() => {
                setIsFeedbackModalOpen(false);
                setIsWriteModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
