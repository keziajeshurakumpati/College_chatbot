import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  GraduationCap, 
  User, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  FileText,
  Bot
} from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  onSelectSuggestion?: (question: string) => void;
  onOpenBrochure?: () => void;
  isDark?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSelectSuggestion,
  onOpenBrochure,
  isDark = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const isBot = message.sender === 'bot';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const plainText = message.text
      .replace(/[*_#`~[\]]/g, '')
      .replace(/>/g, '')
      .replace(/\|/g, ' ');

    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`flex min-w-0 flex-col w-full my-3.5 sm:my-4 transition-all animate-in fade-in duration-200 ${
        isBot ? 'items-start' : 'items-end'
      }`}
    >
      <div
        className={`flex min-w-0 items-start gap-2 sm:gap-3.5 max-w-full sm:max-w-[85%] md:max-w-[80%] ${
          isBot ? 'flex-row' : 'flex-row-reverse'
        }`}
      >
        {/* Avatar */}
        <div className="shrink-0 mt-1 select-none">
          {isBot ? (
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center border shadow-md transition-all ${
              isDark
                ? 'bg-gradient-to-br from-emerald-500/20 via-teal-500/30 to-emerald-600/40 border-emerald-400/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-emerald-100 border-emerald-300 text-emerald-800 shadow-xs'
            }`}>
              <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400" />
            </div>
          ) : (
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center border transition-all ${
              isDark 
                ? 'bg-[#0b2419] border-emerald-500/25 text-emerald-300 shadow-[0_0_10px_rgba(0,0,0,0.5)]' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
          )}
        </div>

        {/* Message Container */}
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          {/* Sender Header for Bot */}
          {isBot && (
            <div className={`flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 px-1 text-[11px] font-medium ${
              isDark ? 'text-emerald-400' : 'text-emerald-700'
            }`}>
              <span className={`font-semibold tracking-tight flex items-center gap-1 ${isDark ? 'text-emerald-200' : 'text-slate-900'}`}>
                <span>College AI Assistant</span>
              </span>
              {message.confidence && message.confidence > 0.6 && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  isDark 
                    ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30 shadow-xs' 
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}>
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                  {Math.round(message.confidence * 100)}% verified match
                </span>
              )}
              <span className="text-slate-500 text-[10px] flex items-center gap-1 ml-auto">
                <Clock className="w-2.5 h-2.5" />
                {message.timestamp}
              </span>
            </div>
          )}

          {/* Bubble Card */}
          <div
            className={`min-w-0 max-w-full overflow-hidden p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl transition-all border backdrop-blur-xl ${
              isBot
                ? isDark
                  ? 'bg-[#081b12]/85 border-emerald-500/20 text-slate-100 rounded-tl-xs shadow-[0_10px_35px_rgba(0,0,0,0.6)]'
                  : 'bg-white/95 border-emerald-200 text-slate-800 rounded-tl-xs shadow-sm'
                : isDark
                  ? 'bg-gradient-to-r from-[#0d3826] to-[#0f4630] border-emerald-400/30 text-emerald-50 rounded-tr-xs shadow-[0_8px_25px_rgba(0,0,0,0.5)]'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-700 border-emerald-600 text-white rounded-tr-xs shadow-md'
            }`}
          >
            {/* Markdown Content */}
            <div className="text-sm sm:text-[14.5px] leading-relaxed break-words [overflow-wrap:anywhere] [&_a]:break-all">
              {isBot ? (
                <div className="space-y-2.5">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className={`mb-2 leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{children}</p>,
                      h1: ({ children }) => <h1 className={`text-base font-bold mb-2 pb-1.5 border-b ${isDark ? 'text-white border-emerald-500/25' : 'text-slate-900 border-emerald-100'}`}>{children}</h1>,
                      h2: ({ children }) => <h2 className={`text-sm font-bold mb-1.5 mt-3.5 ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>{children}</h2>,
                      h3: ({ children }) => <h3 className={`text-xs font-semibold mb-1 mt-2.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{children}</h3>,
                      ul: ({ children }) => <ul className={`list-disc list-inside space-y-1.5 my-2.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{children}</ul>,
                      ol: ({ children }) => <ol className={`list-decimal list-inside space-y-1.5 my-2.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      strong: ({ children }) => <strong className={`font-semibold ${isDark ? 'text-emerald-200' : 'text-slate-900'}`}>{children}</strong>,
                      blockquote: ({ children }) => (
                        <blockquote className={`border-l-3 pl-3.5 my-3 py-1.5 text-xs sm:text-sm rounded-r-xl italic ${
                          isDark
                            ? 'border-emerald-400 bg-emerald-950/50 text-emerald-200 shadow-xs'
                            : 'border-emerald-500 bg-emerald-50 text-emerald-950'
                        }`}>
                          {children}
                        </blockquote>
                      ),
                      code: ({ children }) => (
                        <code className={`px-2 py-0.5 rounded font-mono text-xs border ${
                          isDark
                            ? 'bg-[#040f0a] text-emerald-300 border-emerald-500/25'
                            : 'bg-slate-100 text-emerald-800 border-slate-200'
                        }`}>
                          {children}
                        </code>
                      ),
                      table: ({ children }) => (
                        <div className={`overflow-x-auto my-3.5 rounded-2xl border ${
                          isDark ? 'border-emerald-500/20 bg-[#040f0a]/90' : 'border-slate-200 bg-slate-50'
                        }`}>
                          <table className="min-w-full text-xs text-left">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => <thead className={`font-semibold ${isDark ? 'bg-emerald-950/60 text-emerald-300 border-b border-emerald-500/20' : 'bg-emerald-100/70 text-emerald-900'}`}>{children}</thead>,
                      tbody: ({ children }) => <tbody className={`divide-y ${isDark ? 'divide-emerald-500/15' : 'divide-slate-200'}`}>{children}</tbody>,
                      tr: ({ children }) => <tr className={`transition-colors ${isDark ? 'hover:bg-emerald-500/5' : 'hover:bg-slate-100/60'}`}>{children}</tr>,
                      th: ({ children }) => <th className={`px-3.5 py-2.5 font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>{children}</th>,
                      td: ({ children }) => <td className={`px-3.5 py-2.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{children}</td>,
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap font-medium tracking-normal leading-relaxed text-emerald-50">{message.text}</p>
              )}
            </div>

            {/* Actions for Bot */}
            {isBot && (
              <div className={`mt-3.5 pt-2.5 border-t flex flex-wrap items-center justify-between gap-2 text-xs ${
                isDark ? 'border-emerald-500/15' : 'border-emerald-100'
              }`}>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className={`min-h-9 rounded-xl transition-all flex items-center gap-1 px-2 text-[11px] font-medium cursor-pointer ${
                      isDark
                        ? 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/60 border border-transparent hover:border-emerald-500/20'
                        : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-100'
                    }`}
                    title="Copy Answer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSpeak}
                    className={`min-h-9 rounded-xl transition-all flex items-center gap-1 px-2 text-[11px] font-medium cursor-pointer ${
                      speaking
                        ? isDark
                          ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-400/40 animate-pulse'
                          : 'text-emerald-800 bg-emerald-100 animate-pulse'
                        : isDark
                          ? 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/60 border border-transparent hover:border-emerald-500/20'
                          : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-100'
                    }`}
                    title={speaking ? 'Stop Audio' : 'Listen to Answer'}
                  >
                    {speaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>

                {onOpenBrochure && (
                  <button
                    onClick={onOpenBrochure}
                    className={`inline-flex min-h-9 items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer border ${
                      isDark 
                        ? 'bg-emerald-950/50 border-emerald-500/25 text-emerald-300 hover:bg-emerald-900/60 hover:text-white' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <FileText className="w-3 h-3 text-emerald-400" />
                    <span>Prospectus</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* User message timestamp */}
          {!isBot && (
            <div className="px-1 text-right text-[10px] text-emerald-400/60 flex items-center justify-end gap-1">
              <span>{message.timestamp}</span>
              <Check className="w-3 h-3 text-emerald-400/80" />
            </div>
          )}

          {/* Related Follow-Up Quick Chips */}
          {isBot && message.relatedQuestions && message.relatedQuestions.length > 0 && onSelectSuggestion && (
            <div className="mt-2 pl-1 space-y-1.5">
              <div className={`text-[11px] font-medium flex items-center gap-1 ${
                isDark ? 'text-emerald-400/70' : 'text-slate-600'
              }`}>
                <Sparkles className={`w-3 h-3 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span>Related follow-up questions:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {message.relatedQuestions.slice(0, 3).map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectSuggestion(q)}
                    className={`max-w-full min-h-9 text-left text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                      isDark
                        ? 'bg-[#071911]/90 border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/50 hover:border-emerald-400/40 hover:text-white shadow-xs'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-950'
                    }`}
                  >
                    <span className="min-w-0 truncate max-w-[calc(100vw-5rem)] sm:max-w-md">{q}</span>
                    <ChevronRight className="w-3 h-3 opacity-60 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


