"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedText from "@/components/ui/AnimatedText";

const featureList = [
  "Pannable infinite canvas",
  "Drag-to-reposition nodes",
  "Right-panel node editor",
  "Daily breakdown + graphs",
];

// Simplified canvas node mockup data
const mockNodes = [
  { id: "n1", x: 40, y: 30, title: "Ship v1", number: "1", status: "TODO", priority: "HIGH", selected: true, children: true },
  { id: "n2", x: 80, y: 90, title: "Write tests", number: "1.1", status: "TODO", selected: false, children: false },
  { id: "n3", x: 80, y: 150, title: "Deploy backend", number: "1.2", status: "IN_PROGRESS", selected: false, children: false },
  { id: "n4", x: 40, y: 210, title: "Fix auth bug", number: "2", status: "DONE", selected: false, children: false },
];

const statusColors: Record<string, string> = {
  TODO: "transparent",
  IN_PROGRESS: "rgba(0,191,255,0.5)",
  DONE: "#00c896",
};

const statusBorders: Record<string, string> = {
  TODO: "1.5px solid #8A8F98",
  IN_PROGRESS: "1.5px solid rgba(0,191,255,0.7)",
  DONE: "none",
};

export default function WebAppSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      nodesRef.current.forEach((node, i) => {
        if (!node) return;
        gsap.fromTo(
          node,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.2)",
            delay: i * 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      gsap.fromTo(
        ".webapp-copy",
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
      style={{ background: "var(--bg-base)" }}
      id="webapp"
      aria-labelledby="webapp-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Browser mockup */}
          <div className="order-2 lg:order-1">
            <div
              className="rounded-xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "#1B1D21",
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  background: "#32363C",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div
                  className="ml-4 flex-1 rounded px-3 py-1 text-xs"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#8A8F98",
                    fontFamily: "var(--font-geist-mono)",
                    maxWidth: "220px",
                  }}
                >
                  Sprint 4
                </div>
              </div>

              {/* Canvas area */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: "280px",
                  background: "#1B1D21",
                  padding: "16px",
                }}
              >
                {/* L-shaped SVG connectors */}
                <svg className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ pointerEvents: "none" }}>
                  {/* n1 → n2 */}
                  <path d="M 60,70 L 60,110 L 96,110" fill="none" stroke="#8A8F98" strokeWidth="1" strokeOpacity="0.3" />
                  {/* n1 → n3 */}
                  <path d="M 60,70 L 60,170 L 96,170" fill="none" stroke="#8A8F98" strokeWidth="1" strokeOpacity="0.3" />
                </svg>

                {/* Node cards */}
                {mockNodes.map((node, i) => (
                  <div
                    key={node.id}
                    ref={(el) => { nodesRef.current[i] = el; }}
                    className="absolute flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      left: node.x,
                      top: node.y,
                      background: node.selected ? "#3A3E44" : "#32363C",
                      border: node.selected
                        ? "1px solid rgba(0,191,255,0.3)"
                        : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                      minWidth: "180px",
                    }}
                  >
                    {/* Status circle */}
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: statusColors[node.status] ?? "transparent",
                        border: statusBorders[node.status] ?? "1.5px solid #8A8F98",
                        flexShrink: 0,
                      }}
                    />
                    {/* Number + Title */}
                    <span className="text-xs" style={{ color: "#8A8F98", fontFamily: "var(--font-geist-mono)", flexShrink: 0 }}>
                      {node.number}
                    </span>
                    <span className="text-sm truncate" style={{ color: "#EDEFF3" }}>
                      {node.title}
                    </span>
                    {/* Priority badge */}
                    {node.priority && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded ml-auto" style={{ background: "rgba(255,100,100,0.15)", color: "#ff6b6b", fontFamily: "var(--font-geist-mono)", flexShrink: 0 }}>
                        {node.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: copy */}
          <div className="webapp-copy order-1 lg:order-2">
            <SectionLabel className="mb-4">WEB APP</SectionLabel>
            <AnimatedText
              text="The same tree. Now draggable."
              tag="h2"
              id="webapp-heading"
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
              The web app renders your task tree on an infinite pannable canvas.
              Drag nodes, expand branches, and edit everything in a side panel.
              The same data. A completely different experience.
            </p>

            <ul className="space-y-3">
              {featureList.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span style={{ color: "var(--accent-cyan)", fontSize: "18px" }}>✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
