"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Loader2, ChevronDown } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedText from "@/components/ui/AnimatedText";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const COUNTRY_CODES = [
  { code: "+1", iso: "us", name: "United States" },
  { code: "+44", iso: "gb", name: "United Kingdom" },
  { code: "+91", iso: "in", name: "India" },
  { code: "+61", iso: "au", name: "Australia" },
  { code: "+49", iso: "de", name: "Germany" },
  { code: "+33", iso: "fr", name: "France" },
  { code: "+81", iso: "jp", name: "Japan" },
  { code: "+55", iso: "br", name: "Brazil" },
  { code: "+1", iso: "ca", name: "Canada" },
  { code: "+86", iso: "cn", name: "China" },
  { code: "+39", iso: "it", name: "Italy" },
  { code: "+34", iso: "es", name: "Spain" },
  { code: "+52", iso: "mx", name: "Mexico" },
  { code: "+31", iso: "nl", name: "Netherlands" },
  { code: "+46", iso: "se", name: "Sweden" },
  { code: "+41", iso: "ch", name: "Switzerland" },
  { code: "+65", iso: "sg", name: "Singapore" },
  { code: "+971", iso: "ae", name: "UAE" },
  { code: "+27", iso: "za", name: "South Africa" },
  { code: "+7", iso: "ru", name: "Russia" },
  { code: "+82", iso: "kr", name: "South Korea" },
  { code: "+62", iso: "id", name: "Indonesia" },
  { code: "+90", iso: "tr", name: "Turkey" },
  { code: "+966", iso: "sa", name: "Saudi Arabia" },
  { code: "+234", iso: "ng", name: "Nigeria" },
  { code: "+54", iso: "ar", name: "Argentina" },
  { code: "+57", iso: "co", name: "Colombia" },
  { code: "+51", iso: "pe", name: "Peru" },
  { code: "+56", iso: "cl", name: "Chile" },
  { code: "+58", iso: "ve", name: "Venezuela" },
  { code: "+20", iso: "eg", name: "Egypt" },
  { code: "+98", iso: "ir", name: "Iran" },
  { code: "+92", iso: "pk", name: "Pakistan" },
  { code: "+880", iso: "bd", name: "Bangladesh" },
  { code: "+63", iso: "ph", name: "Philippines" },
  { code: "+66", iso: "th", name: "Thailand" },
  { code: "+84", iso: "vn", name: "Vietnam" },
  { code: "+60", iso: "my", name: "Malaysia" },
  { code: "+32", iso: "be", name: "Belgium" },
  { code: "+43", iso: "at", name: "Austria" },
  { code: "+45", iso: "dk", name: "Denmark" },
  { code: "+358", iso: "fi", name: "Finland" },
  { code: "+47", iso: "no", name: "Norway" },
  { code: "+48", iso: "pl", name: "Poland" },
  { code: "+351", iso: "pt", name: "Portugal" },
  { code: "+30", iso: "gr", name: "Greece" },
  { code: "+420", iso: "cz", name: "Czech Republic" },
  { code: "+36", iso: "hu", name: "Hungary" },
  { code: "+40", iso: "ro", name: "Romania" },
  { code: "+380", iso: "ua", name: "Ukraine" },
  { code: "+972", iso: "il", name: "Israel" },
  { code: "+64", iso: "nz", name: "New Zealand" },
];

