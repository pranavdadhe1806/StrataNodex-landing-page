"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ChevronDown, Eye, EyeOff } from "lucide-react";

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
  { code: "+92", iso: "pk", name: "Pakistan" },
  { code: "+880", iso: "bd", name: "Bangladesh" },
  { code: "+63", iso: "ph", name: "Philippines" },
  { code: "+66", iso: "th", name: "Thailand" },
  { code: "+84", iso: "vn", name: "Vietnam" },
  { code: "+60", iso: "my", name: "Malaysia" },
  { code: "+64", iso: "nz", name: "New Zealand" },
];

// ── Password strength helpers ──
function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "#ff4466" };
  if (score <= 2) return { score, label: "Fair", color: "#ffbd2e" };
  if (score <= 3) return { score, label: "Good", color: "#00bfff" };
  return { score, label: "Strong", color: "#00c896" };
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState(""); // email or username for login
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  // ── 2FA step ──
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [twoFactorUserId, setTwoFactorUserId] = useState("");

  // ── Forgot / reset password ──
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [showResetPwVisible, setShowResetPwVisible] = useState(false);

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  // ── Extract ?session=CODE and ?redirect=URL from URL ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("session");
    const redirectUrl = params.get("redirect");

    if (code) {
      sessionCode.current = code;
      setIsCliFlow(true);
      const existingToken = localStorage.getItem("sn_token");
      if (existingToken) {
        completeCliSession(code, existingToken);
      }
    }

    if (redirectUrl) {
      redirectAfterLogin.current = redirectUrl;
      const existingToken = localStorage.getItem("sn_token");
      if (existingToken) {
        const sep = redirectUrl.includes("?") ? "&" : "?";
        window.location.href = `${redirectUrl}${sep}token=${encodeURIComponent(existingToken)}`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const completeCliSession = async (code: string, token: string) => {
    try {
      await fetch(`${API_URL}/api/auth/cli-session/${code}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cli-session-secret": process.env.NEXT_PUBLIC_CLI_SESSION_SECRET ?? "",
        },
        body: JSON.stringify({ token }),
      });
      setCliSessionCompleted(true);
    } catch (err) {
      console.error("CLI session complete failed:", err);
    }
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
      if (!name.trim()) { setError("Name is required."); triggerShake(); return; }
      if (!username.trim() || username.length < 3) { setError("Username must be at least 3 characters."); triggerShake(); return; }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError("Username can only contain letters, numbers, and underscores."); triggerShake(); return; }
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) { setError("Valid email is required."); triggerShake(); return; }
      if (!password.trim() || password.length < 6) { setError("Password must be at least 6 characters."); triggerShake(); return; }
      if (phone && !/^\d{7,15}$/.test(phone.replace(/\D/g, ""))) { setError("Please enter a valid phone number or leave it blank."); triggerShake(); return; }
    } else {
      if (!identifier.trim() || !password.trim()) { setError("Email/username and password are required."); triggerShake(); return; }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const fullPhone = phone ? `${countryCode}${phone.replace(/\D/g, "")}` : undefined;

      const body = isLogin
        ? { email: identifier, password }
        : { email, password, name, username, phone: fullPhone };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        if (isLogin) {
          const data = await res.json();
          // ── 2FA required ──
          if (data.requiresTwoFactor) {
            setTwoFactorUserId(data.userId);
            setShowTwoFactor(true);
            setLoading(false);
            return;
          }
          if (data.token) localStorage.setItem("sn_token", data.token);
          if (data.user) localStorage.setItem("sn_user", JSON.stringify(data.user));
          window.dispatchEvent(new Event("sn_auth_change"));
          if (sessionCode.current && data.token) {
            await completeCliSession(sessionCode.current, data.token);
          } else if (redirectAfterLogin.current) {
            const sep = redirectAfterLogin.current.includes("?") ? "&" : "?";
            window.location.href = `${redirectAfterLogin.current}${sep}token=${encodeURIComponent(data.token)}`;
          } else {
            showToast(`Welcome back, ${data.user?.name ?? data.user?.email ?? "there"}!`);
            setTimeout(() => { window.location.href = "/"; }, 1500);
          }
        } else {
          const data = await res.json();
          if (data.token) setAuthToken(data.token);
          setSuccess(data.message ?? "Account created! Please check your email to verify.");
          setShowOtp(true);
        }
      } else {
        const data = (await res.json()) as { message?: string; error?: string };
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
    if (otpValue.length !== 6) { setError("Please enter the full 6-digit OTP."); triggerShake(); return; }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ code: otpValue }),
      });
      if (res.ok) {
        const data = await res.json();
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
    if (value !== "" && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) otpRefs.current[index - 1]?.focus();
  };

  // ── 2FA verify ──
  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter the full 6-digit code."); triggerShake(); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: twoFactorUserId, code }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("sn_token", data.token);
        if (data.user) localStorage.setItem("sn_user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("sn_auth_change"));
        if (sessionCode.current) {
          await completeCliSession(sessionCode.current, data.token);
        } else if (redirectAfterLogin.current) {
          const sep = redirectAfterLogin.current.includes("?") ? "&" : "?";
          window.location.href = `${redirectAfterLogin.current}${sep}token=${encodeURIComponent(data.token)}`;
        } else {
          showToast(`Welcome back, ${data.user?.name ?? data.user?.email ?? "there"}!`);
          setTimeout(() => { window.location.href = "/"; }, 1500);
        }
      } else {
        const data = await res.json();
        setError(data.message ?? data.error ?? "Invalid code. Please try again.");
        triggerShake();
      }
    } catch {
      setError("Unable to connect. Please check your network.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password — send OTP ──
  const handleForgotPasswordSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/^\S+@\S+\.\S+$/.test(forgotEmail)) { setError("Please enter a valid email."); triggerShake(); return; }
    setError(""); setSuccess(""); setLoading(true);
    try {
      await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setOtp(["", "", "", "", "", ""]);
      setShowForgotPassword(false);
      setShowResetPassword(true);
      setSuccess("If this email exists, a reset code has been sent.");
    } catch {
      setError("Unable to connect. Please check your network.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // ── Reset password — verify OTP + set new password ──
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setError("Please enter the full 6-digit code."); triggerShake(); return; }
    if (!resetNewPassword || resetNewPassword.length < 6) { setError("Password must be at least 6 characters."); triggerShake(); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code, newPassword: resetNewPassword }),
      });
      if (res.ok) {
        setSuccess("Password reset successfully! You can now sign in.");
        setTimeout(() => {
          setShowResetPassword(false);
          setIsLogin(true);
          setOtp(["", "", "", "", "", ""]);
          setResetNewPassword("");
          setForgotEmail("");
          setSuccess("");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message ?? data.error ?? "Failed to reset password.");
        triggerShake();
      }
    } catch {
      setError("Unable to connect. Please check your network.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  // ── Input style helper ──
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#EDEFF3",
  };
  const inputFocusBorder = "rgba(0,191,255,0.4)";
  const inputBlurBorder = "rgba(255,255,255,0.08)";

  return (
    <>
      {/* Toast */}
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
              background: "rgba(27,29,33,0.95)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(0,191,255,0.25)",
              color: "#EDEFF3",
            }}
            role="status"
            aria-live="polite"
          >
            <span style={{ color: "#00bfff" }}>&#10003;</span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "#1B1D21" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-[0.05em] mb-10"
          style={{ fontFamily: "var(--font-geist-mono)", color: "#00bfff" }}
        >
          StrataNodex
        </Link>

        {/* Auth card */}
        <div
          className={`w-full max-w-md ${shaking ? "shake" : ""}`}
        >
          <div
            className="rounded-2xl p-8"
            style={{
              background: "#32363C",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <h1
              className="text-xl font-semibold mb-8"
              style={{ color: "#EDEFF3" }}
            >
              {showTwoFactor
                ? "Two-factor authentication"
                : showForgotPassword
                  ? "Forgot password"
                  : showResetPassword
                    ? "Reset your password"
                    : showOtp
                      ? "Verify your email"
                      : isLogin
                        ? "Sign in to StrataNodex"
                        : "Create your account"}
            </h1>

            {/* CLI Session Banner */}
            {isCliFlow && !cliSessionCompleted && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm"
                style={{
                  background: "rgba(0,191,255,0.06)",
                  border: "1px solid rgba(0,191,255,0.2)",
                  color: "#00bfff",
                }}
              >
                <span style={{ fontSize: "18px" }}>&#9000;</span>
                <span>Sign in below to authenticate your <strong>StrataNodex CLI</strong>.</span>
              </motion.div>
            )}

            {/* CLI Session Completed */}
            {cliSessionCompleted ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <div className="text-5xl mb-4" style={{ color: "#00bfff" }}>&#10003;</div>
                <h2 className="text-xl font-semibold mb-3" style={{ color: "#EDEFF3" }}>
                  You&apos;re logged in
                </h2>
                <p className="text-sm mb-4" style={{ color: "#8A8F98" }}>
                  Return to your terminal — StrataNodex CLI is ready.
                </p>
                <p className="text-xs" style={{ color: "#00c896" }}>
                  You can close this tab.
                </p>
              </motion.div>
            ) : showTwoFactor ? (
              /* ── 2FA OTP Form ── */
              <form onSubmit={handleTwoFactorSubmit} noValidate>
                <p className="text-sm mb-6" style={{ color: "#D5D8DE" }}>
                  A 6-digit code was sent to your registered email address.
                </p>
                <div className="flex gap-2 justify-between mb-8">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-lg rounded-lg outline-none transition-all duration-200 font-medium"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                      onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                      maxLength={1}
                    />
                  ))}
                </div>
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm mb-4" style={{ color: "#ff4466" }} role="alert">{error}</motion.p>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300" style={{ background: "rgba(0,191,255,0.1)", border: "1px solid rgba(0,191,255,0.35)", color: "#00bfff", opacity: loading ? 0.7 : 1 }}>
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Verify Code
                </button>
                <p className="text-center text-sm mt-6" style={{ color: "#8A8F98" }}>
                  <button type="button" onClick={() => { setShowTwoFactor(false); setOtp(["", "", "", "", "", ""]); setError(""); }} className="transition-colors duration-200 font-medium hover:text-[#EDEFF3]" style={{ color: "#D5D8DE" }}>
                    &larr; Back to sign in
                  </button>
                </p>
              </form>
            ) : showForgotPassword ? (
              /* ── Forgot Password Form ── */
              <form onSubmit={handleForgotPasswordSend} noValidate>
                <p className="text-sm mb-6" style={{ color: "#D5D8DE" }}>
                  Enter your account email. We&apos;ll send a reset code.
                </p>
                <div className="mb-6">
                  <label className="block text-xs mb-2" style={{ color: "#D5D8DE", letterSpacing: "0.04em" }}>Email</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                    onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                    autoFocus
                  />
                </div>
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm mb-4" style={{ color: "#ff4466" }} role="alert">{error}</motion.p>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300" style={{ background: "rgba(0,191,255,0.1)", border: "1px solid rgba(0,191,255,0.35)", color: "#00bfff", opacity: loading ? 0.7 : 1 }}>
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Send Reset Code
                </button>
                <p className="text-center text-sm mt-6" style={{ color: "#8A8F98" }}>
                  <button type="button" onClick={() => { setShowForgotPassword(false); setError(""); }} className="transition-colors duration-200 font-medium hover:text-[#EDEFF3]" style={{ color: "#D5D8DE" }}>
                    &larr; Back to sign in
                  </button>
                </p>
              </form>
            ) : showResetPassword ? (
              /* ── Reset Password Form ── */
              <form onSubmit={handleResetPasswordSubmit} noValidate>
                <p className="text-sm mb-2" style={{ color: "#D5D8DE" }}>
                  Enter the 6-digit code sent to <strong style={{ color: "#EDEFF3" }}>{forgotEmail}</strong>.
                </p>
                {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm mb-4" style={{ color: "#00c896" }} role="status">{success}</motion.p>}
                <div className="flex gap-2 justify-between mb-6 mt-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-lg rounded-lg outline-none transition-all duration-200 font-medium"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                      onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                      maxLength={1}
                    />
                  ))}
                </div>
                <div className="mb-6 relative">
                  <label className="block text-xs mb-2" style={{ color: "#D5D8DE", letterSpacing: "0.04em" }}>New Password</label>
                  <input
                    type={showResetPwVisible ? "text" : "password"}
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 pr-12 rounded-lg text-sm outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                    onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                  />
                  <button type="button" onClick={() => setShowResetPwVisible(!showResetPwVisible)} className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-200 transition-colors" tabIndex={-1}>
                    {showResetPwVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm mb-4" style={{ color: "#ff4466" }} role="alert">{error}</motion.p>}
                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300" style={{ background: "rgba(0,191,255,0.1)", border: "1px solid rgba(0,191,255,0.35)", color: "#00bfff", opacity: loading ? 0.7 : 1 }}>
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Reset Password
                </button>
                <p className="text-center text-sm mt-6" style={{ color: "#8A8F98" }}>
                  <button type="button" onClick={() => { setShowResetPassword(false); setShowForgotPassword(true); setOtp(["", "", "", "", "", ""]); setError(""); }} className="transition-colors duration-200 font-medium hover:text-[#EDEFF3]" style={{ color: "#D5D8DE" }}>
                    &larr; Back
                  </button>
                </p>
              </form>
            ) : showOtp ? (
              /* ── OTP Form ── */
              <form onSubmit={handleOtpSubmit} noValidate>
                <p className="text-sm mb-6" style={{ color: "#D5D8DE" }}>
                  We sent a 6-digit code to <strong style={{ color: "#EDEFF3" }}>{email}</strong>.
                </p>
                <div className="flex gap-2 justify-between mb-8">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 text-center text-lg rounded-lg outline-none transition-all duration-200 font-medium"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                      onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                      maxLength={1}
                    />
                  ))}
                </div>

                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm mb-4" style={{ color: "#ff4466" }} role="alert">{error}</motion.p>}
                {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm mb-4" style={{ color: "#00c896" }} role="status">{success}</motion.p>}

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300" style={{ background: "rgba(0,191,255,0.1)", border: "1px solid rgba(0,191,255,0.35)", color: "#00bfff", opacity: loading ? 0.7 : 1 }}>
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Verify Email
                </button>
                <p className="text-center text-sm mt-6" style={{ color: "#8A8F98" }}>
                  <button type="button" onClick={() => setShowOtp(false)} className="transition-colors duration-200 font-medium hover:text-[#EDEFF3]" style={{ color: "#D5D8DE" }}>
                    &larr; Back to sign up
                  </button>
                </p>
              </form>
            ) : (
              /* ── Main Auth Form ── */
              <form onSubmit={handleSubmit} noValidate>
                {/* ── Social sign-in ── */}
                <div className="flex flex-col gap-3 mb-6">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[rgba(255,255,255,0.06)]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#EDEFF3" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-[rgba(255,255,255,0.06)]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#EDEFF3" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#EDEFF3">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    Continue with GitHub
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <span className="text-xs" style={{ color: "#8A8F98" }}>or</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                </div>

                {/* Register-only fields */}
                {!isLogin && (
                  <>
                    {/* Full Name */}
                    <div className="mb-4">
                      <label htmlFor="auth-name" className="block text-xs mb-2" style={{ color: "#D5D8DE", letterSpacing: "0.04em" }}>
                        Full Name
                      </label>
                      <input
                        id="auth-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                        onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                      />
                    </div>

                    {/* Username */}
                    <div className="mb-4">
                      <label htmlFor="auth-username" className="block text-xs mb-2" style={{ color: "#D5D8DE", letterSpacing: "0.04em" }}>
                        Username
                      </label>
                      <input
                        id="auth-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        placeholder="your_username"
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                        onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                      <label htmlFor="auth-email" className="block text-xs mb-2" style={{ color: "#D5D8DE", letterSpacing: "0.04em" }}>
                        Email
                      </label>
                      <input
                        id="auth-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                        style={inputStyle}
                        onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                        onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                      />
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                      <label htmlFor="auth-phone" className="block text-xs mb-2" style={{ color: "#D5D8DE", letterSpacing: "0.04em" }}>
                        Phone Number <span style={{ color: "#8A8F98" }}>(optional)</span>
                      </label>
                      <div className="flex gap-2 relative">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                            className="flex items-center gap-2 h-[46px] px-3 rounded-lg text-sm outline-none transition-all duration-200 cursor-pointer"
                            style={{
                              ...inputStyle,
                              borderColor: countryDropdownOpen ? inputFocusBorder : inputBlurBorder,
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
                                  background: "rgba(50,54,60,0.98)",
                                  backdropFilter: "blur(20px)",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                }}
                              >
                                {COUNTRY_CODES.map((c) => (
                                  <button
                                    key={`${c.iso}-${c.code}`}
                                    type="button"
                                    onClick={() => { setCountryCode(c.code); setCountryDropdownOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 hover:bg-[rgba(255,255,255,0.06)]"
                                    style={{ color: "#EDEFF3" }}
                                  >
                                    <Image
                                      src={`https://flagcdn.com/w20/${c.iso}.png`}
                                      alt={c.name}
                                      width={20}
                                      height={15}
                                      className="w-[18px] h-auto rounded-sm object-cover"
                                    />
                                    <span className="font-medium text-left flex-1 truncate">{c.name}</span>
                                    <span style={{ color: "#8A8F98" }}>{c.code}</span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <input
                          id="auth-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                          style={inputStyle}
                          onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                          onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Login: Email or Username */}
                {isLogin && (
                  <div className="mb-4">
                    <label htmlFor="auth-identifier" className="block text-xs mb-2" style={{ color: "#D5D8DE", letterSpacing: "0.04em" }}>
                      Email or Username
                    </label>
                    <input
                      id="auth-identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                      onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                    />
                  </div>
                )}

                {/* Password */}
                <div className="mb-2">
                  <label htmlFor="auth-password" className="block text-xs mb-2" style={{ color: "#D5D8DE", letterSpacing: "0.04em" }}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none transition-all duration-200"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = inputFocusBorder)}
                      onBlur={(e) => (e.target.style.borderColor = inputBlurBorder)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                      style={{ color: "#8A8F98" }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Password strength indicator (register only) */}
                {!isLogin && password.length > 0 && (
                  <div className="mb-6">
                    <div className="flex gap-1 mb-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background: level <= passwordStrength.score ? passwordStrength.color : "rgba(255,255,255,0.08)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </p>
                  </div>
                )}

                {/* Forgot password link */}
                {isLogin && (
                  <div className="flex justify-end mb-4">
                    <button
                      type="button"
                      onClick={() => { setShowForgotPassword(true); setError(""); setSuccess(""); }}
                      className="text-xs transition-colors duration-200 hover:text-[#EDEFF3]"
                      style={{ color: "#8A8F98" }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm mb-4" style={{ color: "#ff4466" }} role="alert">
                    {error}
                  </motion.p>
                )}

                {/* Success */}
                {success && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm mb-4" style={{ color: "#00c896" }} role="status">
                    {success}
                  </motion.p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300"
                  style={{
                    background: "rgba(0,191,255,0.1)",
                    border: "1px solid rgba(0,191,255,0.35)",
                    color: "#00bfff",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {isLogin ? "Continue" : "Create Account"}
                </button>

                {/* Toggle */}
                <p className="text-center text-sm mt-6" style={{ color: "#8A8F98" }}>
                  {isLogin ? "Don\u2019t have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}
                    className="transition-colors duration-200 font-medium hover:text-[#EDEFF3]"
                    style={{ color: "#00bfff" }}
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </form>
            )}
          </div>

          {/* CLI login note */}
          <p className="text-center text-xs mt-5" style={{ color: "#8A8F98" }}>
            Using the CLI? Run{" "}
            <code style={{ fontFamily: "var(--font-geist-mono)", color: "#00c896" }}>
              stratanodex login
            </code>{" "}
            &mdash; it&apos;ll open this page automatically.
          </p>
        </div>
      </div>
    </>
  );
}
