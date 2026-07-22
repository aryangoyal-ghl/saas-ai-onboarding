export default function TypingIndicator() {
  return (
    <div className="flex items-center mb-3">
      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
        AI
      </div>
      <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
        <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
      </div>
    </div>
  );
}
