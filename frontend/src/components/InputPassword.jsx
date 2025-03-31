import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function InputPassword({ value, onChange, name }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="password" className="md:!text-14 !text-16">
        비밀번호
      </Label>
      <Input
        type="password"
        id="password"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="password 입력"
      />
    </div>
  );
}
