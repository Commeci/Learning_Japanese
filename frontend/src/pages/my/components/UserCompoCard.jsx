import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function UserCompoCard({
  writing_id,
  korean,
  japanese_kanji,
  japanese_kana,
  user_input,
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value={writing_id}
        className="border border-solid rounded-md border-subBlue2 shadow px-2 py-1"
      >
        <AccordionTrigger className="text-14 md:text-16 ">
          {korean}
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-2">
            <p className="text-14 md:text-16">{japanese_kanji}</p>
            <p className="text-14 md:text-16">{japanese_kana}</p>
            <div className="text-14 md:text-16 w-full rounded-3xl overflow-hidden border border-solid border-gray-200 shadow">
              <img src={user_input} alt="composition" className="w-full" />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
