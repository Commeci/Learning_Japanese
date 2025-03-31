import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckPassword({ value, onChange, name }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="passwordCheck" className="md:!text-14 !text-16">
        비밀번호 확인
      </Label>
      <Input
        type="password"
        id="passwordCheck"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="password 확인"
      />
    </div>
  );
}
