"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import GlassCard from "@/components/ui/GlassCard";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedText from "@/components/ui/AnimatedText";

const features = [
  {
    id: "infinite-nesting",
    title: "Infinite Nesting",
    description:
      "Tasks nest infinitely. No depth limit. Structure matches how you actually think.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="4" cy="14" r="2.5" fill="#00bfff" fillOpacity="0.8" />
        <line x1="6.5" y1="14" x2="11" y2="7" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.2" />
        <line x1="6.5" y1="14" x2="11" y2="14" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.2" />
        <line x1="6.5" y1="14" x2="11" y2="21" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.2" />
        <circle cx="13.5" cy="7" r="2" fill="#00bfff" fillOpacity="0.6" />
        <circle cx="13.5" cy="14" r="2" fill="#00bfff" fillOpacity="0.6" />
        <circle cx="13.5" cy="21" r="2" fill="#00bfff" fillOpacity="0.6" />
        <line x1="15.5" y1="7" x2="20" y2="4" stroke="#00bfff" strokeOpacity="0.3" strokeWidth="1" />
        <line x1="15.5" y1="7" x2="20" y2="10" stroke="#00bfff" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="22" cy="4" r="1.5" fill="#00bfff" fillOpacity="0.4" />
        <circle cx="22" cy="10" r="1.5" fill="#00bfff" fillOpacity="0.4" />
      </svg>
    ),
  },
  {
    id: "cli-tui",
    title: "CLI-First TUI",
    description:
      "Full keyboard-driven terminal UI. Add, complete, and navigate without leaving the terminal.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="4"
          width="24"
          height="20"
          rx="3"
          stroke="#00bfff"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />
        <path
          d="M7 11L11 14L7 17"
          stroke="#00bfff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="13"
          y1="17"
          x2="20"
          y2="17"
          stroke="#00bfff"
          strokeOpacity="0.5"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "gamified",
    title: "Gamified Scoring",
    description:
      "Daily completion scores. Streaks. Visual graphs. Finishing tasks feels rewarding.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <rect x="3" y="18" width="4" height="6" rx="1" fill="#00bfff" fillOpacity="0.5" />
        <rect x="9" y="13" width="4" height="11" rx="1" fill="#00bfff" fillOpacity="0.65" />
        <rect x="15" y="9" width="4" height="15" rx="1" fill="#00bfff" fillOpacity="0.8" />
        <rect x="21" y="5" width="4" height="19" rx="1" fill="#00bfff" />
      </svg>
    ),
  },
  {
    id: "cross-platform",
    title: "Cross-Platform Sync",
    description:
      "One account. Real-time sync across CLI, web app, and mobile. Your tree is always current.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="8" cy="14" r="5" stroke="#00bfff" strokeOpacity="0.6" strokeWidth="1.2" />
        <circle cx="20" cy="14" r="5" stroke="#00bfff" strokeOpacity="0.6" strokeWidth="1.2" />
        <circle cx="14" cy="8" r="5" stroke="#00bfff" strokeOpacity="0.6" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "daily-view",
    title: "Smart Daily View",
    description:
      "Nodes with today's date auto-surface in Daily View. No manual task sorting.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="22" height="20" rx="3" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.2" />
        <line x1="3" y1="11" x2="25" y2="11" stroke="#00bfff" strokeOpacity="0.3" strokeWidth="1" />
        <line x1="9" y1="3" x2="9" y2="9" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="19" y1="3" x2="19" y2="9" stroke="#00bfff" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="18" r="3" fill="#00c896" fillOpacity="0.7" />
      </svg>
    ),
  },
  {
    id: "tag-system",
    title: "Tag System",
    description:
      "Global and list-scoped tags. Filter across your entire tree or within a single list.",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 4h9l11 10-10 10L4 13V4z"
          stroke="#00bfff"
          strokeOpacity="0.6"
          strokeWidth="1.2"
          fill="rgba(0,191,255,0.06)"
        />
        <circle cx="9" cy="9" r="2" fill="#00bfff" fillOpacity="0.8" />
      </svg>
    ),
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
      <div className="max-w-7xl mx-auto">
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

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 features-grid"
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="feature-card"
              id={`feature-${feature.id}`}
            >
              <GlassCard className="h-full">
                <div className="mb-4">{feature.icon}</div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
                >
                  {feature.description}
                </p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
