import React from 'react';
import { Sparkles, MessageCircleQuestion } from 'lucide-react';

interface SuggestedChipsProps {
  chips: string[];
  onSelect: (question: string) => void;
  title?: string;
}

export const SuggestedChips: React.FC<SuggestedChipsProps> = ({
  chips,
  onSelect,
  title = 'Suggested Enquiries',
}) => {
  if (!chips || chips.length === 0) return null;

  return (
    <div className="w-full space-y-2.5 py-1">
      {title && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400/80 px-1 tracking-wide uppercase">
          <MessageCircleQuestion className="w-3.5 h-3.5 text-emerald-400" />
          <span>{title}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(chip)}
            className="group inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#0b1b13]/80 hover:bg-[#112a1f] text-emerald-200/90 hover:text-emerald-100 border border-emerald-500/20 hover:border-emerald-400/50 shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left"
          >
            <Sparkles className="w-3 h-3 text-emerald-400 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="leading-snug">{chip}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
