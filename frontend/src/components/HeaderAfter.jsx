import { useAuth } from "@/service/auth/AuthContext";
import { logout as logoutAPI } from "@/service/auth/logout";
import { useNavigate } from "react-router-dom";

export default function HeaderAfter() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // auth context에서 setter 가져오기

  const handleLogout = async () => {
    try {
      await logoutAPI();
      localStorage.removeItem("token");
      logout(); // 인증 상태를 false로 변경
      navigate("/");
    } catch (error) {
      console.error(error.message);
      localStorage.removeItem("token");
      logout(); // 에러가 발생해도 인증 상태는 false로 변경
      navigate("/");
    }
  };

  return (
    <div className="flex justify-end px-2 pt-2">
      <button
        className="bg-transparent mr-4 border-none shadow-none hover:underline hover:underline-offset-4 hover:text-mainBlue text-14 sm:text-16 text-black"
        onClick={() => navigate("/composition")}
      >
        작문하기
      </button>
      <button
        className="bg-transparent mr-4 border-none shadow-none hover:underline hover:underline-offset-4 hover:text-mainBlue text-14 sm:text-16 text-black"
        onClick={() => navigate("/mypage")}
      >
        학습함
      </button>
      <button
        className="bg-transparent border-none shadow-none hover:underline hover:underline-offset-4 mr-2 hover:text-mainBlue text-14 sm:text-16 text-black"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
}
