import { getUserCompo } from "@/service/composition/getUserCompo";
import userStore from "@/store/userStore";
import { useEffect, useState } from "react";
import UserCompoCard from "./UserCompoCard";
import Loading from "@/components/Loading";

export default function MyComposition() {
  const [compositions, setCompositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = userStore((state) => state.user);

  useEffect(() => {
    const fetchCompositions = async () => {
      setIsLoading(true);
      try {
        if (user?.uid) {
          const data = await getUserCompo(user.uid);
          setCompositions(data);
        }
      } catch (error) {
        console.error("Failed to fetch compositions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompositions();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-2">
      {compositions.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500 text-16 md:text-18">
            작성한 작문이 없습니다.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {compositions.map((composition) => (
            <UserCompoCard
              key={composition.writing_id}
              writing_id={composition.writing_id}
              korean={composition.korean}
              japanese_kanji={composition.japanese_kanji}
              japanese_kana={composition.japanese_kana}
              user_input={composition.user_input}
            />
          ))}
        </div>
      )}
    </div>
  );
}
