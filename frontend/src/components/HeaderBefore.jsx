import { useNavigate } from "react-router-dom";

export default function HeaderBefore() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end px-2 pt-2">
      <button
        className="bg-transparent mr-4 border-none shadow-none hover:underline hover:underline-offset-4 hover:text-mainBlue text-14 sm:text-16 text-black text-center"
        onClick={() => navigate("/login")}
      >
        로그인
      </button>
    </div>
  );
}
