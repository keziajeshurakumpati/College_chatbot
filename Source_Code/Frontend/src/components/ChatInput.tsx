import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  X, 
  Mic, 
  MicOff, 
  Sparkles,
  ChevronDown,
  ArrowUp,
} from 'lucide-react';
import { CATEGORIES, SUGGESTED_QUICK_CHIPS } from '../data/collegeData';
import { CollegeCategoryKey } from '../types';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading: boolean;
  onSelectCategory: (categoryKey: CollegeCategoryKey) => void;
  isDark?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  onSelectCategory,
  isDark = true,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    textareaRef.current?.focus();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSend(input.trim());
    setInput('');
    setShowCategoryMenu(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleClear = () => {
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const hasText = input.trim().length > 0;

  return (
    <div className="sticky bottom-0 z-20 w-full min-w-0 max-w-4xl mx-auto overflow-hidden px-1.5 sm:px-4 pb-2 sm:pb-5">
      {/* Category Quick Selector Popover */}
      {showCategoryMenu && (
        <div className={`mb-3 p-3.5 rounded-2xl backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200 border ${
          isDark
            ? 'bg-[#081811]/95 border-emerald-500/30 text-white shadow-[0_15px_40px_rgba(0,0,0,0.8)]'
            : 'bg-white/95 border-emerald-200 text-slate-900 shadow-emerald-900/10'
        }`}>
          <div className={`flex items-center justify-between pb-2.5 mb-2.5 border-b ${
            isDark ? 'border-emerald-500/20' : 'border-emerald-100'
          }`}>
            <span className={`text-xs font-semibold flex items-center gap-2 ${
              isDark ? 'text-emerald-300' : 'text-emerald-800'
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>College Enquiry Tools & Topics</span>
            </span>
            <button
              onClick={() => setShowCategoryMenu(false)}
              className={`text-xs p-1 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-emerald-950' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.key);
                  setShowCategoryMenu(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all group cursor-pointer ${
                  isDark
                    ? 'bg-[#05130d]/80 hover:bg-[#0c2419] border-emerald-500/15 hover:border-emerald-400/40'
                    : 'bg-emerald-50/70 hover:bg-emerald-100/90 border-emerald-200'
                }`}
              >
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate transition-colors ${
                    isDark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-800'
                  }`}>
                    {cat.title}
                  </div>
                  <div className={`text-[10px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {cat.badge}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Suggestion Chips Area */}
      <div className="flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-2 sm:pr-12 scroll-smooth">
        {SUGGESTED_QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSend(chip)}
            className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap cursor-pointer transition-all duration-200 select-none shrink-0 border ${
              isDark
                ? 'bg-[#06150e]/80 border-emerald-500/20 text-emerald-300/90 hover:bg-emerald-900/50 hover:border-emerald-400/50 hover:text-white shadow-xs hover:scale-[1.02]'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-950 hover:border-emerald-300 shadow-xs'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Modern Large AI Input Container */}
      <div className={`group/container min-w-0 rounded-[22px] sm:rounded-[26px] p-1.5 sm:p-2.5 backdrop-blur-2xl relative transition-all duration-300 border shadow-2xl ${
        isDark
          ? 'bg-[#07160f]/90 border-emerald-500/25 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)] focus-within:border-emerald-400/60 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.18)]'
          : 'bg-white/95 border-emerald-200 shadow-xl focus-within:border-emerald-500 focus-within:shadow-emerald-900/10'
      }`}>
        {/* Subtle Top Inner Highlight */}
        <div className={`absolute top-0 left-8 right-8 h-px pointer-events-none transition-opacity duration-300 ${
          isDark
            ? 'bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent opacity-60 group-focus-within/container:opacity-100'
            : 'bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent opacity-40'
        }`} />

        {/* Input & Action Controls Row */}
        <form onSubmit={handleSubmit} className="flex min-w-0 items-center gap-1 sm:gap-2">
          {/* Tools / Options Button on the Left */}
          <button
            type="button"
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className={`p-2.5 sm:p-3 rounded-2xl transition-all duration-200 flex items-center gap-1.5 text-xs shrink-0 cursor-pointer ${
              showCategoryMenu
                ? 'bg-emerald-500 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
                : isDark
                  ? 'bg-emerald-950/40 text-emerald-300 hover:text-white hover:bg-emerald-900/50 border border-emerald-500/20 hover:border-emerald-400/40'
                  : 'bg-slate-100 text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200'
            }`}
            title="Tools & Enquiry Topics"
          >
            <Sparkles className={`w-4 h-4 ${showCategoryMenu ? 'text-black' : 'text-emerald-400'}`} />
            <span className="hidden md:inline font-medium text-[11px]">Topics</span>
            <ChevronDown className={`w-3 h-3 opacity-60 hidden sm:inline transition-transform duration-200 ${showCategoryMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Text Area Frame */}
          <div className="flex min-w-0 flex-1 min-h-[44px] items-center px-1 sm:px-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening
                  ? 'Listening to your voice enquiry...'
                  : 'Ask anything about college admissions, courses, fees...'
              }
              className={`w-full bg-transparent text-sm sm:text-[15px] focus:outline-none resize-none py-2 max-h-28 overflow-y-auto leading-relaxed no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                isDark 
                  ? 'text-slate-100 placeholder:text-slate-400/80' 
                  : 'text-slate-800 placeholder:text-slate-400'
              }`}
            />

            {input.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className={`p-1.5 rounded-full transition-colors mr-1 cursor-pointer shrink-0 ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-200'
                }`}
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Voice Input / Microphone Button on the Right */}
          <button
            type="button"
            onClick={handleVoiceToggle}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-105'
                : isDark
                  ? 'bg-emerald-950/30 text-emerald-400 hover:text-emerald-200 hover:bg-emerald-900/40 border border-emerald-500/20 hover:border-emerald-400/40'
                  : 'bg-slate-100 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200'
            }`}
            title={isListening ? 'Stop Voice Recording' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Glowing Send Button on the Far Right */}
          <button
            type="submit"
            disabled={!hasText || isLoading}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-200 shrink-0 ${
              hasText && !isLoading
                ? 'bg-gradient-to-tr from-emerald-400 via-emerald-500 to-teal-400 text-black font-bold shadow-[0_0_22px_rgba(16,185,129,0.45)] hover:scale-105 active:scale-95 cursor-pointer'
                : isDark
                  ? 'bg-emerald-950/20 text-emerald-500/40 border border-emerald-500/10 cursor-not-allowed'
                  : 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            <ArrowUp className={`w-5 h-5 transition-transform duration-200 ${hasText ? 'stroke-[2.5]' : ''}`} />
          </button>
        </form>
      </div>
    </div>
  );
};


