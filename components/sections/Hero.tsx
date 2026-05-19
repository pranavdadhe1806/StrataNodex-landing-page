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
  { text: "  📁 Work", color: "white" },
  { text: "  📁 Personal", color: "white" },
  { text: "  📁 College", color: "white" },
  { text: "" },
  { text: "  ──────────────────────────────────────", color: "dim" },
  { text: "  > /list -d 2", color: "cyan", delay: 3200 },
  { text: "" },
  { text: "  📁 Work", color: "white", delay: 3800 },
  { text: "    📋 Sprint 4", color: "dim", delay: 4000 },
  { text: "      1  Ship v1           [TODO] [HIGH]", color: "white", delay: 4200 },
  { text: "        └─ 1.1  Write tests     [TODO]", color: "dim", delay: 4400 },
  { text: "        └─ 1.2  Deploy backend  [IN PROGRESS]", color: "teal", delay: 4600 },
  { text: "      2  Fix auth bug       [DONE]", color: "green", delay: 4800 },
];

const words = ["Productivity", "that", "lives", "where", "you", "work"];

export default function Hero() {
  const [copied, setCopied] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll tracking for chevron fade
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dot grid canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let animFrame: number;
    let tick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 40;
      const cols = Math.ceil(canvas.width / spacing);
      const rows = Math.ceil(canvas.height / spacing);

      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          const dist = Math.sqrt(
            Math.pow(x - canvas.width / 2, 2) +
              Math.pow(y - canvas.height / 2, 2)
          );
          const pulse =
            0.3 +
            0.7 * Math.abs(Math.sin(tick * 0.005 - dist * 0.003));
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,191,255,${0.04 + pulse * 0.06})`;
          ctx.fill();
        }
      }
      tick++;
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
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
      {/* Dot grid background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
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
