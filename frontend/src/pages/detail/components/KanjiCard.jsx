export default function KanjiCard({ kanji }) {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="bg-subBlue2 p-2 flex flex-col gap-4">
        <h4 className="text-64 md:text-80 text-deepBlue font-bold">
          {kanji.kanji_char}
        </h4>
        <p className="ml-3 text-16 md:ml-4 md:text-20">
          의미: {kanji.description}
        </p>
      </div>
      <div className="p-2 ml-3 md:ml-4 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h5 className="text-20 md:text-24 font-bold text-deepBlue">
            음독: {kanji.voice}
          </h5>
          <p className="text-16 md:text-20">훈독: {kanji.mean}</p>
        </div>
        <div className="flex flex-col gap-4">
          <h5 className="text-20 md:text-24 font-bold text-deepBlue">
            사용되는 단어
          </h5>
          <ul className="list-disc pl-5 text-16 md:text-20">
            {kanji.word.map((word, index) => (
              <li key={index} className="mb-2 ">
                <p className="py-2">한자 : {word[0]}</p>
                <p className="py-2">뜻 : {word[1]}</p>
                <p className="py-2">읽는법 : {word[2]}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-subBlue2 p-2 flex flex-col gap-2">
        <h5 className="ml-3 md:ml-4 text-20 md:text-24 font-bold text-deepBlue">
          예문
        </h5>
        <ul className="ml-3 md:ml-4 list-decimal pl-5 text-16 md:text-20">
          {kanji.kanji_example.map((example, index) => (
            <li key={index} className="mb-2">
              {example}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
