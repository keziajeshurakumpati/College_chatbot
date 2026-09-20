import { useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { savePreferredName, sanitizePreferredName } from "./utils/preferredName";
import {
  Phone,
  UserRound,
  ArrowRight,
  Loader2,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [preferredName, setPreferredName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLightTheme, setIsLightTheme] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const updateTheme = () => setIsLightTheme(mediaQuery.matches);

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, []);

  useEffect(() => {
    return () => {
      const verifier = (window as any).recaptchaVerifier;
      if (verifier) {
        try {
          verifier.clear();
        } catch {
          // Ignore cleanup errors
        }
        (window as any).recaptchaVerifier = undefined;
      }
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const cleanName = sanitizePreferredName(preferredName);
      if (!cleanName) {
        setError("Enter a preferred name so we know how to address you.");
        return;
      }

      setGoogleLoading(true);
      setError("");
      const result = await signInWithPopup(auth, googleProvider);
      savePreferredName(result.user, cleanName);
      onLogin(result.user);
    } catch (err: any) {
      console.error(err);
      if (err?.code === "auth/popup-closed-by-user") {
        setError("Google login was cancelled.");
      } else {
        setError(err?.message || "Google login failed.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const sendOTP = async () => {
    try {
      setError("");

      const cleanName = sanitizePreferredName(preferredName);
      if (!cleanName) {
        setError("Enter a preferred name so we know how to address you.");
        return;
      }

      if (!/^[6-9]\d{9}$/.test(phone)) {
        setError("Enter a valid 10-digit Indian mobile number.");
        return;
      }

      setLoading(true);

      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal",
            callback: () => setError(""),
            "expired-callback": () =>
              setError("reCAPTCHA expired. Please verify again."),
          }
        );

        await (window as any).recaptchaVerifier.render();
      }

      const result = await signInWithPhoneNumber(
        auth,
        `+91${phone}`,
        (window as any).recaptchaVerifier
      );

      setConfirmationResult(result);
      setShowOtp(true);
    } catch (err: any) {
      console.error(err);

      if (err?.code === "auth/invalid-phone-number") {
        setError("Invalid phone number.");
      } else if (err?.code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait and try again.");
      } else if (err?.code === "auth/quota-exceeded") {
        setError("Firebase SMS daily limit has been reached.");
      } else {
        setError(err?.message || "Could not send OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setError("");

      if (!confirmationResult) {
        setError("Please request a new OTP.");
        return;
      }

      if (otp.length !== 6) {
        setError("Please enter the 6-digit OTP.");
        return;
      }

      setLoading(true);
      const result = await confirmationResult.confirm(otp);
      savePreferredName(result.user, preferredName);
      onLogin(result.user);
    } catch (err: any) {
      console.error(err);

      if (err?.code === "auth/invalid-verification-code") {
        setError("Incorrect OTP. Please try again.");
      } else if (err?.code === "auth/code-expired") {
        setError("OTP expired. Please request a new OTP.");
      } else {
        setError(err?.message || "OTP verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const theme = isLightTheme
    ? {
        page: "bg-[#f3faf7] text-slate-900",
        glow: "bg-emerald-300/20",
        card: "border-emerald-200/80 bg-white/90 shadow-[0_24px_70px_rgba(15,118,110,0.12)]",
        muted: "text-slate-500",
        label: "text-slate-700",
        field: "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15",
        icon: "text-emerald-700",
        subtle: "border-slate-200 bg-slate-50 text-slate-500",
      }
    : {
        page: "bg-[#03100b] text-white",
        glow: "bg-emerald-500/10",
        card: "border-emerald-500/20 bg-[#071a11]/90 shadow-[0_24px_70px_rgba(0,0,0,0.42)]",
        muted: "text-emerald-100/55",
        label: "text-emerald-50/80",
        field: "border-emerald-500/20 bg-black/20 text-white placeholder:text-emerald-100/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15",
        icon: "text-emerald-400",
        subtle: "border-emerald-500/15 bg-emerald-950/20 text-emerald-100/50",
      };

  return (
    <main className={`relative flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden overflow-y-auto px-3 py-5 sm:px-6 sm:py-10 ${theme.page}`}>
      <div className={`pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full blur-3xl ${theme.glow}`} />
      <div className={`pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full blur-3xl ${theme.glow} opacity-60`} />

      <section className={`relative w-full max-w-[460px] rounded-[28px] border p-5 backdrop-blur-xl sm:p-8 ${theme.card}`}>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-[#03100b] shadow-[0_10px_25px_rgba(16,185,129,0.2)]">
            <MessageCircle className="h-7 w-7" />
          </div>
          <p className={`mt-5 text-[11px] font-bold uppercase tracking-[0.2em] ${theme.icon}`}>
            Galgotias University
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            College Enquiry Assistant
          </h1>
          <p className={`mx-auto mt-2 max-w-xs text-sm leading-relaxed ${theme.muted}`}>
            Your smart guide to university information.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-400/25 bg-red-500/10 px-3.5 py-3 text-sm leading-relaxed text-red-300" role="alert">
            {error}
          </div>
        )}

        {!showOtp ? (
          <div className="mt-7 space-y-5">
            <div>
              <label htmlFor="preferred-name" className={`mb-2 block text-sm font-semibold ${theme.label}`}>
                Preferred name
              </label>
              <div className="relative">
                <UserRound className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${theme.icon}`} />
                <input
                  id="preferred-name"
                  type="text"
                  value={preferredName}
                  maxLength={40}
                  autoComplete="nickname"
                  onChange={(event) => setPreferredName(sanitizePreferredName(event.target.value))}
                  placeholder="How should we call you?"
                  className={`h-12 w-full rounded-xl border pl-10 pr-4 text-sm outline-none transition ${theme.field}`}
                  aria-describedby="preferred-name-help"
                />
              </div>
              <p id="preferred-name-help" className={`mt-1.5 text-[11px] ${theme.muted}`}>
                We'll use this name in your chat experience.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className={`flex h-11 w-full items-center justify-center gap-3 rounded-xl border text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${isLightTheme ? "border-slate-200 bg-white text-slate-800 hover:bg-slate-50" : "border-emerald-500/20 bg-white text-slate-900 hover:bg-slate-100"}`}
            >
              {googleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-base font-bold text-[#4285f4]">G</span>}
              Continue with Google
            </button>

            <div className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] ${theme.muted}`}>
              <span className="h-px flex-1 bg-current opacity-20" />
              <span>or continue with phone</span>
              <span className="h-px flex-1 bg-current opacity-20" />
            </div>

            <div>
              <label htmlFor="phone-number" className={`mb-2 block text-sm font-semibold ${theme.label}`}>
                Phone number
              </label>
              <div className="flex">
                <div className={`flex h-12 items-center rounded-l-xl border border-r-0 px-3 text-sm font-semibold ${theme.subtle}`}>
                  +91
                </div>
                <div className="relative min-w-0 flex-1">
                  <Phone className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${theme.icon}`} />
                  <input
                    id="phone-number"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    className={`h-12 w-full rounded-r-xl border pl-10 pr-3 text-sm outline-none transition ${theme.field}`}
                  />
                </div>
              </div>
            </div>

            <div id="recaptcha-container" className="flex min-h-0 justify-center overflow-hidden" />

            <button
              onClick={sendOTP}
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-bold text-[#03100b] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <div className="text-center">
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${isLightTheme ? "bg-emerald-100" : "bg-emerald-500/10"}`}>
                <ShieldCheck className={`h-6 w-6 ${theme.icon}`} />
              </div>
              <h2 className="mt-4 text-xl font-bold">Verify your number</h2>
              <p className={`mt-2 text-sm ${theme.muted}`}>Enter the 6-digit OTP sent to</p>
              <p className={`mt-1 text-sm font-semibold ${theme.icon}`}>+91 {phone}</p>
            </div>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className={`mt-6 h-14 w-full rounded-xl border text-center text-2xl tracking-[0.45em] outline-none transition ${theme.field}`}
            />

            <button
              onClick={verifyOTP}
              disabled={loading}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-bold text-[#03100b] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Verify & Continue <ArrowRight className="h-4 w-4" /></>}
            </button>

            <button
              onClick={() => {
                setShowOtp(false);
                setOtp("");
                setConfirmationResult(null);
                setError("");
              }}
              className={`mt-4 flex min-h-10 w-full items-center justify-center text-sm transition ${
                isLightTheme
                  ? "text-slate-500 hover:text-emerald-700"
                  : "text-emerald-100/55 hover:text-emerald-400"
              }`}
            >
              ← Change phone number
            </button>
          </div>
        )}

        <div className={`mt-7 border-t pt-4 text-center text-[11px] ${theme.muted}`}>
          Sign in to get a personalized enquiry experience.
        </div>
      </section>
    </main>
  );
}