import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
} from 'lucide-react';
import { COLLEGE_INFO } from '../data/collegeData';

interface AdmissionDeskCardProps {
  isDark: boolean;
}

/**
 * Sidebar "Admission Desk" quick-contact widget.
 * - Email  -> opens Gmail compose (new tab)
 * - Phone  -> opens the device dialer (tel: link)
 * - Location -> opens Google Maps for the campus address
 * - Follow Us -> official social profiles
 */
export const AdmissionDeskCard: React.FC<AdmissionDeskCardProps> = ({ isDark }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { email, helpline } = COLLEGE_INFO.contact;
  const address = COLLEGE_INFO.address;
  const social = COLLEGE_INFO.social;

  // tel: expects digits only (keep leading + for country code if present)
  const telHref = `tel:+91${helpline.replace(/\D/g, '').replace(/^91/, '')}`;

  const gmailComposeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}&su=${encodeURIComponent('Admission Enquiry')}`;

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  const rows: {
    key: string;
    icon: React.ReactNode;
    label: string;
    href: string;
    external?: boolean;
  }[] = [
    { key: 'email', icon: <Mail className="w-4 h-4" />, label: email, href: gmailComposeHref, external: true },
    { key: 'phone', icon: <Phone className="w-4 h-4" />, label: helpline, href: telHref },
    { key: 'location', icon: <MapPin className="w-4 h-4" />, label: 'View Campus Location', href: mapsHref, external: true },
  ];

  const socialLinks: { key: string; icon: React.ReactNode; href: string; label: string }[] = [
    { key: 'instagram', icon: <Instagram className="w-4 h-4" />, href: social.instagram, label: 'Instagram' },
    { key: 'facebook', icon: <Facebook className="w-4 h-4" />, href: social.facebook, label: 'Facebook' },
    { key: 'youtube', icon: <Youtube className="w-4 h-4" />, href: social.youtube, label: 'YouTube' },
    { key: 'linkedin', icon: <Linkedin className="w-4 h-4" />, href: social.linkedin, label: 'LinkedIn' },
  ];

  return (
    <div
      className={`w-full min-w-0 overflow-hidden rounded-xl border transition-colors ${
        isDark
          ? 'border-emerald-500/20 bg-[#06150e]/80'
          : 'border-emerald-200 bg-emerald-50'
      }`}
    >
      <button
        type="button"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-expanded={isExpanded}
        aria-controls="admission-desk-links"
        className={`flex min-h-11 w-full items-center gap-2.5 px-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400/70 ${
          isDark
            ? 'text-slate-200 hover:bg-emerald-950/60'
            : 'text-slate-800 hover:bg-white/70'
        }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
            isDark
              ? 'border border-emerald-500/30 bg-emerald-500/10'
              : 'border border-emerald-200 bg-white'
          }`}
        >
          <Mail className={`w-3.5 h-3.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
        </span>
        <span className={`min-w-0 flex-1 truncate text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Admission Desk
        </span>
        {isExpanded ? (
          <ChevronUp className={`h-4 w-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
        ) : (
          <ChevronDown className={`h-4 w-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
        )}
      </button>

      <div
        id="admission-desk-links"
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out ${
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className={`border-t px-2.5 pb-2.5 pt-2 ${isDark ? 'border-emerald-500/15' : 'border-emerald-200'}`}>
            <div className={`mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] ${isDark ? 'text-emerald-400/70' : 'text-emerald-700'}`}>
              Contact
            </div>
            <div className="grid grid-cols-2 gap-1.5">
        {rows.map((row) => (
          <a
            key={row.key}
            href={row.href}
            target={row.external ? '_blank' : undefined}
            rel={row.external ? 'noopener noreferrer' : undefined}
            title={row.key === 'email' ? email : row.label}
            className={`group flex min-w-0 items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[10px] transition-colors ${
              row.key === 'location' ? 'col-span-2' : ''
            } ${isDark
                ? 'border-emerald-500/10 bg-black/10 text-slate-300 hover:border-emerald-400/30 hover:bg-emerald-950/60 hover:text-emerald-300'
                : 'border-emerald-200/70 bg-white/50 text-slate-700 hover:border-emerald-300 hover:bg-white hover:text-emerald-800'
            }`}
          >
            <span className={`shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {row.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[9px] font-semibold uppercase tracking-wide ${isDark ? 'text-emerald-400/70' : 'text-emerald-700/80'}`}>
                {row.key === 'location' ? 'Campus Location' : row.key === 'phone' ? 'Call' : 'Email'}
              </span>
              <span className="block truncate leading-tight">{row.label}</span>
            </span>
            {row.external && (
              <ExternalLink
                className={`w-3 h-3 shrink-0 ${
                  isDark ? 'text-emerald-400/80' : 'text-emerald-600/80'
                }`}
              />
            )}
          </a>
        ))}
            </div>

            <div className={`mt-2 border-t pt-2 ${isDark ? 'border-emerald-500/15' : 'border-emerald-200'}`}>
              <div className={`mb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] ${isDark ? 'text-emerald-400/70' : 'text-emerald-700'}`}>
                Social
              </div>
              <div className="flex min-w-0 items-center gap-1">
          {socialLinks.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isDark
                  ? 'bg-white/5 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300'
                  : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              {s.icon}
            </a>
          ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
