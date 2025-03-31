import InputId from "@/components/InputId";
import InputPassword from "@/components/InputPassword";
import CheckPassword from "./components/CheckPassword";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/service/auth/register";
import { useState } from "react";
import Loading from "@/components/Loading";
import logo from "../../assets/logo01.svg";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userID: "",
    password: "",
    passwordCheck: "",
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

    // 유효성 검사
    if (!formData.userID || !formData.password) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (formData.password !== formData.passwordCheck) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        username: formData.userID,
        password: formData.password,
      });
      navigate("/login"); // 회원가입 성공 시 로그인 페이지로 이동
    } catch (error) {
      setError(error.message);
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
        <form
          onSubmit={handleSubmit}
          className="max-w-[640px] m-auto flex flex-col gap-8"
        >
          <InputId
            value={formData.userID}
            onChange={handleChange}
            name="userID"
          />
          <InputPassword
            value={formData.password}
            onChange={handleChange}
            name="password"
          />
          <CheckPassword
            value={formData.passwordCheck}
            onChange={handleChange}
            name="passwordCheck"
          />
          {error && <p className="text-red-500 text-14 text-center">{error}</p>}
          <Button
            type="submit"
            className="bg-mainBlue h-14 !text-14 md:!text-16 hover:bg-subBlue3"
          >
            회원가입
          </Button>
        </form>
      </div>
    </div>
  );
}
