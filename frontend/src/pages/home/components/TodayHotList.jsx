import PostCard from "@/components/PostCard";
import { getNewsTodayHot } from "@/service/home/getNewsTodayHot";
import { useEffect, useState } from "react";
import thumbnailSvg from "../../../assets/thumbnail.svg";
import Loading from "@/components/Loading";
import { useNavigate } from "react-router-dom";

export default function TodayHotList() {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsTodayHot();
        const mappedData = response.news_list.map((item) => ({
          id: item.news_id,
          thumbnail: item.thumbnail || thumbnailSvg, // 기본 이미지
          title: item.title,
          content: item.content,
          upload_date:
            item.upload_date || new Date().toISOString().split("T")[0],
          learn_time: item.learn_time.split(";")[0] || "10",
          level: item.level || "1",
        }));

        setNewsData(mappedData);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
        navigate("/error");
      }
    };

    fetchNews();
  }, []);

  if (isLoading) return <Loading />;
  if (error) return null;
  if (!newsData || newsData.length === 0)
    return <div>오늘의 뉴스가 없습니다</div>;

  return (
    <div
      className="
      py-4 mt-16 col-span-10 md:col-span-7 w-full
      "
    >
      {/* <h2 className="text-20 sm:text-24 mb-4 font-bold">오늘의 인기 뉴스</h2> */}
      {newsData.map((news) => (
        <PostCard key={news.id} type="type4" {...news} />
      ))}
      {/* <div className="grid grid-cols-1 gap-4">
          {newsData.slice(1, 3).map((news) => (
            <PostCard key={news.id} type="type1" {...news} />
          ))}
        </div> */}
    </div>
  );
}
