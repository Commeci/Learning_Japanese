import PostCard from "@/components/PostCard";
import ToggleSort from "@/components/ToggleSort";
import { getNewsRecent } from "@/service/common/getNewsRecent";
import { useEffect, useState } from "react";
import thumbnailSvg from "../../assets/thumbnail.svg";
import Loading from "@/components/Loading";
import { useNavigate } from "react-router-dom";
import NoContents from "@/components/NoContents";

export default function LatestPage() {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    learnTime: "asc",
    level: "asc",
  });

  const handleSort = (type) => {
    console.log("Sort clicked:", type);
    if (type === "time") {
      const isAsc = sortConfig.learnTime === "asc";
      const sorted = [...newsData].sort((a, b) => {
        const timeA = parseInt(a.learn_time.replace("분", ""));
        const timeB = parseInt(b.learn_time.replace("분", ""));
        return isAsc ? timeB - timeA : timeA - timeB;
      });
      setSortConfig((prev) => ({ ...prev, learnTime: isAsc ? "desc" : "asc" }));
      setNewsData(sorted);
    } else if (type === "difficulty") {
      const isAsc = sortConfig.level === "asc";
      const sorted = [...newsData].sort((a, b) => {
        const levelA = parseInt(a.level.replace("N", "")) || 1;
        const levelB = parseInt(b.level.replace("N", "")) || 1;
        return isAsc ? levelB - levelA : levelA - levelB;
      });
      setSortConfig((prev) => {
        const newConfig = { ...prev, level: isAsc ? "desc" : "asc" };
        console.log("New sort config:", newConfig);
        return newConfig;
      });
      setNewsData(sorted);
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsRecent();
        const mappedData = response.news_list.map((item) => ({
          id: item.news_id,
          thumbnail: item.thumbnail || thumbnailSvg,
          title: item.title,
          upload_date:
            item.upload_date || new Date().toISOString().split("T")[0],
          learn_time: item.learn_time.split(";")[0] || "10",
          level: item.level || "1",
        }));

        // 초기 정렬
        const sortedData = [...mappedData].sort((a, b) => {
          const timeA = parseInt(a.learn_time.replace("분", ""));
          const timeB = parseInt(b.learn_time.replace("분", ""));
          return timeA - timeB;
        });

        setNewsData(sortedData);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
        navigate("/error");
      }
    };

    fetchNews();
  }, [navigate]);

  if (isLoading) return <Loading />;
  if (error) return null;
  if (!newsData || newsData.length === 0) return <NoContents />;

  return (
    <div className="max-w-[1440px] py-4 p-4 3xl:m-auto">
      <div className="flex items-center justify-between mb-2 mt-12">
        <h2 className="text-16 md:text-24 font-bold">최신뉴스</h2>
      </div>
      <div className="flex justify-end gap-2 mb-4">
        <ToggleSort
          text="학습시간순"
          onClick={() => handleSort("time")}
          isAscending={sortConfig.learnTime === "asc"}
        />
        <ToggleSort
          text="난이도"
          onClick={() => handleSort("difficulty")}
          isAscending={sortConfig.level === "asc"}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-12">
        {newsData.map((item) => (
          <PostCard key={item.id} type="type1" id={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
