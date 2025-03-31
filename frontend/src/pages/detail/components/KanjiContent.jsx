import KanjiCard from "./KanjiCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function KanjiContent({ content }) {
  return (
    <div className="p-4 rounded-lg bg-contentGray">
      <Carousel>
        <CarouselContent>
          {content.map((kanjiItem, index) => (
            <CarouselItem key={index}>
              <KanjiCard kanji={kanjiItem} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-between mt-8">
          <CarouselPrevious className="static scale-100 transform-none" />
          <CarouselNext className="static scale-100 transform-none" />
        </div>
      </Carousel>
    </div>
  );
}
