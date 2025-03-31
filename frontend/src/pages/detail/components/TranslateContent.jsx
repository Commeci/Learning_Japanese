import NewsContent from "./NewsContent";

export default function TranslateContent({ content, handleSentenceClick }) {
  return (
    <div className="p-2 rounded-lg bg-contentGray">
      <NewsContent
        content={content}
        handleSentenceClick={handleSentenceClick}
        type="K"
      />
    </div>
  );
}
