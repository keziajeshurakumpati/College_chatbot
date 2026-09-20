import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Download,
  Edit2,
  Check,
  Search,
  LogOut,
} from 'lucide-react';
import { ChatSession, AppSettings } from '../types';
import { User } from 'firebase/auth';
import { AdmissionDeskCard } from './AdmissionDeskCard';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  settings: AppSettings;
  currentUser?: User | null;
  preferredName: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  settings,
  currentUser,
  preferredName,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const startEditing = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditTitle(s.title);
  };

  const saveEditing = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) onRenameSession(id, editTitle.trim());
    setEditingId(null);
  };

  const handleExport = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    const content =
      `# College Enquiry Chat Transcript - ${session.title}\nDate: ${session.createdAt}\n\n` +
      session.messages
        .map(m => `### ${m.sender === 'user' ? '👤 Student' : '🎓 College Assistant'} (${m.timestamp})\n${m.text}\n`)
        .join('\n---\n\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `college-enquiry-${session.id.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isDark = settings.theme !== 'light';

  const displayName = preferredName;

  const initials = (displayName || 'U')
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <>
      <aside className={`w-[270px] xl:w-[280px] h-full border-r backdrop-blur-xl flex flex-col p-5 xl:p-6 shrink-0 select-none z-20 transition-colors duration-200 ${
        isDark
          ? 'border-emerald-900/30 bg-black/40 text-slate-100'
          : 'border-emerald-200/60 bg-white/70 text-slate-800 shadow-xs'
      }`}>
        <div className="flex items-center gap-3 mb-6 xl:mb-8 cursor-pointer group" onClick={onNewChat}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform shrink-0">
            <span className="text-xl font-black text-[#040806]">C</span>
          </div>
          <div className="min-w-0">
            <h1 className={`text-base font-bold leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              College<br />
              <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-extrabold`}>Enquiry</span>
            </h1>
          </div>
        </div>

        <button
          onClick={onNewChat}
          className={`w-full py-2.5 xl:py-3 px-4 rounded-xl font-medium transition-all mb-5 flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] cursor-pointer ${
            isDark
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-300'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-emerald-500/20'
          }`}
        >
          <Plus className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-white'}`} />
          <span className="text-sm font-semibold">New Chat</span>
        </button>

        {sessions.length > 2 && (
          <div className="relative mb-3">
            <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-emerald-500/40' : 'text-emerald-600/50'}`} />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg pl-8 pr-2 py-1.5 text-xs focus:outline-none transition-all ${
                isDark
                  ? 'bg-white/5 border border-emerald-900/40 text-slate-200 placeholder-emerald-500/40 focus:border-emerald-500/50'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500'
              }`}
            />
          </div>
        )}

        <nav className="flex-1 flex flex-col min-h-0 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
          <div className="flex items-center justify-between px-1 mb-1">
            <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-emerald-500/60' : 'text-emerald-800'}`}>
              Recent History
            </p>
            <span className="text-[10px] text-slate-500">{sessions.length} chats</span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-xs text-slate-500 px-2 py-4 text-center">No past conversations</div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group relative p-2.5 rounded-lg text-sm transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isActive
                      ? isDark
                        ? 'bg-emerald-500/10 border-l-2 border-emerald-500 text-slate-100 font-medium'
                        : 'bg-emerald-100/70 border-l-2 border-emerald-600 text-emerald-950 font-semibold'
                      : isDark
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {isEditing ? (
                    <div className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className={`text-xs px-2 py-1 rounded border w-full focus:outline-none ${isDark ? 'bg-black/60 text-white border-emerald-500/50' : 'bg-white text-slate-900 border-emerald-500'}`}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing(session.id, e);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <button onClick={(e) => saveEditing(session.id, e)} className="p-1 text-emerald-500 hover:text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="truncate text-xs flex-1">{session.title || 'College Enquiry'}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0">
                        <button onClick={(e) => handleExport(session, e)} className={`p-1 transition-colors ${isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-500 hover:text-emerald-700'}`} title="Export transcript">
                          <Download className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => startEditing(session, e)} className={`p-1 transition-colors ${isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-500 hover:text-emerald-700'}`} title="Rename">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        {sessions.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            className={`p-1 transition-colors ${isDark ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-600'}`}
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </nav>

        {/* Admission Desk quick-contact card */}
        <div className="mt-3">
          <AdmissionDeskCard isDark={isDark} />
        </div>

        {/* Signed-in student profile and logout */}
        <div className={`my-3 pt-3 border-t ${isDark ? 'border-emerald-500/20' : 'border-emerald-200/60'}`}>
          <div className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border ${
            isDark
              ? 'bg-[#06150e]/80 border-emerald-500/20'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border border-emerald-500/30 shrink-0"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDark
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-emerald-100 border border-emerald-200 text-emerald-800'
                }`}>
                  {initials}
                </div>
              )}

              <div className="min-w-0">
                <div className={`text-xs font-semibold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {displayName}
                </div>
                <div className={`text-[10px] ${isDark ? 'text-emerald-400/70' : 'text-emerald-700'}`}>
                  Student
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 ${
                isDark
                  ? 'border-transparent text-slate-400 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300'
                  : 'border-transparent text-slate-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
              }`}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl backdrop-blur-2xl sm:p-6 ${
            isDark
              ? 'bg-[#06150e]/95 border-emerald-500/20'
              : 'bg-white/95 border-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isDark ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-600'
              }`}>
                <LogOut className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 id="logout-dialog-title" className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Log out?
                </h2>
                <p className={`text-sm mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  You will need to sign in again to use the chatbot.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 mt-6 sm:flex-row sm:justify-end sm:gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium sm:w-auto ${
                  isDark
                    ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout?.();
                }}
                className="w-full rounded-lg bg-red-500/90 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 sm:w-auto"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
