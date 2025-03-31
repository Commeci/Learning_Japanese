import { createBrowserRouter, Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ErrorPage from "./pages/error/ErrorPage";
import HomePage from "./pages/home/HomePage";
import PostPage from "./pages/post/PostPage";
import PostDetailPage from "./pages/detail/PostDetailPage";
import MyPage from "./pages/my/MyPage";
import LatestPage from "./pages/latest/LatestPage";
import CompositionPage from "./pages/composition/CompositionPage";
import QuizPage from "./pages/quiz/QuizPage";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import { ScrollToTop } from "./components/ScrollToTop";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <div id="wrapper">
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
        </div>
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/post/:category",
        element: <PostPage />,
      },
      {
        path: "/postdetail/:id",
        element: <PostDetailPage />,
      },
      {
        path: "/mypage",
        element: <MyPage />,
      },
      {
        path: "/latest",
        element: <LatestPage />,
      },
      {
        path: "/composition",
        element: <CompositionPage />,
      },
      {
        path: "/quiz/:id",
        element: <QuizPage />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <>
        <ScrollToTop />
        <LoginPage />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <ScrollToTop />
        <RegisterPage />
      </>
    ),
  },
  {
    path: "*", // 와일드카드 경로 추가
    element: <ErrorPage />,
  },
]);
