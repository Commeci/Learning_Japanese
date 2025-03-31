import { Button } from "@/components/ui/button";
import { useAuth } from "@/service/auth/AuthContext";
import { postZandi } from "@/service/my/postZandi";
import { postLearnBox } from "@/service/detail/postMyStudy";
import userStore from "@/store/userStore";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function PostBottom({
  handleTTSClick,
  disabled,
  setQuizContent,
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const user = userStore((state) => state.user);

  const handleQuizClick = async () => {
    if (user.uid) {
      try {
        await postZandi(user.uid);
      } catch (error) {
        console.error("Failed to post zandi:", error);
      }
    }
    if (window.innerWidth >= 768) {
      setQuizContent((prev) => !prev);
    } else {
      navigate(`/quiz/${id}`);
    }
  };

  const handleLearnBoxClick = async () => {
    if (user.uid) {
      try {
        toast({
          title: "학습함에 담겼습니다.",
          variant: "default",
        });
        await postLearnBox(id, user.uid);
      } catch (error) {
        toast({
          title: "학습함 담기에 실패했습니다",
          variant: "default",
        });
        console.error("Failed to post learnBox:", error);
      }
    }
  };

  return (
    <div className="flex gap-2 mt-4 py-1">
      <Button
        className="bg-mainBlue !text-14 md:!text-16 hover:bg-subBlue3"
        onClick={handleTTSClick}
        disabled={disabled}
      >
        본문듣기
      </Button>
      <Button
        className="bg-mainBlue !text-14 md:!text-16 hover:bg-subBlue3"
        onClick={handleLearnBoxClick}
        disabled={!isAuthenticated}
      >
        학습함 담기
      </Button>
      <Button
        className="bg-mainBlue !text-14 md:!text-16 hover:bg-subBlue3"
        onClick={handleQuizClick}
        disabled={!isAuthenticated}
      >
        퀴즈풀기
      </Button>
    </div>
  );
}
