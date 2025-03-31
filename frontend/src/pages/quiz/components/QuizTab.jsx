import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuizCard from "./QuizCard";

export default function QuizTab({ quiz }) {
  return (
    <div>
      <Tabs defaultValue="hiragana" className="">
        <TabsList>
          <TabsTrigger value="hiragana">가나</TabsTrigger>
          <TabsTrigger value="kanji">한자</TabsTrigger>
          <TabsTrigger value="korean">국문</TabsTrigger>
        </TabsList>
        <TabsContent value="hiragana">
          <QuizCard
            question={quiz.question[1]}
            selection={quiz.selection.map((item) => item[1])}
            answer={quiz.answer}
            user_answer={quiz.user_answer}
          />
        </TabsContent>
        <TabsContent value="kanji">
          <QuizCard
            question={quiz.question[0]}
            selection={quiz.selection.map((item) => item[0])}
            answer={quiz.answer}
            user_answer={quiz.user_answer}
          />
        </TabsContent>
        <TabsContent value="korean">
          <QuizCard
            question={quiz.question[2]}
            selection={quiz.selection.map((item) => item[2])}
            answer={quiz.answer}
            user_answer={quiz.user_answer}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
