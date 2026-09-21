import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Download, 
  Calendar, 
  Search,
  Check,
  Edit2,
  LogOut
} from 'lucide-react';
import { ChatSession } from '../types';
import { User } from 'firebase/auth';
import { AdmissionDeskCard } from './AdmissionDeskCard';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  currentUser?: User | null;
  preferredName?: string;
  onLogout?: () => void;
  isDark?: boolean;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  currentUser,
  preferredName = 'Student',
  onLogout,
  isDark = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isOpen) return null;

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
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleExport = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    const content = `# College Enquiry Chat Transcript - ${session.title}\nDate: ${session.createdAt}\n\n` +
      session.messages.map(m => `### ${m.sender === 'user' ? '👤 Student' : '🎓 College Assistant'} (${m.timestamp})\n${m.text}\n`).join('\n---\n\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `college-enquiry-${session.id.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-[min(100%,28rem)] h-full min-w-0 shadow-2xl flex flex-col p-3 sm:p-6 animate-in slide-in-from-right duration-300 border-l ${
        isDark
          ? 'bg-[#07130e] border-emerald-500/25 text-white'
          : 'bg-white border-emerald-200 text-slate-800'
      }`}>
        {/* Drawer Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-emerald-500/20' : 'border-emerald-100'
        }`}>
          <div className="flex items-center gap-2">
            <MessageSquare className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Enquiry History</h2>
          </div>
          <button
            onClick={onClose}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors cursor-pointer ${
              isDark ? 'text-emerald-400/60 hover:text-emerald-200 hover:bg-emerald-950' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="Close history"
            aria-label="Close history"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="pt-4 pb-2">
          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="min-h-11 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Enquiry</span>
          </button>
        </div>

        {/* Search Field */}
        <div className="relative my-3">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-emerald-500/50' : 'text-emerald-700/50'
          }`} />
          <input
            type="text"
            placeholder="Search past conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition-all ${
              isDark
                ? 'bg-[#0a1b14] border border-emerald-500/20 text-white placeholder-emerald-500/40 focus:border-emerald-400/60'
                : 'bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500'
            }`}
          />
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 my-2">
          {filteredSessions.length === 0 ? (
            <div className={`text-center py-12 space-y-2 ${isDark ? 'text-emerald-400/50' : 'text-slate-400'}`}>
              <MessageSquare className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">No saved enquiries found.</p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditingThis = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  className={`group relative p-3 rounded-2xl cursor-pointer border transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-gradient-to-r from-emerald-950/90 to-[#0e271a] border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-emerald-50 border-emerald-400 shadow-xs'
                      : isDark
                        ? 'bg-[#091811]/60 hover:bg-[#0e2319] border-emerald-500/15'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {isEditingThis ? (
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className={`text-xs px-2 py-1 rounded border flex-1 focus:outline-none ${
                              isDark
                                ? 'bg-[#05110c] text-white border-emerald-400/60'
                                : 'bg-white text-slate-900 border-emerald-500'
                            }`}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditing(session.id, e);
                            }}
                          />
                          <button
                            onClick={(e) => saveEditing(session.id, e)}
                            className="p-1 text-emerald-500 hover:text-emerald-400 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <h4 className={`text-xs font-semibold truncate ${
                          isDark
                            ? 'text-white group-hover:text-emerald-300'
                            : 'text-slate-900 group-hover:text-emerald-800'
                        }`}>
                          {session.title || 'General College Enquiry'}
                        </h4>
                      )}

                      <div className={`flex items-center gap-2 mt-1 text-[10px] ${
                        isDark ? 'text-emerald-400/60' : 'text-slate-500'
                      }`}>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" />
                          {session.updatedAt || session.createdAt}
                        </span>
                        <span>•</span>
                        <span>{session.messages.length} messages</span>
                      </div>
                    </div>

                    {/* Action buttons on hover */}
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleExport(session, e)}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          isDark ? 'text-emerald-400/70 hover:text-emerald-200' : 'text-slate-400 hover:text-emerald-700'
                        }`}
                        title="Export transcript"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => startEditing(session, e)}
                        className={`p-1 transition-colors cursor-pointer ${
                          isDark ? 'text-emerald-400/70 hover:text-emerald-200' : 'text-slate-400 hover:text-emerald-700'
                        }`}
                        title="Rename"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {sessions.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="p-1 text-red-400/70 hover:text-red-500 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-3">
          <AdmissionDeskCard isDark={isDark} />
        </div>

        {currentUser && (
          <div className={`mt-3 border-t pt-3 ${isDark ? 'border-emerald-500/15' : 'border-emerald-100'}`}>
            <div className={`flex items-center justify-between gap-3 rounded-xl border p-2.5 ${
              isDark ? 'border-emerald-500/20 bg-[#06150e]/80' : 'border-emerald-200 bg-emerald-50'
            }`}>
              <div className="flex min-w-0 items-center gap-2.5">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt={preferredName} className="h-9 w-9 shrink-0 rounded-full border border-emerald-500/30 object-cover" />
                ) : (
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    isDark ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-emerald-200 bg-emerald-100 text-emerald-800'
                  }`}>
                    {preferredName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className={`truncate text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{preferredName}</div>
                  <div className={`text-[10px] ${isDark ? 'text-emerald-400/70' : 'text-emerald-700'}`}>Student</div>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                  isDark ? 'border-transparent text-slate-400 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300' : 'border-transparent text-slate-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600'
                }`}
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={`pt-3 border-t text-[11px] text-center ${
          isDark ? 'border-emerald-500/15 text-emerald-500/60' : 'border-emerald-100 text-slate-500'
        }`}>
          Encrypted & stored locally in browser storage
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm" role="presentation">
          <div className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl sm:p-6 ${
            isDark ? 'border-emerald-500/20 bg-[#06150e]/95' : 'border-emerald-200 bg-white/95'
          }`} role="dialog" aria-modal="true" aria-labelledby="mobile-logout-title">
            <h2 id="mobile-logout-title" className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Log out?</h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>You will need to sign in again to use the chatbot.</p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`min-h-10 w-full rounded-lg px-4 py-2 text-sm font-medium sm:w-auto ${isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout?.();
                }}
                className="min-h-10 w-full rounded-lg bg-red-500/90 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:w-auto"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
