import { CATEGORIES } from "@/constants/categories";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="h-auto bg-mainBlue text-white text-12 md:text-16">
            <div className="max-w-[1440px] py-4 m-4 3xl:m-auto flex flex-col justify-center">
                <div className="p-4">
                    <nav className="flex flex-col gap-8">
                        <ul className="flex flex-wrap gap-8">
                            {CATEGORIES.map((category) => (
                                <li key={category.number}>
                                    <Link
                                        to={`/post/${category.number}`}
                                        className="hover:underline hover:underline-offset-4"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <ul className="flex gap-8">
                            <li>
                                <Link to="/mypage">학습함</Link>
                            </li>
                            <li>
                                <Link to="/">계정탈퇴</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="border-t border-solid border-white">
                    <p className="p-4">
                        © {new Date().getFullYear()} いち All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
