import Calendar from "./components/Calendar";
import MyTab from "./components/MyTab";
import userStore from "@/store/userStore";

export default function MyPage() {
  const user = userStore((state) => state.user);

  return (
    <div className="max-w-[1440px] py-4 p-4 3xl:m-auto">
      <div className="w-full p-4 flex justify-center items-center">
        <Calendar userData={user.uid} />
      </div>
      <MyTab />
    </div>
  );
}
