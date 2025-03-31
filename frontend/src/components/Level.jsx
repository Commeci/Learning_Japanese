import { FaStar } from "react-icons/fa";

export default function Level({ level }) {
  const getColorClass = (level) => {
    switch (level) {
      case "3":
        return "text-red-500";
      case "2":
        return "text-mainBlue";
      case "1":
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${getColorClass(
        level
      )}`}
    >
      <FaStar className="w-6 h-6 sm:w-8 sm:h-8" />
      <span className="w-6 h-6 sm:w-8 sm:h-8 absolute text-[12px] sm:text-14 font-bold flex justify-center items-center text-white">
        {level}
      </span>
    </div>
  );
}