export default function AuthSection() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCliFlow, setIsCliFlow] = useState(false);

  // OTP state
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [authToken, setAuthToken] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [shaking, setShaking] = useState(false);
  const [toast, setToast] = useState("");
  const [cliSessionCompleted, setCliSessionCompleted] = useState(false);
  const sessionCode = useRef<string | null>(null);
  const redirectAfterLogin = useRef<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Extract ?session=CODE and ?redirect=URL from URL ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('session');
    const redirectUrl = params.get('redirect');

    if (code) {
      sessionCode.current = code;
      setIsCliFlow(true);
      // Scroll to auth section smoothly
      setTimeout(() => {
        document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      // If already logged in, complete the CLI session immediately
      const existingToken = localStorage.getItem('sn_token');
      if (existingToken) {
        completeCliSession(code, existingToken);
      }
    }

    // Store redirect URL so handleSubmit can use it after login
    if (redirectUrl) {
      redirectAfterLogin.current = redirectUrl;
      // If already logged in, validate token first then hand it to the web app.
      // We MUST append ?token= because localStorage is per-origin:
      // the web app (localhost:5173) can't read localhost:3001's sn_token.
      const existingToken = localStorage.getItem('sn_token');
      if (existingToken) {
        // Validate token before forwarding — it might be expired
        fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${existingToken}` },
        })
          .then((res) => {
            if (res.ok) {
              const sep = redirectUrl.includes('?') ? '&' : '?';
              window.location.href = `${redirectUrl}${sep}token=${encodeURIComponent(existingToken)}`;
            } else {
              // Token expired/invalid — clear it so user can log in fresh
              localStorage.removeItem('sn_token');
              localStorage.removeItem('sn_user');
              window.dispatchEvent(new Event('sn_auth_change'));
              // Scroll to auth form
              setTimeout(() => {
                document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 300);
            }
          })
          .catch(() => {
            localStorage.removeItem('sn_token');
            localStorage.removeItem('sn_user');
            window.dispatchEvent(new Event('sn_auth_change'));
          });
        return;
      }
      // Not logged in — scroll to the auth form so they can sign in
      setTimeout(() => {
        document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  // ── CLI session completion helper — retries up to 3 times ──
  const completeCliSession = async (code: string, token: string) => {
    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const res = await fetch(`${API_URL}/api/auth/cli-session/${code}/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-cli-session-secret': process.env.NEXT_PUBLIC_CLI_SESSION_SECRET ?? '',
          },
          body: JSON.stringify({ token }),
        });
        if (res.ok) {
          setCliSessionCompleted(true);
          return; // success — done
        }
        // Non-OK response (409 = already completed is fine, treat as success)
        if (res.status === 409) {
          setCliSessionCompleted(true);
          return;
        }
        const errData = await res.json().catch(() => ({}));
        console.error(`CLI session complete attempt ${attempt}/${MAX_RETRIES} failed:`, res.status, errData);
      } catch (err) {
        console.error(`CLI session complete attempt ${attempt}/${MAX_RETRIES} network error:`, err);
      }
      // Wait before retrying (500ms, 1s, 2s)
      if (attempt < MAX_RETRIES) {
        await new Promise(r => setTimeout(r, 500 * Math.pow(2, attempt - 1)));
      }
    }
    // All retries exhausted — surface the error
    showToast('Could not complete CLI login. Please sign in manually below.');
  };

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isLogin) {
      if (!name.trim()) {
        setError("Name is required.");
        triggerShake();
        return;
      }
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
        setError("Valid email is required.");
        triggerShake();
        return;
      }
      if (!password.trim() || password.length < 6) {
        setError("Password must be at least 6 characters.");
        triggerShake();
        return;
      }
      if (phone && !/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) {
        setError("Please enter a valid phone number or leave it blank.");
        triggerShake();
        return;
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError("Email and password are required.");
        triggerShake();
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const fullPhone = phone ? `${countryCode}${phone.replace(/\D/g, '')}` : undefined;
      const body = isLogin 
        ? { email, password } 
        : { email, password, name, phone: fullPhone };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (isLogin) {
          const data = await res.json();
          // Persist token + user so Navbar can read them
          if (data.token) localStorage.setItem("sn_token", data.token);
          if (data.user) localStorage.setItem("sn_user", JSON.stringify(data.user));
          // Notify Navbar to re-render
          window.dispatchEvent(new Event("sn_auth_change"));
          // Complete CLI session if opened from terminal
          if (sessionCode.current && data.token) {
            await completeCliSession(sessionCode.current, data.token);
          } else if (redirectAfterLogin.current) {
            // Cross-origin token handoff: append token as query param so the
            // web app (different port = different localStorage scope) can pick it up.
            const sep = redirectAfterLogin.current.includes('?') ? '&' : '?';
            window.location.href = `${redirectAfterLogin.current}${sep}token=${encodeURIComponent(data.token)}`;
          } else {
            showToast(`Welcome back, ${data.user?.name ?? data.user?.email ?? "there"}! 👋`);
          }
        } else {
          const data = await res.json();
          // Store the JWT returned by register so we can use it for OTP verification
          if (data.token) setAuthToken(data.token);
          setSuccess(data.message ?? "Account created! Please check your email to verify.");
          setShowOtp(true);
        }
      } else {
        const data = (await res.json()) as { message?: string, error?: string };
        setError(data.message ?? data.error ?? "Invalid credentials. Please try again.");
        triggerShake();
      }
    } catch {
      setError("Unable to connect. Please check your network.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the full 6-digit OTP.");
      triggerShake();
      return;
    }
    
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ code: otpValue }),
      });
      
      if (res.ok) {
        const data = await res.json();
        // If OTP verify returns a token, use it for CLI session completion
        if (sessionCode.current && data.token) {
          if (data.token) localStorage.setItem("sn_token", data.token);
          if (data.user) localStorage.setItem("sn_user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("sn_auth_change"));
          await completeCliSession(sessionCode.current, data.token);
        } else {
          setSuccess("Email verified successfully! You can now log in.");
          setTimeout(() => {
            setShowOtp(false);
            setIsLogin(true);
            setOtp(["", "", "", "", "", ""]);
            setPassword("");
          }, 2000);
        }
      } else {
        const data = await res.json();
        setError(data.message ?? data.error ?? "Invalid OTP.");
        triggerShake();
      }
    } catch {
      setError("Unable to connect. Please check your network.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };
  
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value !== "" && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <>
      {/* ── Toast notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium"
            style={{
              background: "rgba(8,18,24,0.95)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(0,191,255,0.25)",
              color: "var(--text-primary)",
            }}
            role="status"
            aria-live="polite"
            id="auth-toast"
          >
            <span style={{ color: "var(--accent-cyan)" }}>✓</span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <section
        className="py-28 px-4 sm:px-6 lg:px-8"
        style={{ background: "var(--bg-base)" }}
        id="auth"
        aria-labelledby="auth-heading"
      >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <SectionLabel className="mb-4">GET STARTED</SectionLabel>
            <AnimatedText
              text="One account. Everything unlocked."
              tag="h2"
              id="auth-heading"
              className="font-bold mb-6 text-[color:var(--text-primary)]"
              style={{ fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1.2 }}
            />
            <p
              className="leading-relaxed"
              style={{
                color: "var(--text-secondary)",
                fontSize: "17px",
                lineHeight: 1.8,
                maxWidth: "440px",
              }}
            >
              Sign up once. Access from your terminal, browser, or phone. Your
              data is always in sync.
            </p>
          </div>

          {/* Right: login card */}
          <div
            ref={cardRef}
            className={shaking ? "shake" : ""}
          >
            <GlassCard hover={false} className="p-8">
              <h3
                className="text-xl font-semibold mb-8"
                style={{ color: "var(--text-primary)" }}
              >
                {showOtp ? "Verify your email" : isLogin ? "Sign in to StrataNodex" : "Create your account"}
              </h3>

            {/* ── CLI Session Banner ── */}
            {isCliFlow && !cliSessionCompleted && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm"
                style={{
                  background: "rgba(0,191,255,0.06)",
                  border: "1px solid rgba(0,191,255,0.2)",
                  color: "#00bfff",
                }}
              >
                <span style={{ fontSize: "18px" }}>⌨️</span>
                <span>Sign in below to authenticate your <strong>StrataNodex CLI</strong>.</span>
              </motion.div>
            )}

            {/* ── CLI Session Completed UI ── */}
              {cliSessionCompleted ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-4"
                  id="cli-session-complete"
                >
                  <div className="text-5xl mb-4" style={{ color: "#00bfff" }}>✓</div>
                  <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                    You&apos;re logged in
                  </h2>
                  <p className="text-sm mb-4" style={{ color: "#8b949e" }}>
                    Return to your terminal — StrataNodex CLI is ready.
                  </p>
                  <p className="text-xs" style={{ color: "#00c896" }}>
                    You can close this tab.
                  </p>
                </motion.div>
              ) : showOtp ? (
                <form onSubmit={handleOtpSubmit} noValidate>
                  <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                    We sent a 6-digit code to <strong style={{ color: "var(--text-primary)" }}>{email}</strong>.
                  </p>
                  <div className="flex gap-2 justify-between mb-8">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-14 text-center text-lg rounded-lg outline-none transition-all duration-200 font-medium"
                        style={{
                          background: "rgba(0,191,255,0.03)",
                          border: "1px solid rgba(0,191,255,0.12)",
                          color: "var(--text-primary)",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(0,191,255,0.35)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(0,191,255,0.12)")}
                        maxLength={1}
                      />
                    ))}
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm mb-4" style={{ color: "#ff4466" }} role="alert">
                      {error}
                    </motion.p>
                  )}
                  {success && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm mb-4" style={{ color: "var(--accent-teal)" }} role="status">
                      {success}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300"
                    style={{
                      background: "rgba(0,51,68,0.8)",
                      border: "1px solid rgba(0,191,255,0.4)",
                      color: "#00bfff",
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    Verify Email →
                  </button>
                  <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
                    <button type="button" onClick={() => setShowOtp(false)} className="transition-colors duration-200 font-medium" style={{ color: "var(--text-secondary)" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text-primary)")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}>
                      ← Back to sign up
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                {/* Name - only for Sign Up */}
                {!isLogin && (
                  <>
                    <div className="mb-4">
                      <label
                        htmlFor="auth-name"
                        className="block text-xs mb-2"
                        style={{ color: "var(--text-secondary)", letterSpacing: "0.04em" }}
                      >
                        Full Name
                      </label>
                      <input
                        id="auth-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                        style={{
                          background: "rgba(0,191,255,0.03)",
                          border: "1px solid rgba(0,191,255,0.12)",
                          color: "var(--text-primary)",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "rgba(0,191,255,0.35)")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = "rgba(0,191,255,0.12)")
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="auth-phone"
                        className="block text-xs mb-2"
                        style={{ color: "var(--text-secondary)", letterSpacing: "0.04em" }}
                      >
                        Phone Number
                      </label>
                      <div className="flex gap-2 relative">
                        {/* Custom Country Code Dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                            className="flex items-center gap-2 h-[46px] px-3 rounded-lg text-sm outline-none transition-all duration-200 cursor-pointer"
                            style={{
                              background: "rgba(0,191,255,0.03)",
                              border: countryDropdownOpen ? "1px solid rgba(0,191,255,0.35)" : "1px solid rgba(0,191,255,0.12)",
                              color: "var(--text-primary)",
                              minWidth: "90px",
                            }}
                          >
                            <Image
                              src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`}
                              alt={selectedCountry.name}
                              width={20}
                              height={15}
                              className="w-[18px] h-auto rounded-sm object-cover"
                            />
                            <span>{selectedCountry.code}</span>
                            <ChevronDown size={14} className="ml-auto opacity-50" />
                          </button>

                          <AnimatePresence>
                            {countryDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-[calc(100%+8px)] left-0 w-[260px] max-h-[280px] overflow-y-auto rounded-xl z-50 p-2 shadow-2xl"
                                style={{
                                  background: "rgba(10,15,20,0.98)",
                                  backdropFilter: "blur(20px)",
                                  border: "1px solid rgba(0,191,255,0.15)",
                                }}
                              >
                                {COUNTRY_CODES.map((c) => (
                                  <button
                                    key={`${c.iso}-${c.code}`}
                                    type="button"
                                    onClick={() => {
                                      setCountryCode(c.code);
                                      setCountryDropdownOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 hover:bg-[rgba(0,191,255,0.1)]"
                                    style={{ color: "var(--text-primary)" }}
                                  >
                                    <Image
                                      src={`https://flagcdn.com/w20/${c.iso}.png`}
                                      alt={c.name}
                                      width={20}
                                      height={15}
                                      className="w-[18px] h-auto rounded-sm object-cover"
                                    />
                                    <span className="font-medium text-left flex-1 truncate">{c.name}</span>
                                    <span style={{ color: "var(--text-muted)" }}>{c.code}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Phone Number Input */}
                        <input
                          id="auth-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                          style={{
                            background: "rgba(0,191,255,0.03)",
                            border: "1px solid rgba(0,191,255,0.12)",
                            color: "var(--text-primary)",
                          }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "rgba(0,191,255,0.35)")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "rgba(0,191,255,0.12)")
                          }
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Email */}
                <div className="mb-4">
                  <label
                    htmlFor="auth-email"
                    className="block text-xs mb-2"
                    style={{ color: "var(--text-secondary)", letterSpacing: "0.04em" }}
                  >
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(0,191,255,0.03)",
                      border: "1px solid rgba(0,191,255,0.12)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(0,191,255,0.35)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(0,191,255,0.12)")
                    }
                  />
                </div>

                {/* Password */}
                <div className="mb-6">
                  <label
                    htmlFor="auth-password"
                    className="block text-xs mb-2"
                    style={{ color: "var(--text-secondary)", letterSpacing: "0.04em" }}
                  >
                    Password
                  </label>
                  <input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(0,191,255,0.03)",
                      border: "1px solid rgba(0,191,255,0.12)",
                      color: "var(--text-primary)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(0,191,255,0.35)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(0,191,255,0.12)")
                    }
                  />
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm mb-4"
                    style={{ color: "#ff4466" }}
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Success */}
                {success && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm mb-4"
                    style={{ color: "var(--accent-teal)" }}
                    role="status"
                  >
                    {success}
                  </motion.p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300"
                  style={{
                    background: "rgba(0,51,68,0.8)",
                    border: "1px solid rgba(0,191,255,0.4)",
                    color: "#00bfff",
                    opacity: loading ? 0.7 : 1,
                  }}
                  id="auth-submit-btn"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {isLogin ? "Continue →" : "Create Account →"}
                </button>

                {/* Sign up / Login link */}
                <p
                  className="text-center text-sm mt-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError("");
                      setSuccess("");
                    }}
                    className="transition-colors duration-200 font-medium"
                    style={{ color: "var(--accent-cyan)" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color =
                        "var(--text-primary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color =
                        "var(--accent-cyan)")
                    }
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </form>
              )}
            </GlassCard>

            {/* CLI login note */}
            <p
              className="text-center text-xs mt-4"
              style={{ color: "var(--text-muted)" }}
            >
              Using the CLI? Run{" "}
              <code
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  color: "var(--accent-teal)",
                }}
              >
                stratanodex login
              </code>{" "}
              — it&apos;ll open this page automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
