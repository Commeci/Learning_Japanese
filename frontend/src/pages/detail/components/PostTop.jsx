import CheckImage from "@/components/CheckImage";
import Level from "@/components/Level";

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

export default function PostTop({ news }) {

  const removeDateFromTitle = (title) => {
    // 정규 표현식: 날짜 형식 (예: "12/4(水) 9:09")
    const datePattern = /\d{1,2}\/\d{1,2}\([^)]+\)\s\d{1,2}:\d{2}/;
    // title에서 날짜 형식을 찾아 제거
    return title.replace(datePattern, "");
  };

  return (
    <div className="my-2">
      <div className="flex items-center justify-between">
        <h3 className="text-20 md:text-24 font-bold">{removeDateFromTitle(news.title)}</h3>
        <Level level={extractLevel(news.level)} />
      </div>
      <div className="flex items-center justify-between py-2 text-customGray text-14 md:text-16">
        <p className="flex gap-4">
          <span>{news.company}</span>
          <span>{news.upload_date}</span>
        </p>
        <p>학습시간 {news.learn_time.split(';')[0]}분</p>
      </div>
      <div className="my-4 h-56 sm:h-96 overflow-hidden border-b border-gray-400 border-solid">
        <CheckImage src={news.thumbnail} />
      </div>
    </div>
  );
}
