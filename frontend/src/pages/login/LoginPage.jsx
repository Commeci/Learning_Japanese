import InputId from "@/components/InputId";
import InputPassword from "@/components/InputPassword";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/service/auth/login";
import { useState } from "react";
import { useAuth } from "@/service/auth/AuthContext";
import { userInfo } from "@/service/auth/userInfo";
import userStore from "@/store/userStore";
import Loading from "@/components/Loading";
import logo from "../../assets/logo01.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(formData);
      authLogin(response.access_token);

      const userData = await userInfo();
      userStore.getState().setUser(userData);

      navigate("/");
    } catch (error) {
      setError(error.message);
      navigate("/error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100vh] flex items-center justify-center">
      {isLoading && <Loading />}
      <div className="max-w-[1440px] w-full py-4 p-4 3xl:m-auto">
        <div className="flex justify-center mb-16">
          <Link to="/">
            <h1 className="text-logo">
              <img src={logo} alt="로고" />
            </h1>
          </Link>
        </div>
        <div
          className="max-w-[640px] m-auto flex flex-col gap-8"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <InputId
            value={formData.username}
            onChange={handleChange}
            name="username"
          />
          <InputPassword
            value={formData.password}
            onChange={handleChange}
            name="password"
          />
          {error && <p className="text-red-500 text-14 text-center">{error}</p>}
          <Button
            type="submit"
            className="bg-mainBlue h-14 !text-14 md:!text-16 hover:bg-subBlue3"
          >
            로그인
          </Button>
          </form>
          <Button
            type="button"
            className="bg-gray-200 h-14 !text-14 md:!text-16 hover:bg-gray-300 text-black"
            onClick={() => navigate("/register")}
          >
            회원가입
          </Button>
        </div>

      </div>
    </div>
  );
}
