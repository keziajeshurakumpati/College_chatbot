import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  CircleHelp,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Moon,
  Phone,
  Settings as SettingsIcon,
  Sun,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { AppSettings } from '../types';
import { COLLEGE_INFO } from '../data/collegeData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onClearAllChats: () => void;
  isDark?: boolean;
}

const sectionClass = (isDark: boolean) =>
  `rounded-2xl border p-3.5 ${
    isDark
      ? 'border-emerald-500/15 bg-[#0a1c14]/80'
      : 'border-emerald-200/70 bg-slate-50/80'
  }`;

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onClearAllChats,
  isDark = true,
}) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K],
  ) => {
    setLocalSettings((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    onSaveSettings(localSettings);
    onClose();
  };

  const textMuted = isDark ? 'text-emerald-100/60' : 'text-slate-500';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const iconColor = isDark ? 'text-emerald-400' : 'text-emerald-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-2 backdrop-blur-md animate-in fade-in duration-200 sm:p-4">
      <div
        className={`flex max-h-[calc(100dvh-1rem)] w-full min-w-0 max-w-lg flex-col overflow-hidden rounded-2xl border shadow-2xl sm:max-h-[min(720px,92vh)] sm:rounded-3xl ${
          isDark
            ? 'border-emerald-500/25 bg-[#08150f] text-white'
            : 'border-emerald-200 bg-white text-slate-800'
        }`}
      >
        <div
          className={`flex shrink-0 items-center justify-between border-b p-4 sm:p-5 ${
            isDark
              ? 'border-emerald-500/20 bg-[#06120d]'
              : 'border-emerald-100 bg-slate-50/80'
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                isDark
                  ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-400'
                  : 'border-emerald-300 bg-emerald-100 text-emerald-800'
              }`}
            >
              <SettingsIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`truncate text-base font-bold sm:text-lg ${textPrimary}`}>
                Settings
              </h2>
              <p className={`truncate text-xs ${textMuted}`}>
                Personalize your enquiry experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
              isDark
                ? 'text-emerald-300/70 hover:bg-emerald-950 hover:text-emerald-100'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Close settings"
            aria-label="Close settings"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 space-y-4 overflow-x-hidden overflow-y-auto p-3 sm:p-5">
          <section className={sectionClass(isDark)}>
            <div className={`mb-3 text-[10px] font-bold uppercase tracking-[0.16em] ${iconColor}`}>
              Appearance
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-100'}`}>
                {localSettings.theme === 'light' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className={`h-4 w-4 ${iconColor}`} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-sm font-semibold ${textPrimary}`}>Theme</div>
                <p className={`text-[11px] ${textMuted}`}>
                  Currently using {localSettings.theme === 'light' ? 'Light' : 'Dark'} theme
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(['light', 'dark'] as const).map((theme) => {
                const selected = localSettings.theme === theme || (theme === 'dark' && !localSettings.theme);
                return (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => updateSetting('theme', theme)}
                    className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-semibold transition-colors ${
                      selected
                        ? isDark
                          ? 'border-emerald-400 bg-emerald-900/60 text-white'
                          : 'border-emerald-500 bg-emerald-100 text-emerald-950'
                        : isDark
                          ? 'border-white/10 bg-black/20 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'
                    }`}
                  >
                    {theme === 'light' ? <Sun className="h-3.5 w-3.5 text-amber-500" /> : <Moon className={`h-3.5 w-3.5 ${iconColor}`} />}
                    {theme === 'light' ? 'Light' : 'Dark'}
                  </button>
                );
              })}
            </div>
          </section>

          <section className={sectionClass(isDark)}>
            <div className={`mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] ${iconColor}`}>
              Chat Experience
            </div>
            <label className="flex items-center justify-between gap-3 py-2">
              <span className="flex min-w-0 items-center gap-3">
                <Volume2 className={`h-4 w-4 shrink-0 ${iconColor}`} />
                <span>
                  <span className={`block text-sm font-semibold ${textPrimary}`}>Sound effects</span>
                  <span className={`block text-[11px] ${textMuted}`}>Play a sound when messages are sent and received</span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={localSettings.soundEffects}
                onChange={(event) => updateSetting('soundEffects', event.target.checked)}
                className="h-4 w-4 shrink-0 accent-emerald-500"
                aria-label="Toggle sound effects"
              />
            </label>
            <label className="flex items-center justify-between gap-3 border-t border-emerald-500/10 py-2">
              <span className="flex min-w-0 items-center gap-3">
                {localSettings.voiceReadout ? <Volume2 className={`h-4 w-4 shrink-0 ${iconColor}`} /> : <VolumeX className={`h-4 w-4 shrink-0 ${textMuted}`} />}
                <span>
                  <span className={`block text-sm font-semibold ${textPrimary}`}>Voice read-aloud</span>
                  <span className={`block text-[11px] ${textMuted}`}>Show voice controls for assistant answers</span>
                </span>
              </span>
              <input
                type="checkbox"
                checked={localSettings.voiceReadout}
                onChange={(event) => updateSetting('voiceReadout', event.target.checked)}
                className="h-4 w-4 shrink-0 accent-emerald-500"
                aria-label="Toggle voice read-aloud"
              />
            </label>
          </section>

          <section className={sectionClass(isDark)}>
            <div className={`mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] ${iconColor}`}>
              Help & Support
            </div>
            <div className="space-y-1">
              <div className={`flex items-start gap-3 rounded-xl p-2 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                <BookOpen className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
                <div>
                  <div className={`text-sm font-semibold ${textPrimary}`}>How to Use</div>
                  <p className={`text-[11px] ${textMuted}`}>Choose a topic below the chat or type your question directly.</p>
                </div>
              </div>
              <div className={`flex items-start gap-3 rounded-xl p-2 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                <CircleHelp className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
                <div>
                  <div className={`text-sm font-semibold ${textPrimary}`}>Frequently Asked Questions</div>
                  <p className={`text-[11px] ${textMuted}`}>Ask about admissions, courses, fees, hostel, placements, or exams.</p>
                </div>
              </div>
              <div className={`flex flex-wrap items-center gap-2 rounded-xl p-2 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
                <Mail className={`h-4 w-4 shrink-0 ${iconColor}`} />
                <span className={`mr-auto min-w-0 truncate text-[11px] ${textMuted}`}>Contact Admission Desk</span>
                <a href={`mailto:${COLLEGE_INFO.contact.email}`} className={`rounded-lg p-1.5 ${iconColor} hover:bg-emerald-500/10`} title="Email Admission Desk" aria-label="Email Admission Desk">
                  <Mail className="h-3.5 w-3.5" />
                </a>
                <a href={`tel:+91${COLLEGE_INFO.contact.helpline.replace(/\D/g, '').replace(/^91/, '')}`} className={`rounded-lg p-1.5 ${iconColor} hover:bg-emerald-500/10`} title="Call Admission Desk" aria-label="Call Admission Desk">
                  <Phone className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </section>

          <section className={sectionClass(isDark)}>
            <div className={`mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] ${iconColor}`}>
              Data
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to clear all chat conversations?')) {
                  onClearAllChats();
                  onClose();
                }
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/5 p-3 text-left text-red-300 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 shrink-0" />
              <span>
                <span className="block text-sm font-semibold">Clear Chat History</span>
                <span className="block text-[11px] text-red-300/70">Remove saved conversations from this browser</span>
              </span>
            </button>
          </section>

          <section className={sectionClass(isDark)}>
            <div className={`mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] ${iconColor}`}>
              About
            </div>
            <div className="flex items-start gap-3">
              <FileText className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
              <div className="min-w-0">
                <div className={`break-words text-sm font-semibold ${textPrimary}`}>Galgotias University College Enquiry Assistant</div>
                <p className={`mt-1 text-[11px] leading-relaxed ${textMuted}`}>
                  A student-focused assistant for trusted college information and enquiry support.
                </p>
                <p className={`mt-2 text-[10px] font-semibold uppercase tracking-wide ${iconColor}`}>
                  Student Assistant v1.0
                </p>
              </div>
            </div>
            <a
              href={COLLEGE_INFO.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 flex items-center gap-2 text-[11px] font-semibold ${iconColor} hover:underline`}
            >
              <MapPin className="h-3.5 w-3.5" />
              Official university website
              <ExternalLink className="h-3 w-3" />
            </a>
          </section>
        </div>

        <div
          className={`flex shrink-0 flex-col-reverse gap-2 border-t p-3 sm:flex-row sm:justify-end sm:p-4 ${
            isDark
              ? 'border-emerald-500/20 bg-[#06120d]'
              : 'border-emerald-100 bg-slate-50'
          }`}
        >
          <button
            onClick={onClose}
            className={`min-h-10 rounded-xl px-4 py-2 text-xs font-semibold ${
              isDark ? 'text-emerald-300/80 hover:bg-emerald-950' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="min-h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-bold text-black shadow-md transition hover:from-emerald-400 hover:to-teal-400"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};