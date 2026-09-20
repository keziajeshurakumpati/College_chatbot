import React, { useState } from 'react';
import {
  FileText,
  Menu,
  Sun,
  Moon,
  CircleHelp,
  Settings,
  X,
  MessageCircle,
  Search,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

import { COLLEGE_INFO } from '../data/collegeData';
import { AppSettings } from '../types';

interface HeaderProps {
  onNewChat: () => void;
  onOpenHistory: () => void;
  onOpenBrochure: () => void;
  onOpenSettings: () => void;
  settings: AppSettings;
  onToggleMobileView: () => void;
  onToggleTheme: () => void;
  chatCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenBrochure,
  onOpenSettings,
  settings,
  onToggleTheme,
}) => {

  const [showHowToUse, setShowHowToUse] = useState(false);

  const isDark = settings.theme !== 'light';

  return (
    <>
      <header
        id="app-header"
        className={`h-14 sm:h-15 border-b flex items-center justify-between gap-1.5 px-2 sm:gap-3 sm:px-5 backdrop-blur-md shrink-0 select-none transition-colors duration-200 ${
          isDark
            ? 'border-emerald-500/20 bg-black/40 text-slate-100'
            : 'border-emerald-200/70 bg-white/70 text-slate-800 shadow-xs'
        }`}
      >

        {/* Left Side */}

        <div className="flex items-center gap-2 min-w-0">

          {/* Mobile History Button */}

          <button
            onClick={onOpenHistory}
            className={`md:hidden w-10 h-10 shrink-0 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isDark
                ? 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/60 border-emerald-500/20'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200'
            }`}
            title="Chat History"
            aria-label="Chat History"
          >
            <Menu className="w-5 h-5" />
          </button>


          {/* Assistant Status */}

          <div
            className="flex items-center gap-2 min-w-0"
            title="Assistant Online"
            aria-label="Assistant Online"
          >

            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse"></div>

            <span
              className={`truncate text-[11px] sm:text-xs font-semibold uppercase tracking-tight ${
                isDark
                  ? 'text-emerald-400'
                  : 'text-emerald-700'
              }`}
            >
              <span className="sm:hidden">Online</span>
              <span className="hidden sm:inline">Assistant Online</span>
            </span>

            <span
              className={`hidden lg:inline-block truncate text-[11px] font-medium ml-1 ${
                isDark
                  ? 'text-emerald-500/60'
                  : 'text-slate-500'
              }`}
            >
              • {COLLEGE_INFO.shortName}
            </span>

          </div>

        </div>


        {/* Right Side */}

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">


          {/* Campus Prospectus */}

          <button
            onClick={onOpenBrochure}
            className={`w-10 h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isDark
                ? 'bg-[#071911]/80 border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/40 hover:border-emerald-400/40 hover:text-white'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
            }`}
            title="Campus Prospectus"
            aria-label="Campus Prospectus"
          >
            <FileText
              className={`w-4 h-4 ${
                isDark
                  ? 'text-emerald-400'
                  : 'text-emerald-600'
              }`}
            />
          </button>


          {/* HOW TO USE BUTTON */}

          <button
            onClick={() => setShowHowToUse(true)}
            className={`w-10 h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isDark
                ? 'bg-[#071911]/60 text-emerald-300 hover:text-white hover:bg-emerald-900/40 border-emerald-500/20'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200'
            }`}
            title="How to Use College Enquiry"
            aria-label="How to Use College Enquiry"
          >

            <CircleHelp
              className={`w-4 h-4 ${
                isDark
                  ? 'text-emerald-400'
                  : 'text-emerald-600'
              }`}
            />
          </button>

          <button
            onClick={onOpenSettings}
            className={`w-10 h-10 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isDark
                ? 'bg-[#071911]/60 text-emerald-300 hover:text-white hover:bg-emerald-900/40 border-emerald-500/20'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200'
            }`}
            title="Settings"
            aria-label="Settings"
          >
            <Settings className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </button>


          {/* Theme Toggle */}

          <button
            id="theme-toggle-button"
            onClick={onToggleTheme}
            className={`w-10 h-10 rounded-xl border transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center ${
              isDark
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-400/30 text-amber-300 hover:text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                : 'bg-emerald-100/90 hover:bg-emerald-200/90 border-emerald-300 text-emerald-900 hover:text-emerald-950'
            }`}
            title={
              isDark
                ? 'Switch to Light Theme'
                : 'Switch to Dark Theme'
            }
            aria-label={
              isDark
                ? 'Switch to Light Theme'
                : 'Switch to Dark Theme'
            }
          >

            {isDark ? (

              <>
                <Sun className="w-4 h-4 text-amber-400" />
              </>

            ) : (

              <>
                <Moon className="w-4 h-4 text-emerald-800" />
              </>

            )}

          </button>

        </div>

      </header>


      {/* HOW TO USE MODAL */}

      {showHowToUse && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          {/* Background */}

          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowHowToUse(false)}
          />


          {/* Modal */}

          <div
            className={`relative z-10 flex max-h-[calc(100dvh-1rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl sm:max-h-[90vh] sm:rounded-3xl ${
              isDark
                ? 'bg-[#061a13] border-emerald-500/30 text-slate-100'
                : 'bg-white border-emerald-200 text-slate-800'
            }`}
          >


            {/* Modal Header */}

            <div
              className={`flex shrink-0 items-center justify-between gap-3 p-4 border-b sm:p-6 ${
                isDark
                  ? 'border-emerald-500/20'
                  : 'border-emerald-100'
              }`}
            >

              <div className="flex min-w-0 items-center gap-3">

                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-emerald-500/15 border border-emerald-500/30">

                  <CircleHelp className="w-6 h-6 text-emerald-400" />

                </div>

                <div className="min-w-0">

                  <h2 className="text-xl font-bold">
                    How to Use
                  </h2>

                  <p
                    className={`mt-1 text-xs sm:text-sm ${
                      isDark
                        ? 'text-slate-400'
                        : 'text-slate-500'
                    }`}
                  >
                    Get the most out of your College Enquiry Assistant
                  </p>

                </div>

              </div>


              <button
                onClick={() => setShowHowToUse(false)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-emerald-900/40'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>

            </div>


            {/* Steps */}

            <div className="min-h-0 flex-1 overflow-y-auto p-4 grid gap-3 sm:p-6 sm:gap-4">


              {/* Step 1 */}

              <div
                className={`flex gap-3 p-3 rounded-2xl border sm:gap-4 sm:p-4 ${
                  isDark
                    ? 'bg-emerald-950/20 border-emerald-500/15'
                    : 'bg-emerald-50 border-emerald-100'
                }`}
              >

                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">

                  <Search className="w-5 h-5 text-emerald-400" />

                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <span className="text-xs text-emerald-400 font-bold">
                      STEP 1
                    </span>

                    <span className="font-bold">
                      Choose a Topic
                    </span>

                  </div>

                  <p
                    className={`text-sm mt-1 ${
                      isDark
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    Select topics like Admissions, Courses, Fees,
                    Eligibility, Scholarships or Hostel.
                  </p>

                </div>

              </div>


              {/* Step 2 */}

              <div
                className={`flex gap-3 p-3 rounded-2xl border sm:gap-4 sm:p-4 ${
                  isDark
                    ? 'bg-emerald-950/20 border-emerald-500/15'
                    : 'bg-emerald-50 border-emerald-100'
                }`}
              >

                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">

                  <MessageCircle className="w-5 h-5 text-emerald-400" />

                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <span className="text-xs text-emerald-400 font-bold">
                      STEP 2
                    </span>

                    <span className="font-bold">
                      Ask Your Question
                    </span>

                  </div>

                  <p
                    className={`text-sm mt-1 ${
                      isDark
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    Type your question naturally in the chat box.
                    For example: "What is the B.Tech fee?"
                  </p>

                </div>

              </div>


              {/* Step 3 */}

              <div
                className={`flex gap-3 p-3 rounded-2xl border sm:gap-4 sm:p-4 ${
                  isDark
                    ? 'bg-emerald-950/20 border-emerald-500/15'
                    : 'bg-emerald-50 border-emerald-100'
                }`}
              >

                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">

                  <Sparkles className="w-5 h-5 text-emerald-400" />

                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <span className="text-xs text-emerald-400 font-bold">
                      STEP 3
                    </span>

                    <span className="font-bold">
                      Get Instant Information
                    </span>

                  </div>

                  <p
                    className={`text-sm mt-1 ${
                      isDark
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    The College AI Assistant will provide relevant
                    information about the college.
                  </p>

                </div>

              </div>


              {/* Step 4 */}

              <div
                className={`flex gap-3 p-3 rounded-2xl border sm:gap-4 sm:p-4 ${
                  isDark
                    ? 'bg-emerald-950/20 border-emerald-500/15'
                    : 'bg-emerald-50 border-emerald-100'
                }`}
              >

                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">

                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />

                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <span className="text-xs text-emerald-400 font-bold">
                      STEP 4
                    </span>

                    <span className="font-bold">
                      Ask More Questions
                    </span>

                  </div>

                  <p
                    className={`text-sm mt-1 ${
                      isDark
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    Continue the conversation and ask follow-up
                    questions anytime.
                  </p>

                </div>

              </div>

            </div>


            {/* Footer */}

            <div
              className={`flex shrink-0 justify-end border-t p-4 ${
                isDark
                  ? 'border-emerald-500/20'
                  : 'border-emerald-100'
              }`}
            >

              <button
                onClick={() => setShowHowToUse(false)}
                className="min-h-11 w-full rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-black transition-all hover:bg-emerald-400 active:scale-95 cursor-pointer sm:w-auto"
              >
                Got it, Let's Start!
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
};