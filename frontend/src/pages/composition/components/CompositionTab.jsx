import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompositionCard from "@/pages/composition/components/CompositionCard";

export default function CompositionTab({
  compositionData,
  setIsModalOpen,
  setFeedback,
}) {
  return (
    <div>
      <Tabs defaultValue="button" className="">
        <TabsList>
          <TabsTrigger value="button">버튼식</TabsTrigger>
          <TabsTrigger value="handWrite">손글씨</TabsTrigger>
        </TabsList>
        <TabsContent value="button">
          <CompositionCard
            type="type1"
            modalType="button"
            {...compositionData}
            setIsModalOpen={setIsModalOpen}
            setFeedback={setFeedback}
          />
        </TabsContent>
        <TabsContent value="handWrite">
          <CompositionCard
            type="type2"
            write_type="compo"
            modalType="handWrite"
            {...compositionData}
            setIsModalOpen={setIsModalOpen}
            setFeedback={setFeedback}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
