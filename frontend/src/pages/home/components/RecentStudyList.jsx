import PostCard from "@/components/PostCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import thumbnailSvg from "../../../assets/thumbnail.svg";
import Loading from "@/components/Loading";
import userStore from "@/store/userStore";
import { getMyStudy } from "@/service/my/getMyStudy";

export default function RecentStudyList() {
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = userStore((state) => state.user);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getMyStudy(user.uid);
        const mappedData = response.slice(0, 4).map((item) => ({
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
    setTimeout(()=>{
      fetchNews();
    }, 500);
  }, [user.uid, navigate]);

  if (isLoading) return <Loading />;
  if (error) return null;
  if (!newsData || newsData.length === 0)
    return <div>최근 공부한 뉴스가 없습니다</div>;

  return (
    <div className="py-4 mt-16">
      <div className="p-0 flex justify-between items-center mb-4">
        <h2 className="text-20 sm:text-24 font-bold">최근 학습 항목</h2>
        <Link
          to="/mypage"
          className="text-14 sm:text-16 cursor-pointer text-subBlue3"
        >
          학습 항목 바로가기 →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {newsData.map((item) => (
          <PostCard key={item.id} type="type1" id={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
