import { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSend, disabled, placeholder = 'Ask anything or describe changes...' }) {
  const [value, setValue] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const speechAvailable = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  useEffect(() => {
    if (!speechAvailable) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = e => {
      const t = e.results[0][0].transcript;
      setValue(v => v + (v ? ' ' : '') + t);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, []);

  function toggleVoice() {
    if (listening) { recognitionRef.current?.stop(); setListening(false); }
    else { recognitionRef.current?.start(); setListening(true); }
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <div className="border-t border-gray-100 bg-white p-3">
      <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-50 transition-all">
        {speechAvailable && (
          <button
            onClick={toggleVoice}
            className={`p-1.5 rounded-full flex-shrink-0 transition-colors ${
              listening ? 'bg-red-100 text-red-500 mic-listening' : 'text-gray-400 hover:text-gray-600'
            }`}
            title={listening ? 'Stop recording' : 'Voice input'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        )}
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent text-sm text-gray-800 resize-none outline-none placeholder-gray-400 py-0.5 min-h-[22px] max-h-32"
          style={{ scrollbarWidth: 'none' }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="p-1.5 bg-indigo-600 text-white rounded-full flex-shrink-0 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1 px-1">
        Try: "increase price by $20" · "add 14-day trial" · "add enterprise tier"
      </p>
    </div>
  );
}
