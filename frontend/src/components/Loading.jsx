export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center gap-4 rounded-lg bg-white/70">
      <div className="w-4 h-4 bg-mainBlue rounded-full animate-bounce"></div>
      <div className="w-4 h-4 bg-mainBlue rounded-full animate-bounce [animation-delay:0.2s]"></div>
      <div className="w-4 h-4 bg-mainBlue rounded-full animate-bounce [animation-delay:0.4s]"></div>
    </div>
  );
}
