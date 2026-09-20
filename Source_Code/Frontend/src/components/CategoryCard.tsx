import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CircleDollarSign, 
  BadgeCheck, 
  Gift, 
  Home, 
  Briefcase, 
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { CategoryInfo, CollegeCategoryKey } from '../types';

interface CategoryCardProps {
  category: CategoryInfo;
  onSelect: (query: string, categoryKey: string) => void;
  index: number;
  isDark?: boolean;
}

const CATEGORY_ICONS: Record<CollegeCategoryKey, React.ComponentType<{ className?: string }>> = {
  admissions: GraduationCap,
  courses: BookOpen,
  fees: CircleDollarSign,
  eligibility: BadgeCheck,
  scholarships: Gift,
  hostel: Home,
  placements: Briefcase,
  examinations: FileSpreadsheet,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelect, index, isDark = true }) => {
  const IconComponent = CATEGORY_ICONS[category.key] || GraduationCap;

  const handleClick = () => {
    const defaultQuery = category.sampleQuestions[0] || `Tell me about ${category.title}`;
    onSelect(defaultQuery, category.key);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`group relative rounded-2xl p-4 sm:p-4.5 h-full flex flex-col justify-between cursor-pointer select-none transition-all duration-300 ease-out border backdrop-blur-xl ${
        isDark
          ? 'bg-[#071710]/80 border-emerald-500/20 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.6)] hover:bg-[#0c2419]/90 hover:border-emerald-400/50 hover:shadow-[0_12px_32px_-6px_rgba(16,185,129,0.22)] hover:-translate-y-1.5'
          : 'bg-white/85 border-emerald-200/80 shadow-xs hover:bg-emerald-50/90 hover:border-emerald-400/80 hover:shadow-md hover:-translate-y-1.5'
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Subtle Top-Edge Ambient Light Accent */}
      <div 
        className={`absolute top-0 left-6 right-6 h-px transition-opacity duration-300 ${
          isDark 
            ? 'bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-40 group-hover:opacity-100' 
            : 'bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent opacity-0 group-hover:opacity-100'
        }`} 
      />

      {/* Main Card Content */}
      <div className="flex-1 flex flex-col justify-start space-y-3">
        {/* Prominent Category Icon Container */}
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border ${
            isDark
              ? 'bg-emerald-500/15 border-emerald-400/25 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] group-hover:bg-emerald-500/25 group-hover:border-emerald-400/60 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : 'bg-emerald-100/90 border-emerald-300 text-emerald-800 group-hover:bg-emerald-200/90 group-hover:scale-105 group-hover:shadow-xs'
          }`}>
            <IconComponent className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          </div>

          {/* Badge */}
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border transition-colors shrink-0 ${
            isDark
              ? 'bg-emerald-950/60 border-emerald-500/20 text-emerald-400/90 group-hover:border-emerald-500/40'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {category.badge}
          </span>
        </div>

        {/* Title and Description */}
        <div className="flex-1">
          <h3 className={`font-bold text-sm tracking-tight transition-colors duration-200 ${
            isDark 
              ? 'text-white group-hover:text-emerald-300' 
              : 'text-slate-900 group-hover:text-emerald-800'
          }`}>
            {category.title}
          </h3>
          <p className={`text-xs leading-relaxed mt-1 line-clamp-2 min-h-[2rem] transition-colors duration-200 ${
            isDark
              ? 'text-slate-400 group-hover:text-slate-300'
              : 'text-slate-600 group-hover:text-slate-800'
          }`}>
            {category.description}
          </p>
        </div>
      </div>

      {/* Footer / Explore Indicator */}
      <div className={`mt-3.5 pt-2.5 border-t flex items-center justify-between text-xs transition-colors select-none ${
        isDark
          ? 'border-emerald-500/20 text-emerald-400 group-hover:text-emerald-300'
          : 'border-emerald-100 text-emerald-700 group-hover:text-emerald-900'
      }`}>
        <span className={`text-[11px] font-medium whitespace-nowrap transition-opacity duration-200 ${
          isDark ? 'text-emerald-300/90 group-hover:text-white' : 'text-emerald-800'
        }`}>
          Enquire Now
        </span>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold whitespace-nowrap shrink-0">
          <span>Ask</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};


