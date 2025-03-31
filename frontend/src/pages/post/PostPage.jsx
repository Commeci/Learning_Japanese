import PostCard from "@/components/PostCard";
import ToggleSort from "@/components/ToggleSort";
import { CATEGORIES } from "@/constants/categories";
import { getNewsByCategory } from "@/service/post/getNewsByCategory";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import thumbnailSvg from "../../assets/thumbnail.svg";
import Loading from "@/components/Loading";
import NoContents from "@/components/NoContents";

export default function PostPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    learnTime: "asc",
    level: "asc",
  });

  const categoryName =
    CATEGORIES.find((item) => item.number === Number(category))?.name ||
    "카테고리";

  const handleSort = (type) => {
    console.log("Sort clicked:", type); // 디버깅용
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
        // 정렬 순서를 반대로 변경
        return isAsc ? levelB - levelA : levelA - levelB; // 여기를 수정
      });
      setSortConfig((prev) => {
        const newConfig = { ...prev, level: isAsc ? "desc" : "asc" };
        console.log("New sort config:", newConfig);
        return newConfig;
      });
      console.log("Sorted data:", sorted);
      setNewsData(sorted);
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsByCategory(Number(category));

        const mappedData = response.news_items.map((item) => ({
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

        console.log("Initial sorted data:", sortedData); // 디버깅용
        setNewsData(sortedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err); // 디버깅용
        setError(err);
        setIsLoading(false);
        navigate("/error");
      }
    };

    fetchNews();
  }, [category, navigate]);

  const renderCard = () => {
    let cards = [];
    for (var i = 0; i < newsData.length; i += 4) {
      cards.push(
        <div
          key={`card-group-${i}`}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 sm:mb-6 pb-6 relative xl:border-b sm:border-solid border-gray-300"
        >
          {newsData.slice(i, i + 4).map((item) => (
            <div
              key={item.id}
              className="relative group after:content-[''] after:h-full after:absolute after:right-[calc(-1rem-6px)] after:bottom-0 after:border-r after:border-solid after:border-gray-300 after:border-b max-xl:after:border-r-0 max-xl:after:w-[calc(100%-1rem)] max-xl:after:h-0 max-xl:after:bottom-[calc(-1rem)] max-xl:after:left-[calc(0.5rem+6px)] [&:nth-child(4n)]:xl:after:border-0"
            >
              <PostCard type="type1" {...item} />
            </div>
          ))}
        </div>
      );
    }
    return cards;
  };

  if (isLoading) return <Loading />;
  if (error) return null;
  if (!newsData || newsData.length === 0) return <NoContents />;

  return (
    <div className="max-w-[1440px] py-4 p-4 3xl:m-auto ">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-24 font-bold mt-12 mx-2 border-b-2 border-solid border-gray-600 w-full pb-2">
          {categoryName}
        </h2>
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
      {renderCard().map((card) => card)}
    </div>
  );
}
