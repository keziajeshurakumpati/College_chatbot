import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Award, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COLLEGE_INFO, COLLEGE_STATS, CATEGORIES } from '../data/collegeData';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryKey: any) => void;
  isDark?: boolean;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  isDark = true,
}) => {
  const [downloaded, setDownloaded] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', phone: '', program: 'B.Tech CSE' });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#14b8a6', '#ffffff']
    });

    const brochureText = `# ${COLLEGE_INFO.name}
${COLLEGE_INFO.tagline}
Location: ${COLLEGE_INFO.location}
Admissions: ${COLLEGE_INFO.admissionYear}

=== CAMPUS HIGHLIGHTS ===
- NAAC Accreditation: ${COLLEGE_STATS.naacGrade}
- NIRF Ranking: ${COLLEGE_STATS.nirfRank}
- Placement Record: ${COLLEGE_STATS.placementRate}
- Highest Package: ${COLLEGE_STATS.highestPackage}
- Average Package: ${COLLEGE_STATS.averagePackage}
- Scholarships Distributed: ${COLLEGE_STATS.scholarshipDistributed}

=== KEY PROGRAMS ===
1. B.Tech Computer Science & Engineering (AI/ML, Data Science, Cyber Security)
2. B.Tech Electronics & Communication (VLSI, IoT)
3. Bachelor of Computer Applications (BCA)
4. Master of Computer Applications (MCA)
5. Master of Business Administration (MBA)

=== CONTACT ADMISSIONS ===
Helpline: ${COLLEGE_INFO.contact.helpline}
Toll Free: ${COLLEGE_INFO.contact.tollFree}
Email: ${COLLEGE_INFO.contact.email}
Website: ${COLLEGE_INFO.contact.website}
`;

    const blob = new Blob([brochureText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Galgotias-University-Prospectus-${COLLEGE_INFO.admissionYear.replace(/\s+/g, '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) return;

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#10b981', '#34d399', '#14b8a6']
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] border shadow-2xl ${
        isDark
          ? 'bg-[#08150f] border-emerald-500/30 text-white'
          : 'bg-white border-emerald-200 text-slate-800'
      }`}>
        {/* Modal Top Header */}
        <div className={`p-4 sm:p-6 border-b flex items-center justify-between ${
          isDark
            ? 'border-emerald-500/20 bg-gradient-to-r from-[#06120d] via-[#091f15] to-[#06120d]'
            : 'border-emerald-100 bg-emerald-50/70'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
              isDark
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-400'
                : 'bg-emerald-100 border-emerald-300 text-emerald-800'
            }`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Campus Prospectus & Information Kit
              </h2>
              <p className={`text-xs ${isDark ? 'text-emerald-400/70' : 'text-emerald-700'}`}>
                {COLLEGE_INFO.name} • {COLLEGE_INFO.admissionYear}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'text-emerald-400/60 hover:text-emerald-200 hover:bg-emerald-950' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Stats Banner */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl border text-center ${
            isDark
              ? 'bg-[#0a1c14] border-emerald-500/20'
              : 'bg-emerald-50/50 border-emerald-200'
          }`}>
            <div>
              <div className="text-lg font-bold text-emerald-500">NAAC A++</div>
              <div className={`text-[10px] ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>Top Accreditation</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>₹48.5 LPA</div>
              <div className={`text-[10px] ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>Highest Package</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-500">98.4%</div>
              <div className={`text-[10px] ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>Placements Track</div>
            </div>
            <div>
              <div className={`text-lg font-bold ${isDark ? 'text-green-300' : 'text-emerald-700'}`}>100%</div>
              <div className={`text-[10px] ${isDark ? 'text-emerald-300/60' : 'text-slate-500'}`}>Merit Scholarships</div>
            </div>
          </div>

          {/* Quick Download Section */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${
            isDark
              ? 'bg-gradient-to-r from-emerald-950/80 to-[#0e271a] border-emerald-500/30'
              : 'bg-emerald-100/60 border-emerald-300'
          }`}>
            <div className="space-y-1 text-center sm:text-left">
              <h3 className={`text-sm sm:text-base font-bold flex items-center justify-center sm:justify-start gap-2 ${
                isDark ? 'text-white' : 'text-emerald-950'
              }`}>
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Download Official 2026 Admissions Booklet</span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-emerald-300/70' : 'text-emerald-800'}`}>
                Detailed syllabus, fee slabs, seat matrix, faculty credentials & hostel handbook.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-[#060c09] font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
            >
              {downloaded ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? 'Downloaded!' : 'Download Prospectus'}</span>
            </button>
          </div>

          {/* Instant Callback Form */}
          <div className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
            isDark ? 'bg-[#091b13] border-emerald-500/25' : 'bg-slate-50 border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Phone className="w-4 h-4 text-emerald-500" />
              <span>Request Priority Admission Counselling Call</span>
            </h3>

            {submitted ? (
              <div className={`p-4 rounded-xl text-center space-y-1 animate-in fade-in border ${
                isDark ? 'bg-emerald-950/60 border-emerald-400/40 text-white' : 'bg-emerald-50 border-emerald-300 text-slate-800'
              }`}>
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                <div className="text-sm font-bold">Callback Request Submitted!</div>
                <p className={`text-xs ${isDark ? 'text-emerald-300/80' : 'text-emerald-800'}`}>
                  Our Senior Admission Counsellor will contact you at <strong>{leadForm.phone}</strong> within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    className={`rounded-xl px-3 py-2 text-xs focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#05110c] border border-emerald-500/30 text-white placeholder-emerald-500/40 focus:border-emerald-400'
                        : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                    }`}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Contact Number *"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className={`rounded-xl px-3 py-2 text-xs focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#05110c] border border-emerald-500/30 text-white placeholder-emerald-500/40 focus:border-emerald-400'
                        : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                    className={`rounded-xl px-3 py-2 text-xs focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#05110c] border border-emerald-500/30 text-white placeholder-emerald-500/40 focus:border-emerald-400'
                        : 'bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500'
                    }`}
                  />
                  <select
                    value={leadForm.program}
                    onChange={(e) => setLeadForm({ ...leadForm, program: e.target.value })}
                    className={`rounded-xl px-3 py-2 text-xs focus:outline-none transition-all ${
                      isDark
                        ? 'bg-[#05110c] border border-emerald-500/30 text-white focus:border-emerald-400'
                        : 'bg-white border border-slate-200 text-slate-900 focus:border-emerald-500'
                    }`}
                  >
                    <option value="B.Tech CSE (AI & ML)">B.Tech CSE (AI & ML Specialization)</option>
                    <option value="B.Tech CSE (Core)">B.Tech CSE (Core Computer Science)</option>
                    <option value="B.Tech Data Science">B.Tech CSE (Data Science)</option>
                    <option value="BCA">BCA (Computer Applications)</option>
                    <option value="MCA">MCA (Master of Computer Applications)</option>
                    <option value="MBA">MBA (Business Administration)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Submit for Free Admission Guidance
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-emerald-500/20 bg-[#06120d] text-emerald-400/70' : 'border-emerald-100 bg-slate-50 text-slate-600'
        }`}>
          <span>Helpline: {COLLEGE_INFO.contact.tollFree}</span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
              isDark ? 'bg-[#0e271a] text-emerald-300 hover:bg-[#143a27]' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
