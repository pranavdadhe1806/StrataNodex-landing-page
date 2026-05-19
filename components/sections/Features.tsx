"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedText from "@/components/ui/AnimatedText";

const features = [
  {
    id: "infinite-nesting",
    title: "Infinite Nesting",
    description:
      "Tasks nest infinitely. No depth limit. Structure matches how you actually think.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="5" cy="16" r="3" fill="#00bfff" fillOpacity="0.8" />
        <line x1="8" y1="16" x2="13" y2="8" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="8" y1="16" x2="13" y2="16" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="8" y1="16" x2="13" y2="24" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="15.5" cy="8" r="2.5" fill="#00bfff" fillOpacity="0.6" />
        <circle cx="15.5" cy="16" r="2.5" fill="#00bfff" fillOpacity="0.6" />
        <circle cx="15.5" cy="24" r="2.5" fill="#00bfff" fillOpacity="0.6" />
        <line x1="18" y1="8" x2="23" y2="5" stroke="#00bfff" strokeOpacity="0.3" strokeWidth="1" />
        <line x1="18" y1="8" x2="23" y2="11" stroke="#00bfff" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="25" cy="5" r="2" fill="#00bfff" fillOpacity="0.4" />
        <circle cx="25" cy="11" r="2" fill="#00bfff" fillOpacity="0.4" />
      </svg>
    ),
    size: "large",
  },
  {
    id: "cli-tui",
    title: "Terminal Interface",
    description:
      "Full keyboard-driven terminal UI. Add, complete, and navigate without leaving the terminal.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="2" y="5" width="28" height="22" rx="4" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" />
        <path d="M8 12L12 16L8 20" stroke="#00bfff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="15" y1="20" x2="23" y2="20" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    size: "small",
  },
  {
    id: "gamified",
    title: "Gamified Scoring",
    description:
      "Daily completion scores. Streaks. Visual graphs. Finishing tasks feels rewarding.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="3" y="20" width="5" height="8" rx="1.5" fill="#00bfff" fillOpacity="0.4" />
        <rect x="10" y="14" width="5" height="14" rx="1.5" fill="#00bfff" fillOpacity="0.6" />
        <rect x="17" y="9" width="5" height="19" rx="1.5" fill="#00bfff" fillOpacity="0.8" />
        <rect x="24" y="4" width="5" height="24" rx="1.5" fill="#00bfff" />
      </svg>
    ),
    size: "small",
  },
  {
    id: "cross-platform",
    title: "Cross-Platform Sync",
    description:
      "One account. Real-time sync across CLI, web app, and mobile. Your tree is always current.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="9" cy="16" r="6" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="23" cy="16" r="6" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="16" cy="9" r="6" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" />
      </svg>
    ),
    size: "small",
  },
  {
    id: "daily-view",
    title: "Smart Daily View",
    description:
      "Nodes with today's date auto-surface in Daily View. No manual task sorting.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="26" height="24" rx="4" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" />
        <line x1="3" y1="12" x2="29" y2="12" stroke="#00bfff" strokeOpacity="0.3" strokeWidth="1" />
        <line x1="10" y1="3" x2="10" y2="9" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="22" y1="3" x2="22" y2="9" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="16" cy="21" r="4" fill="#00c896" fillOpacity="0.6" />
      </svg>
    ),
    size: "large",
  },
  {
    id: "tag-system",
    title: "Tag System",
    description:
      "Global and list-scoped tags. Filter across your entire tree or within a single list.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M4 4h11l13 12-12 12L4 16V4z" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" fill="rgba(0,191,255,0.04)" />
        <circle cx="10" cy="10" r="2.5" fill="#00bfff" fillOpacity="0.7" />
      </svg>
    ),
    size: "small",
  },
];

export default function Features() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="py-28 px-4 sm:px-6 lg:px-8"
      style={{ background: "var(--bg-base)" }}
      id="features"
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <SectionLabel className="justify-center mb-4">FEATURES</SectionLabel>
          <AnimatedText
            text="Everything you need. Nothing you don't."
            tag="h2"
            id="features-heading"
            className="font-bold text-[color:var(--text-primary)]"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          />
        </div>

        {/* Asymmetric Bento Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Row 1: Large + 2 small stacked */}
          <div
            className="feature-card md:col-span-7 p-8 rounded-2xl flex flex-col justify-between min-h-[220px]"
            id="feature-infinite-nesting"
            style={{
              background: "#272A2F",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="mb-6 p-3 w-fit rounded-xl" style={{ background: "rgba(0,191,255,0.08)" }}>
              {features[0].icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                {features[0].title}
              </h3>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: "var(--text-secondary)" }}>
                {features[0].description}
              </p>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-5">
            <div
              className="feature-card p-6 rounded-2xl flex-1"
              id="feature-cli-tui"
              style={{
                background: "#272A2F",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="mb-4 p-2.5 w-fit rounded-xl" style={{ background: "rgba(0,191,255,0.08)" }}>
                {features[1].icon}
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                {features[1].title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {features[1].description}
              </p>
            </div>
            <div
              className="feature-card p-6 rounded-2xl flex-1"
              id="feature-gamified"
              style={{
                background: "#272A2F",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="mb-4 p-2.5 w-fit rounded-xl" style={{ background: "rgba(0,191,255,0.08)" }}>
                {features[2].icon}
              </div>
              <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                {features[2].title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {features[2].description}
              </p>
            </div>
          </div>

          {/* Row 2: 3 equal medium cards */}
          <div
            className="feature-card md:col-span-4 p-6 rounded-2xl"
            id="feature-cross-platform"
            style={{
              background: "#272A2F",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="mb-4 p-2.5 w-fit rounded-xl" style={{ background: "rgba(0,191,255,0.08)" }}>
              {features[3].icon}
            </div>
            <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
              {features[3].title}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {features[3].description}
            </p>
          </div>

          <div
            className="feature-card md:col-span-5 p-8 rounded-2xl flex flex-col justify-between min-h-[200px]"
            id="feature-daily-view"
            style={{
              background: "#272A2F",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="mb-6 p-3 w-fit rounded-xl" style={{ background: "rgba(0,200,150,0.08)" }}>
              {features[4].icon}
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                {features[4].title}
              </h3>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: "var(--text-secondary)" }}>
                {features[4].description}
              </p>
            </div>
          </div>

          <div
            className="feature-card md:col-span-3 p-6 rounded-2xl"
            id="feature-tag-system"
            style={{
              background: "#272A2F",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="mb-4 p-2.5 w-fit rounded-xl" style={{ background: "rgba(0,191,255,0.08)" }}>
              {features[5].icon}
            </div>
            <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
              {features[5].title}
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {features[5].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
