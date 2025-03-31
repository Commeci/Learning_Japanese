import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNewsQuiz } from "@/service/detail/getNewsQuiz";
import QuizTab from "./QuizTab";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Loading from "@/components/Loading";

export default function QuizContainer() {
  const { id } = useParams();
  const [quizData, setQuizData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        const data = await getNewsQuiz(id);
        setQuizData(data);
      } catch (error) {
        console.error("Failed to fetch quiz data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!quizData || quizData.length === 0) {
    return (
      <div className="max-w-[1440px] py-4 p-4 3xl:m-auto">
        <p className="text-center text-gray-500">퀴즈가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] py-4 p-4 3xl:m-auto">
      <div className="p-2 rounded-lg relative">
        <Carousel>
          <CarouselContent>
            {quizData.map((quizItem, index) => (
              <CarouselItem key={index}>
                <QuizTab quiz={quizItem} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-between mt-8">
            <CarouselPrevious className="static scale-100 transform-none" />
            <CarouselNext className="static scale-100 transform-none" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
