export default function NewsContent({ content, handleSentenceClick, type }) {
  const splitJapanese = (text) => {
    return text
      .split(/(?<=。)/)
      .filter((sentence) => sentence.trim().length > 5)
      .map((sentence) => sentence.trim());
  };

  const splitKorean = (text) => {
    return text
      .split(/(?<=다\.)|(?<=까\?)|(?<=요\.)|(?<=니다\.)|(?<=죠\.)/)
      .filter((sentence) => sentence.trim().length > 5)
      .map((sentence) => sentence.trim());
  };

  const sentences =
    type === "J" ? splitJapanese(content) : splitKorean(content);

  const formattedContent = sentences.map((sentence, index) => (
    <p
      key={index}
      className="mb-2 hover:text-mainBlue cursor-pointer"
      onClick={() => handleSentenceClick(sentence)}
    >
      {sentence}
    </p>
  ));

  return (
    <div className="py-4 leading-relaxed space-y-2">{formattedContent}</div>
  );
}
