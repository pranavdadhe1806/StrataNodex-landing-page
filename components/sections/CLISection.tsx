"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TerminalMock, { TerminalLine } from "@/components/ui/TerminalMock";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedText from "@/components/ui/AnimatedText";
import GlowButton from "@/components/ui/GlowButton";

const cliTerminalLines: TerminalLine[] = [
  { text: "  StrataNodex        v0.1.0  ● connected", color: "dim", delay: 200 },
  { text: "  ──────────────────────────────────────", color: "dim", delay: 400 },
  { text: "", delay: 500 },
  { text: "  > /list -d 2", color: "cyan", delay: 900 },
  { text: "", delay: 1200 },
  { text: "  📁 Work", color: "white", delay: 1400 },
  { text: "    📋 Sprint 4", color: "dim", delay: 1600 },
  {
    text: "      1  Ship v1           [TODO] [HIGH]",
    color: "white",
    delay: 1800,
  },
  {
    text: "        └─ 1.1  Write tests     [TODO]",
    color: "dim",
    delay: 2000,
  },
  {
    text: "        └─ 1.2  Deploy backend  [IN PROGRESS]",
    color: "teal",
    delay: 2200,
  },
  { text: "      2  Fix auth bug       [DONE]", color: "green", delay: 2400 },
];

export default function CLISection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cli-copy",
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".cli-terminal",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(180deg, #0a1a25 0%, #080c0f 100%)",
      }}
      id="cli"
      aria-labelledby="cli-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div className="cli-copy">
            <SectionLabel className="mb-4">FOR DEVELOPERS</SectionLabel>
            <AnimatedText
              text="Your terminal. Your productivity."
              tag="h2"
              id="cli-heading"
              className="font-bold mb-6 text-[color:var(--text-primary)]"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.2 }}
            />
            <p
              className="mb-8 leading-relaxed"
              style={{
                color: "var(--text-secondary)",
                fontSize: "17px",
                lineHeight: 1.8,
              }}
            >
              The StrataNodex CLI is a full TUI — not just a wrapper around a
              web app. Keyboard-driven. Infinitely nestable. Published on npm.
            </p>

            {/* Install command */}
            <div
              className="inline-flex items-center gap-3 px-5 py-3 rounded-lg mb-8"
              style={{
                background: "rgba(0,191,255,0.04)",
                border: "1px solid rgba(0,191,255,0.2)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "14px",
              }}
            >
              <span style={{ color: "var(--accent-teal)" }}>$</span>
              <span style={{ color: "var(--text-primary)" }}>
                npm install -g stratanodex
              </span>
            </div>

            <div className="flex gap-4">
              <GlowButton variant="primary" href="https://npmjs.com/package/stratanodex">
                View on npm →
              </GlowButton>
              <GlowButton variant="ghost" href="#">
                Documentation
              </GlowButton>
            </div>
          </div>

          {/* Right: terminal */}
          <div className="cli-terminal">
            <TerminalMock
              title="stratanodex"
              lines={cliTerminalLines}
              animate={true}
              loop={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
