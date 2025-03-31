import { Button } from "@/components/ui/button";
import errorImg from "../../assets/404.svg";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();

  const handleMainClick = () => {
    navigate("/");
  };

  const handleBackClick = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="max-w-[1440px] m-auto p-4 flex flex-col justify-center items-center h-screen gap-36">
      <div className="w-80">
        <img src={errorImg} alt="" />
      </div>
      <div className="flex gap-4">
        <Button
          className="w-36 bg-mainBlue hover:bg-mainBlue/70"
          onClick={handleMainClick}
        >
          메인으로
        </Button>
        <Button
          className="w-36 bg-white border border-solid border-mainBlue text-black hover:bg-subBlue3 hover:text-white"
          onClick={handleBackClick}
        >
          이전으로
        </Button>
      </div>
    </div>
  );
}
