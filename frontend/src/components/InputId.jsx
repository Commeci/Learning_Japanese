import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function InputId({ value, onChange, name }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="id" className="md:!text-14 !text-16">
        아이디
      </Label>
      <Input
        type="text"
        id="id"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="ID 입력"
      />
    </div>
  );
}
