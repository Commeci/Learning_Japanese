import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputName({ value, onChange, name }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="name" className="md:!text-14 !text-16">
        이름
      </Label>
      <Input
        type="text"
        id="name"
        name={name}
        value={value}
        onChange={onChange}
        placeholder="이름 입력"
      />
    </div>
  );
}
