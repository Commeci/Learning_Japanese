import { Button } from "@/components/ui/button";

export default function FeedbackModal({
  type,
  isCorrect,
  ai_score,
  ai_feedback,
  grammar_error = [],
  onClose,
}) {
  const errors = Array.isArray(grammar_error) ? grammar_error : [grammar_error];
  return (
    <div className="space-y-4">
      {type === "button" ? (
        <div className="border-b pb-2">
          <h3
            className={`text-14 md:text-16 font-semibold ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "정답입니다!" : "틀렸습니다!"}
          </h3>
        </div>
      ) : (
        <>
          <div className="border-b pb-2">
            <h3 className="text-16 md:text-20 font-semibold">
              점수: {ai_score}
            </h3>
          </div>
          <div className="border-b pb-2">
            <h3 className="text-16 md:text-20 font-semibold mb-2">피드백</h3>
            <p className="text-gray-700 leading-7">{ai_feedback}</p>
          </div>
          {errors && errors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">문법 오류</h3>
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-600">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      <Button
        onClick={onClose}
        className="w-full px-4 py-2 text-14 md:text-16 text-white bg-mainBlue rounded-lg hover:bg-main hover:opacity-50"
      >
        닫기
      </Button>
    </div>
  );
}
