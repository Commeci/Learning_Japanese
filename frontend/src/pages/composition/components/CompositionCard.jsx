import HandWrite from "./HandWrite";
import ButtonWrite from "./ButtonWrite";

export default function CompositionCard({
  type,
  write_type,
  modalType,
  ...props
}) {
  const renderCard = () => {
    const cardProps = { ...props, modalType, write_type };
    switch (type) {
      case "type1":
        return <Type1Card {...cardProps} />;
      case "type2":
        return <Type2Card {...cardProps} />;
      default:
        return null;
    }
  };
  return <div className="post-card cursor-pointer">{renderCard()}</div>;
}

// 버튼식
function Type1Card({
  korean,
  japanese_kana,
  user_input,
  words_kana,
  setIsModalOpen,
  setFeedback,
  modalType,
}) {
  return (
    <ButtonWrite
      korean={korean}
      japanese={japanese_kana}
      user_input={user_input}
      words_kana={words_kana}
      setIsModalOpen={setIsModalOpen}
      setFeedback={setFeedback}
      modalType={modalType}
    />
  );
}

// 손글씨
function Type2Card({
  write_type,
  writing_id,
  korean,
  setIsModalOpen,
  setFeedback,
}) {
  return (
    <div className="bg-contentGray p-4 rounded-lg flex flex-col gap-4">
      <p className="text-14 md:text-16">{korean}</p>
      <HandWrite
        write_type={write_type}
        question={korean}
        writing_id={writing_id}
        setIsModalOpen={setIsModalOpen}
        setFeedback={setFeedback}
      />
    </div>
  );
}
