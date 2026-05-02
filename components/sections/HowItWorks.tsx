"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";

const steps = [
  {
    number: "01",
    title: "Create your structure",
    description:
      "Set up folders, lists, and tasks in any client. The tree is yours to shape — infinitely deep, always organized.",
  },
  {
    number: "02",
    title: "Manage everywhere",
    description:
      "CLI on terminal, web on browser, mobile on the go. One account — same data, every surface.",
  },
  {
    number: "03",
    title: "Track progress",
    description:
      "Daily scores, streaks, and visual graphs. Every completed node earns points. Keep the momentum.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate steps
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        gsap.fromTo(
          step,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            delay: i * 0.15,
          }
        );
      });

      // Animate connector line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { strokeDashoffset: 600 },
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-28 px-4 sm:px-6 lg:px-8 relative"
      style={{
        background: "linear-gradient(180deg, #080c0f 0%, #0a1a25 100%)",
      }}
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <SectionLabel className="justify-center mb-4">
            HOW IT WORKS
          </SectionLabel>
          <h2
            id="how-it-works-heading"
            className="font-bold"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              color: "var(--text-primary)",
            }}
          >
            One system. Every surface.
          </h2>
        </div>

        {/* Steps grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">
            {steps.map((step, i) => (
              <div
                key={step.number}
                ref={(el) => { stepsRef.current[i] = el; }}
                className="relative flex flex-col items-center text-center md:items-start md:text-left"
              >
                {/* Step number circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6 flex-shrink-0"
                  style={{
                    border: "1px solid rgba(0,191,255,0.3)",
                    background: "rgba(0,191,255,0.04)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--accent-cyan)",
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}
                >
                  {step.description}
                </p>

                {/* Mobile connector */}
                {i < steps.length - 1 && (
                  <div
                    className="md:hidden w-px h-8 mt-6"
                    style={{ background: "rgba(0,191,255,0.15)" }}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Desktop dashed connector line (SVG) */}
          <div
            className="absolute hidden md:block"
            style={{
              top: "27px",
              left: "calc(33.33% + 28px)",
              right: "calc(33.33% + 28px)",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <svg
              width="100%"
              height="2"
              overflow="visible"
            >
              <path
                ref={lineRef}
                d="M 0,1 L 1000,1"
                stroke="rgba(0,191,255,0.2)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                strokeDashoffset="600"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
