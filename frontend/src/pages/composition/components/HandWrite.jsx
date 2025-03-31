import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { postComposition } from "@/service/composition/postComposition";
import { postNewsComposition } from "@/service/composition/postNewsComposition";
import userStore from "@/store/userStore";
import { useRef, useState, useEffect } from "react";
import ReactSignatureCanvas from "react-signature-canvas";

export default function HandWrite({
  write_type,
  writing_id,
  question,
  setIsModalOpen,
  setFeedback,
}) {
  const [isSigned, setIsSigned] = useState(false);
  const [width, setWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const signatureRef = useRef(null);
  const user = userStore((state) => state.user);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClear = () => {
    signatureRef.current.clear();
    setIsSigned(false);
  };

  const handleSave = () => {
    if (signatureRef.current.isEmpty()) {
      alert("작문을 완료해주세요.");
      return;
    }

    setIsLoading(true);
    const canvas = signatureRef.current.getTrimmedCanvas();
    const newCanvas = document.createElement("canvas");
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const ctx = newCanvas.getContext("2d");

    // 흰색 배경 그리기
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // 원본 이미지 그리기
    ctx.drawImage(canvas, 0, 0);

    newCanvas.toBlob(async (blob) => {
      try {
        const formData = new FormData();
        formData.append("image", blob, "signature.png");

        if (write_type === "compo") {
          const result = await postComposition(writing_id, user.uid, formData);
          console.log("Upload successful:", result);
          setFeedback(result);
          setIsModalOpen(true);
        } else if (write_type === "news") {
          const result = await postNewsComposition(
            question,
            user.uid,
            formData
          );
          console.log("Upload successful:", result);
          setFeedback(result);
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("제출에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }, "image/png");
  };

  return (
    <div>
      {isLoading && <Loading />}
      <div ref={containerRef} className="relative w-full">
        {!isSigned && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            펜/손으로 작성해주세요
          </div>
        )}
        <ReactSignatureCanvas
          ref={signatureRef}
          canvasProps={{
            className:
              "signature-canvas border border-gray-200 bg-gray-50 rounded-lg",
            width: width,
            height: 450,
          }}
          clearOnResize={false}
          onBegin={() => setIsSigned(true)}
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={handleClear}
          className="px-4 py-2 text-14 md:text-16 text-customGray bg-gray-100 rounded-lg hover:bg-gray-100 hover:opacity-50 shadow"
        >
          다시 작성
        </Button>
        <Button
          onClick={handleSave}
          className="px-4 py-2 text-14 md:text-16 text-white bg-mainBlue shadow hover:bg-main hover:opacity-50"
        >
          제출하기
        </Button>
      </div>
    </div>
  );
}
