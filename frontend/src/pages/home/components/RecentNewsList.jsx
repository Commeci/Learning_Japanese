import PostCard from "@/components/PostCard";
import { getNewsRecent } from "@/service/common/getNewsRecent";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import thumbnailSvg from "../../../assets/thumbnail.svg";
import Loading from "@/components/Loading";

export default function RecentNewsList() {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsRecent();
        const mappedData = response.news_list
          .slice(0, 4) // 처음 4개의 아이템만 선택
          .map((item) => ({
            id: item.news_id,
            thumbnail: item.thumbnail || thumbnailSvg,
            title: item.title,
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
    return <div>최신 뉴스가 없습니다</div>;
  return (
    <div className="
    py-4 mt-16 col-span-10 md:col-span-3 relative
    before:content-[''] 
    before:h-full 
    before:absolute
    before:left-[calc(-1rem-4px)]
    before:bottom-0
    before:border-l
    before:border-solid
    before:border-gray-300
    ">
      <div className="p-0 flex justify-between items-center mb-4">
        <h2 className="text-20 sm:text-24 font-bold">최신뉴스</h2>
        <Link to="/latest" className="text-14 sm:text-16 text-subBlue3 hover:underline">
          최신뉴스 바로가기 →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {newsData.map((item) => (
          <PostCard key={item.id} type="type2" id={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
