import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

export default function QuizCard({
  question,
  selection,
  answer,
  user_answer,
  onAnswerChange,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerSelect = (value) => {
    setSelectedAnswer(parseInt(value));
  };

  return (
    <div className="bg-contentGray p-4 rounded-lg flex flex-col gap-4">
      <p className="text-20 md:text-24 font-bold bg-white px-2 py-4 rounded-lg">
        {question}
      </p>
      <div className="text-16 md:text-20 font-bold">
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={handleAnswerSelect}
        >
          {selection.map((item, index) => (
            <div
              key={index}
              className={`
              flex justify-between items-center bg-white rounded-lg px-2 py-4 space-x-2 mt-2
              ${
                selectedAnswer === index
                  ? selectedAnswer === answer
                    ? "bg-green-100"
                    : "bg-red-100"
                  : ""
              }
            `}
            >
              <Label
                htmlFor={`option-${index}`}
                className={`
                flex-1 cursor-pointer
                ${
                  selectedAnswer === index
                    ? selectedAnswer === answer
                      ? "text-green-600"
                      : "text-red-600"
                    : ""
                }
              `}
              >
                {item}
              </Label>
              <RadioGroupItem
                value={index.toString()}
                id={`option-${index}`}
                disabled={selectedAnswer !== null}
              />
            </div>
          ))}
        </RadioGroup>
      </div>
      {selectedAnswer !== null && (
        <div
          className={`text-center font-bold mt-4 ${
            selectedAnswer === answer ? "text-green-600" : "text-red-600"
          }`}
        >
          {selectedAnswer === answer ? "정답입니다!" : "틀렸습니다."}
        </div>
      )}
    </div>
  );
}
