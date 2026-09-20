import React from 'react';
import { 
  Sparkles
} from 'lucide-react';
import { CATEGORIES, COLLEGE_INFO, COLLEGE_STATS } from '../data/collegeData';
import { CategoryCard } from './CategoryCard';

interface EmptyChatHeroProps {
  onSelectPrompt: (prompt: string, categoryKey?: string) => void;
  onOpenBrochure: () => void;
  preferredName: string;
  isDark?: boolean;
}

export const EmptyChatHero: React.FC<EmptyChatHeroProps> = ({
  onSelectPrompt,
  onOpenBrochure,
  preferredName,
  isDark = true,
}) => {
  return (
    <div className="w-full min-w-0 max-w-5xl mx-auto pt-2 sm:pt-4 pb-10 sm:pb-20 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Centered Hero Header */}
      <div className="relative text-center space-y-3 pt-2 sm:pt-4 px-2">
        {/* Subtle Ambient Radial Glow Behind Hero */}
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[480px] h-36 rounded-full pointer-events-none blur-3xl transition-opacity duration-500 ${
            isDark ? 'bg-emerald-500/12 opacity-80' : 'bg-emerald-400/15 opacity-60'
          }`} 
        />

        <div className="relative z-10 space-y-2.5">
          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            🎓 College{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
              Enquiry
            </span>
          </h2>

          <p className={`text-sm sm:text-lg font-semibold tracking-tight ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Hi {preferredName}! 👋
          </p>

          <p className={`text-sm sm:text-lg font-semibold tracking-tight ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            How can I help you with your Galgotias University enquiry today?
          </p>

          <p className={`text-xs sm:text-sm font-normal max-w-xl mx-auto leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Ask me anything about admissions, courses, fees, eligibility, scholarships, hostel, placements and campus life.
          </p>

          {/* College Information Badge */}
          <div className="pt-1">
            <div className={`inline-flex max-w-full items-center gap-2 px-3.5 py-1.5 rounded-full text-center text-[10px] sm:text-xs font-semibold shadow-xs border transition-all ${
              isDark
                ? 'bg-emerald-950/40 border-emerald-500/25 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-xs'
            }`}>
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span className="break-words">{COLLEGE_INFO.name} • NAAC {COLLEGE_STATS.naacGrade} • {COLLEGE_STATS.nirfRank}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8 Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.map((category, index) => (
          <CategoryCard
            key={category.key}
            category={category}
            index={index}
            onSelect={(query) => onSelectPrompt(query, category.key)}
            isDark={isDark}
          />
        ))}
      </div>

      {/* Quick Metrics Strip */}
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl text-center backdrop-blur-sm border ${
        isDark
          ? 'bg-black/30 border-emerald-900/30'
          : 'bg-white/80 border-emerald-200/60 shadow-xs'
      }`}>
        <div>
          <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>98.4%</div>
          <div className={`text-[10px] sm:text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Placement Track</div>
        </div>
        <div>
          <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>₹48.5 LPA</div>
          <div className={`text-[10px] sm:text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Highest Package</div>
        </div>
        <div>
          <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>₹4.2 Cr+</div>
          <div className={`text-[10px] sm:text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Scholarships Fund</div>
        </div>
        <div>
          <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-green-300' : 'text-green-700'}`}>250+</div>
          <div className={`text-[10px] sm:text-[11px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Top Recruiters</div>
        </div>
      </div>
    </div>
  );
};

