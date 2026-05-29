"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Check, Copy } from "lucide-react";
import TerminalMock, { TerminalLine } from "@/components/ui/TerminalMock";
import GlowButton from "@/components/ui/GlowButton";

const INSTALL_CMD = "npm install -g stratanodex";

const heroTerminalLines: TerminalLine[] = [
  { text: "  StrataNodex        v0.1.0  ● connected", color: "dim" },
  { text: "  ──────────────────────────────────────", color: "dim" },
  { text: "" },
  { text: "  📁 Work              3 lists", color: "white" },
  { text: "  📁 Personal          2 lists", color: "white" },
  { text: "  📁 College           1 list", color: "white" },
  { text: "" },
  { text: "  ──────────────────────────────────────", color: "dim" },
  { text: "  > /open folder: Work", color: "cyan", delay: 3200 },
  { text: "" },
  { text: "  Work / Sprint 4", color: "dim", delay: 3600 },
  { text: "  1  Ship v1              [TODO] [HIGH]", color: "white", delay: 3900 },
  { text: "    └─ 1.1  Write tests        [TODO]", color: "dim", delay: 4100 },
  { text: "    └─ 1.2  Deploy backend     [IN PROGRESS]", color: "teal", delay: 4300 },
  { text: "  2  Fix auth bug              [DONE]", color: "green", delay: 4500 },
  { text: "  3  Setup CI                  [TODO]", color: "white", delay: 4700 },
];

const words = ["Productivity", "that", "lives", "where", "you", "work"];

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Scroll tracking for chevron fade
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-base)" }}
      id="hero"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 191, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 191, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,191,255,0.03) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <span
            style={{
              fontSize: "11px",
              letterSpacing: "0.3em",
              color: "var(--accent-teal)",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            CLI · WEB · MOBILE · ONE ECOSYSTEM
          </span>
        </motion.div>

        {/* H1 — word-by-word stagger using Framer Motion */}
        <h1
          className="font-bold mb-6 leading-tight"
          style={{ fontSize: "clamp(48px, 8vw, 96px)" }}
          aria-label="Productivity that lives where you work"
        >
          {words.map((word, i) => (
            <motion.span
              key={word + i}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.6 + i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block mr-[0.25em] text-gradient-hero"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mx-auto mb-10"
          style={{
            fontSize: "18px",
            color: "var(--text-secondary)",
            maxWidth: "560px",
            lineHeight: 1.7,
          }}
        >
          Open-source task management across CLI, web, and mobile.
          <br />
          Infinite nesting. One ecosystem. Built for developers.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          {/* Install command */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300"
            style={{
              background: "rgba(0,191,255,0.06)",
              border: "1px solid rgba(0,191,255,0.25)",
              fontFamily: "var(--font-geist-mono)",
              fontSize: "14px",
              color: "var(--accent-cyan)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(0,191,255,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(0,191,255,0.25)";
            }}
            id="hero-copy-btn"
            aria-label="Copy install command to clipboard"
          >
            <span>$ {INSTALL_CMD}</span>
            <span style={{ color: "var(--text-muted)" }}>
              {copied ? (
                <Check size={14} style={{ color: "var(--accent-teal)" }} />
              ) : (
                <Copy size={14} />
              )}
            </span>
            {copied && (
              <span
                className="text-xs"
                style={{ color: "var(--accent-teal)" }}
              >
                Copied!
              </span>
            )}
          </button>

          <GlowButton variant="ghost" href="#webapp">
            View Web App →
          </GlowButton>
        </motion.div>

        {/* Terminal mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="w-full max-w-2xl mx-auto"
        >
          <TerminalMock
            title="stratanodex"
            lines={heroTerminalLines}
            animate={true}
            loop={true}
          />
        </motion.div>
      </div>

      {/* Scroll chevron */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollY > 100 ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      >
        <ChevronDown
          className="bounce-y"
          size={24}
          style={{ color: "var(--text-muted)" }}
        />
      </motion.div>
    </section>
  );
}
