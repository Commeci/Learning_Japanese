import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CompositionTab from "./components/CompositionTab";
import { useEffect, useState } from "react";
import { getComposition } from "@/service/composition/getComposition";
import Loading from "@/components/Loading";
import FeedbackModal from "./components/FeedbackModal";

export default function CompositionPage() {
  const [compositionData, setCompositionData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompositionData = async () => {
      setIsLoading(true);
      try {
        const data = await getComposition();
        // Transform API data to match component structure
        const transformedData = {
          writing_id: data.writing_id,
          korean: data.korean,
          japanese: data.japanese_kanji,
          japanese_kana: data.japanese_kana,
          words_kana: data.words_kana,
          words_kanji: data.words_kanji,
        };
        setCompositionData(transformedData);
      } catch (error) {
        console.error("Failed to fetch composition data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompositionData();
  }, []);

  useEffect(() => {
    // 모달이 열릴 때 body에 스크롤 방지 클래스 추가
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // 컴포넌트 언마운트 시 스크롤 방지 해제
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  if (isLoading) {
    return <Loading />;
  }

  if (!compositionData) {
    return (
      <div>
        <p>데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] p-4 py-4 3xl:m-auto">
      <div className="p-2 rounded-lg  relative">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <CompositionTab
                compositionData={compositionData}
                setIsModalOpen={setIsModalOpen}
                setFeedback={setFeedback}
              />
            </CarouselItem>
          </CarouselContent>
          <div className="flex justify-between mt-8">
            <CarouselPrevious className="static scale-100 transform-none" />
            <CarouselNext className="static scale-100 transform-none" />
          </div>
        </Carousel>
      </div>
      {isModalOpen && feedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <FeedbackModal
              type={feedback.type}
              isCorrect={feedback.isCorrect}
              ai_score={feedback.ai_score}
              ai_feedback={feedback.ai_feedback}
              grammar_error={feedback.grammar_error}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
