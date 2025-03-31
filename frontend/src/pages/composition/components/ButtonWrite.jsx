import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function ButtonWrite({
  korean,
  japanese_kana,
  user_input,
  words_kana,
  setIsModalOpen,
  setFeedback,
  modalType,
}) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [correctOrder, setCorrectOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCorrectOrder([...words_kana]);
    const shuffledWords = [...words_kana];
    for (let i = shuffledWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledWords[i], shuffledWords[j]] = [
        shuffledWords[j],
        shuffledWords[i],
      ];
    }
    setAvailableWords(shuffledWords);
  }, [words_kana]);

  const handleWordClick = (word, index) => {
    setSelectedWords([...selectedWords, word]);
    const newAvailableWords = [...availableWords];
    newAvailableWords.splice(index, 1);
    setAvailableWords(newAvailableWords);
  };

  const handleReset = () => {
    setSelectedWords([]);
    const shuffledWords = [...correctOrder];
    for (let i = shuffledWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledWords[i], shuffledWords[j]] = [
        shuffledWords[j],
        shuffledWords[i],
      ];
    }
    setAvailableWords(shuffledWords);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    const userAnswer = selectedWords.join("");
    const correctAnswer = correctOrder.join("");
    const isCorrect = userAnswer === correctAnswer;

    const feedback = {
      type: modalType,
      isCorrect: isCorrect,
      message: isCorrect ? "정답입니다!" : "틀렸습니다. 다시 시도해보세요.",
    };

    setFeedback(feedback);
    setIsModalOpen(true);
    handleReset();
    setIsLoading(false);
  };

  return (
    <div className="bg-contentGray p-4 rounded-lg flex flex-col gap-4">
      <p className="text-14 md:text-16">{korean}</p>
      <div className="bg-white p-4 my-4 rounded-lg min-h-8 flex flex-wrap gap-2">
        {selectedWords.map((word, index) => (
          <span
            key={index}
            className="px-3 py-1.5 text-14 bg-gray-100 rounded-lg"
          >
            {word}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableWords.map((word, index) => (
          <Button
            key={index}
            onClick={() => handleWordClick(word, index)}
            className="px-3 py-1.5 text-14 bg-white rounded-lg hover:bg-gray-100 border border-gray-200"
          >
            {word}
          </Button>
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={handleReset}
          className="px-4 py-2 text-14 md:text-16 text-customGray bg-gray-100 rounded-lg hover:bg-gray-100 hover:opacity-50 shadow"
        >
          다시 작성
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-4 py-2 text-14 md:text-16 text-white bg-mainBlue shadow hover:bg-main hover:opacity-50"
        >
          {isLoading ? "로딩중..." : "제출하기"}
        </Button>
      </div>
    </div>
  );
}
