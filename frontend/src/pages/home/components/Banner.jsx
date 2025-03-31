import { useEffect, useState } from "react";
import thumbnailSvg from "../../../assets/thumbnail.svg";
import { getNewsRecent } from "@/service/common/getNewsRecent";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Banner() {
  const [bannerItems, setBannerItems] = useState([]);
  const navigate = useNavigate();
  const plugin = Autoplay({ delay: 3000, stopOnInteraction: false });

  const removeDateFromTitle = (title) => {
    // 정규 표현식: 날짜 형식 (예: "12/4(水) 9:09")
    const datePattern = /\d{1,2}\/\d{1,2}\([^)]+\)\s\d{1,2}:\d{2}/;
    // title에서 날짜 형식을 찾아 제거
    return title.replace(datePattern, "");
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await getNewsRecent();
        if (response.news_list && response.news_list.length > 0) {
          const items = response.news_list.slice(0, 3).map((news) => ({
            id: news.news_id,
            title: removeDateFromTitle(news.title),
            content: news.content,
            thumbnail: news.thumbnail || thumbnailSvg,
          }));
          setBannerItems(items);
        }
      } catch (err) {
        console.error(err);
        navigate("/error");
      }
    };

    fetchNews();
  }, [navigate]);

  const handleBannerClick = (newsId) => {
    navigate(`/postdetail/${newsId}`);
  };

  return (
    <div className="relative w-full max-w mx-auto">
      <Carousel plugins={[plugin]} className="w-full">
        <CarouselContent>
          {bannerItems.map((item) => (
            <CarouselItem key={item.id}>
              <div
                className="relative aspect-[21/9] max-h-[500px] w-full cursor-pointer [&>div]:hover:underline"
                onClick={() => handleBannerClick(item.id)}
              >
                <img
                  src={item.thumbnail}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover "
                />
                <div
                  className="
    absolute
    text-white text-[1rem] sm:text-[2rem] md:text-[3rem] font-bold
    bottom-0 left-0 right-0 p-4
    bg-black bg-opacity-50
  "
                >
                  {item.title}
                  <div className="flex flex-col gap-2 sm:gap-4">
                    <div className="text-12 sm:text-14 md:text-[1rem] mt-2 line-clamp-2 font-normal max-w-[40%] leading-[1.2rem]">
                      {item.content}
                    </div>
                    <span className="text-12 sm:text-14 md:text-[1rem] block">
                      자세히 보기
                    </span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
