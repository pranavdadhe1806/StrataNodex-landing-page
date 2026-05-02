"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedText from "@/components/ui/AnimatedText";

const mobileItems = [
  { icon: "📁", label: "Work", count: 3 },
  { icon: "📁", label: "Personal", count: 5 },
  { icon: "📁", label: "College", count: 2 },
];

export default function MobileSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".phone-mockup",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".mobile-copy",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
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
        background: "linear-gradient(180deg, #080c0f 0%, #0a1a25 100%)",
      }}
      id="mobile"
      aria-labelledby="mobile-heading"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Copy */}
        <div className="mobile-copy mb-16">
          <SectionLabel className="justify-center mb-4">MOBILE APP</SectionLabel>
          <AnimatedText
            text="In your pocket."
            tag="h2"
            id="mobile-heading"
            className="font-bold mb-6 text-[color:var(--text-primary)]"
            style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
          />
          <p
            className="mx-auto mb-6"
            style={{
              color: "var(--text-secondary)",
              fontSize: "17px",
              lineHeight: 1.8,
              maxWidth: "520px",
            }}
          >
            React Native. Same account. Add tasks on the go, check your daily
            view, and keep the streak alive.
          </p>

          {/* Coming soon badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full">
            <span
              className="text-sm font-medium"
              style={{
                border: "1px solid rgba(0,200,150,0.3)",
                color: "#00c896",
                background: "rgba(0,200,150,0.06)",
                padding: "6px 16px",
                borderRadius: "999px",
                fontFamily: "var(--font-geist-mono)",
                fontSize: "12px",
                letterSpacing: "0.05em",
              }}
            >
              Coming Soon
            </span>
          </div>
        </div>

        {/* Phone mockup */}
        <div
          className="phone-mockup inline-flex justify-center"
          aria-label="Mobile app preview"
        >
          <div
            className="relative"
            style={{
              width: "260px",
              height: "520px",
              background: "#0d1318",
              borderRadius: "40px",
              border: "2px solid rgba(0,191,255,0.15)",
              boxShadow:
                "0 0 60px rgba(0,191,255,0.06), inset 0 0 0 1px rgba(0,191,255,0.05)",
              padding: "12px",
            }}
          >
            {/* Notch */}
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2"
              style={{
                width: "80px",
                height: "24px",
                background: "#080c0f",
                borderRadius: "12px",
                zIndex: 10,
              }}
              aria-hidden="true"
            />

            {/* Screen content */}
            <div
              className="h-full rounded-[32px] overflow-hidden flex flex-col"
              style={{ background: "#080c0f", paddingTop: "48px" }}
            >
              {/* Status bar */}
              <div
                className="flex items-center justify-between px-5 pb-3"
                style={{ color: "var(--text-muted)", fontSize: "11px" }}
              >
                <span style={{ fontFamily: "var(--font-geist-mono)" }}>9:41</span>
                <div className="flex gap-1">
                  <span>●●●</span>
                </div>
              </div>

              {/* App header */}
              <div
                className="px-5 py-4"
                style={{ borderBottom: "1px solid #0e2a35" }}
              >
                <h3
                  className="font-bold"
                  style={{
                    color: "var(--accent-cyan)",
                    fontFamily: "var(--font-geist-mono)",
                    fontSize: "16px",
                  }}
                >
                  StrataNodex
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  3 folders
                </p>
              </div>

              {/* Folder list */}
              <div className="flex-1 px-3 py-3 space-y-2 overflow-hidden">
                {mobileItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-3 py-3 rounded-xl"
                    style={{
                      background: "rgba(0,191,255,0.03)",
                      border: "1px solid rgba(0,191,255,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.icon}</span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(0,191,255,0.08)",
                        color: "var(--accent-cyan)",
                        fontFamily: "var(--font-geist-mono)",
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
                ))}

                {/* Daily score card */}
                <div
                  className="px-3 py-3 rounded-xl mt-2"
                  style={{
                    background: "rgba(0,200,150,0.04)",
                    border: "1px solid rgba(0,200,150,0.15)",
                  }}
                >
                  <p
                    className="text-xs mb-1"
                    style={{ color: "var(--accent-teal)" }}
                  >
                    Daily Score
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    +6
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    🔥 4 day streak
                  </p>
                </div>
              </div>

              {/* Bottom nav */}
              <div
                className="flex items-center justify-around py-4 px-4"
                style={{ borderTop: "1px solid #0e2a35" }}
              >
                {["⊞", "◫", "⊙"].map((icon, i) => (
                  <button
                    key={i}
                    className="p-2"
                    style={{
                      color:
                        i === 0 ? "var(--accent-cyan)" : "var(--text-muted)",
                      fontSize: "18px",
                    }}
                    aria-label={`Nav ${i + 1}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Home indicator */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2"
              style={{
                width: "100px",
                height: "4px",
                background: "rgba(0,191,255,0.2)",
                borderRadius: "2px",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
