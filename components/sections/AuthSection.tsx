"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedText from "@/components/ui/AnimatedText";
import GlowButton from "@/components/ui/GlowButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:5173";

export default function AuthSection() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        window.location.href = APP_URL;
      } else {
        const data = (await res.json()) as { message?: string };
        setError(data.message ?? "Invalid credentials. Please try again.");
        triggerShake();
      }
    } catch {
      setError("Unable to connect. Please check your network.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_URL}/api/auth/github`;
  };

  return (
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
                Sign in to StrataNodex
              </h3>

              <form onSubmit={handleSubmit} noValidate>
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
                    placeholder="you@example.com"
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
                    placeholder="••••••••"
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
                  Continue →
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(0,191,255,0.08)" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    OR
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(0,191,255,0.08)" }}
                  />
                </div>

                {/* OAuth buttons */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      background: "rgba(52,168,83,0.06)",
                      border: "1px solid rgba(52,168,83,0.25)",
                      color: "#34A853",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(52,168,83,0.5)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(52,168,83,0.25)")
                    }
                    id="auth-google-btn"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill="#34A853"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#4285F4"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    onClick={handleGithubLogin}
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "#e0f8ff",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.25)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.12)")
                    }
                    id="auth-github-btn"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    Continue with GitHub
                  </button>
                </div>

                {/* Sign up link */}
                <p
                  className="text-center text-sm mt-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  Don&apos;t have an account?{" "}
                  <a
                    href="#"
                    className="transition-colors duration-200"
                    style={{ color: "var(--accent-cyan)" }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color =
                        "var(--text-primary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color =
                        "var(--accent-cyan)")
                    }
                    id="auth-signup-link"
                  >
                    Sign up
                  </a>
                </p>
              </form>
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
  );
}
