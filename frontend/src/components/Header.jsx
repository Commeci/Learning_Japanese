import { CATEGORIES } from "@/constants/categories";
import { Link, useLocation } from "react-router-dom";
import HeaderBefore from "./HeaderBefore";
import HeaderAfter from "./HeaderAfter";
import { useAuth } from "@/service/auth/AuthContext";
import logo from "../assets/logo01.svg";

export default function Header() {
  const currentDate = new Date().toLocaleDateString("en-CA");
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-solid border-gray-200">
      {isAuthenticated ? <HeaderAfter /> : <HeaderBefore />}
      <div className="p-2 flex justify-center items-end">
        <Link to="/">
          <h1 className="text-sm sm:text-logo font-dela mb-4">
            <img src={logo} alt="로고" className="h-10 " />
          </h1>
        </Link>
        <span className="text-14 text-mainBlue font-bold absolute right-4 bottom-12 mb-2">
          {currentDate.replace(/-/g, ".")}
        </span>
      </div>
      <div className="relative">
        <nav className="">
          <ul className="flex text-black text-14 sm:text-[1.1rem] max-w-[960px] m-auto overflow-x-auto whitespace-nowrap no-scrollbar">
            {CATEGORIES.map((category) => {
              const isActive = location.pathname === `/post/${category.number}`;
              return (
                <li
                  key={category.number}
                  className={`flex-1 min-w-[80px] text-center p-2 border-b-2 border-solid hover:border-mainBlue ${
                    isActive ? "border-mainBlue" : "border-white"
                  }`}
                >
                  <Link
                    to={`/post/${category.number}`}
                    className={`block w-full py-2 font-bold hover:text-mainBlue ${
                      isActive ? "font-bold text-mainBlue" : "text-gray-600"
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
