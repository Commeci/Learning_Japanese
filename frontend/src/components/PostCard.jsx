import CheckImage from "./CheckImage";
import Level from "./Level";
import { useNavigate } from "react-router-dom";

export default function PostCard({ type, id, ...props }) {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(`/postdetail/${id}`);
  };

  const removeDateFromTitle = (title) => {
    // 정규 표현식: 날짜 형식 (예: "12/4(水) 9:09")
    const datePattern = /\d{1,2}\/\d{1,2}\([^)]+\)\s\d{1,2}:\d{2}/;
    // title에서 날짜 형식을 찾아 제거
    return title.replace(datePattern, "");
  };

  const renderCard = () => {
    const cardProps = { ...props, onClick: onClick };
    cardProps.title = removeDateFromTitle(cardProps.title);
    switch (type) {
      case "type1":
        return <Type1Card {...cardProps} />;
      case "type2":
        return <Type2Card {...cardProps} />;
      case "type3":
        return <Type3Card {...cardProps} />;
      case "type4":
        return <Type4Card {...cardProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="post-card cursor-pointer" onClick={onClick}>
      {renderCard()}
    </div>
  );
}

function extractLevel(level) {
  if (!level) return "";
  return (
    level
      .toString()
      .split(/[^0-9]/)
      .filter(Boolean)
      .pop() || level
  );
}

// 작은 사각형
function Type1Card({
  thumbnail,
  title = "제목 없음",
  upload_date = "날짜 없음",
  learn_time = "-",
  level,
  onClick,
  quiz_correct,
}) {
  return (
    <div
      className="
      relative group p-2 sm:p-0
    "
      onClick={onClick}
    >
      {thumbnail !== null && (
        <div className="h-48 w-full overflow-hidden hidden sm:block">
          <CheckImage src={thumbnail} />
        </div>
      )}

      <div className="mt-2 px-2">
        <h2 className="text-14 sm:text-16 mb-2 my-2 text-gray-600 font-bold group-hover:underline truncate max-w-[90%]">
          {title}
        </h2>
        <p
          className={`text-12 sm:text-14 mt-1 text-gray-500 max-w-[90%] ${
            !quiz_correct && `pb-2`
          }`}
        >
          {upload_date} . 학습시간 {learn_time}분
        </p>
        {quiz_correct && (
          <p className="text-12 sm:text-14 text-gray-500 mt-1 pb-2">
            퀴즈 정답 개수:
            <span className="text-red-500">{quiz_correct[0]}</span>/
            {quiz_correct[1]}
          </p>
        )}
        <span className="absolute right-1 bottom-1">
          <Level level={extractLevel(level)} />
        </span>
      </div>
    </div>
  );
}

// 긴 직사각형
function Type2Card({
  thumbnail,
  title,
  content,
  upload_date,
  learn_time,
  level,
  onClick,
}) {
  return (
    <div
      className="flex relative group border-b border-solid border-gray-200 pb-4 "
      onClick={onClick}
    >
      <div className="mr-2 flex pt-3 flex-col w-[60%]">
        <h2 className="text-14 sm:text-16 font-bold group-hover:underline line-clamp-2 text-gray-600">
          {title}
        </h2>
        <div className="">
          <p className="text-12 sm:text-14 mt-4 pb-2 text-gray-500">
            {upload_date} . 학습시간 {learn_time}분
          </p>
        </div>
        <span className="absolute left-1 bottom-3 md:bottom-2">
          <Level level={extractLevel(level)} />
        </span>
      </div>
      <div className="w-[40%] h-36 overflow-hidden sm:h-40">
        <CheckImage src={thumbnail} />
      </div>
    </div>
  );
}

// 세로 꽉 차는 직사각형
function Type3Card({
  thumbnail,
  title,
  upload_date,
  learn_time,
  level,
  onClick,
}) {
  return (
    <div
      className="relative flex h-28 md:h-44 overflow-hidden group"
      onClick={onClick}
    >
      <div className="w-[50%] overflow-hidden hidden md:block">
        <CheckImage src={thumbnail} />
      </div>
      <div className="ml-2 flex flex-col justify-between py-4">
        <h2 className="text-14 sm:text-16 font-bold group-hover:underline truncate">
          {title}
        </h2>
        <div>
          <p className="text-12 sm:text-14 text-gray-500">{upload_date}</p>
          <p className="text-12 sm:text-14 mt-2 text-gray-500">
            학습시간 {learn_time}분
          </p>
        </div>
        <span className="absolute right-1 bottom-1">
          <Level level={extractLevel(level)} />
        </span>
      </div>
    </div>
  );
}

// 엄청 큰
function Type4Card({
  thumbnail,
  title,
  content,
  upload_date,
  learn_time,
  level,
  onClick,
}) {
  return (
    <div
      className="
        relative group 
        pt-4 pb-8
        border-gray-200 border-b border-solid
        flex flex-col sm:flex-row
        w-full
        h-auto sm:h-72
        overflow-hidden
        shrink-0
      "
      onClick={onClick}
    >
      <div className="mt-2 px-2 w-full sm:w-2/5 shrink">
        <h2 className="text-14 sm:text-20 mb-2 font-bold group-hover:underline line-clamp-2 text-gray-600">
          {title}
        </h2>
        <p className="text-12 sm:text-14 mt-4 pb-4 pr-2 text-gray-500 line-clamp-5 leading-4">
          {content}
        </p>
        <p className="text-12 sm:text-14 mt-4 pb-4 text-gray-500">
          {upload_date} . 학습시간 {learn_time}분
        </p>
      </div>
      <div className="w-full sm:w-3/5 h-44 sm:h-full shrink">
        <CheckImage
          src={thumbnail}
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
}
