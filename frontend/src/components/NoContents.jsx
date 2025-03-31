import noIcon from "../assets/no.svg";

export default function NoContents() {
  return (
    <div className="flex flex-col gap-12 justify-center items-center h-[calc(100vh-400px)]">
      <div>
        <img src={noIcon} alt="콘텐츠" className="h-28" />
      </div>
      <p className="font-Pretendard text-black text-20">콘텐츠가 없습니다</p>
    </div>
  );
}
