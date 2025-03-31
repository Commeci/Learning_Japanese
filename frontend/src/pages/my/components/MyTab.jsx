import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyStudy from "./MyStudy";
import MyComposition from "./MyComposition";

export default function MyTab() {
  return (
    <div>
      <Tabs defaultValue="study" className="">
        <TabsList>
          <TabsTrigger value="study" className="!text-16">
            학습함
          </TabsTrigger>
          <TabsTrigger value="composition" className="!text-16">
            작문보기
          </TabsTrigger>
        </TabsList>
        <TabsContent value="study">
          <MyStudy />
        </TabsContent>
        <TabsContent value="composition">
          <MyComposition />
        </TabsContent>
      </Tabs>
    </div>
  );
}
