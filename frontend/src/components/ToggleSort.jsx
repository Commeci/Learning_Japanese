import { Toggle } from "@/components/ui/toggle";

export default function ToggleSort({ text, onClick, isAscending }) {
  return (
    <Toggle
      onPressedChange={() => onClick()} // onPressedChange 이벤트 사용
      pressed={!isAscending} // pressed 상태 추가
    >
      {text}
    </Toggle>
  );
}
