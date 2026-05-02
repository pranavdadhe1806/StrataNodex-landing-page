"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
  { id: "n1", x: 40, y: 40, title: "Work", status: "FOLDER", selected: false },
  { id: "n2", x: 220, y: 30, title: "Sprint 4", status: "LIST", selected: false },
  { id: "n3", x: 400, y: 20, title: "Ship v1", status: "TODO", selected: true },
  { id: "n4", x: 400, y: 90, title: "Fix auth bug", status: "DONE", selected: false },
  { id: "n5", x: 220, y: 120, title: "Personal", status: "FOLDER", selected: false },
  { id: "n6", x: 40, y: 140, title: "College", status: "FOLDER", selected: false },
];

const statusColors: Record<string, string> = {
  FOLDER: "#4d9fff",
  LIST: "#00c896",
  TODO: "#4a8a9a",
  DONE: "#00ff99",
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
                border: "1px solid rgba(0,191,255,0.12)",
                background: "#0a0f13",
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  background: "#0d1318",
                  borderBottom: "1px solid #0e2a35",
                }}
              >
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div
                  className="ml-4 flex-1 rounded px-3 py-1 text-xs"
                  style={{
                    background: "rgba(0,191,255,0.04)",
                    border: "1px solid rgba(0,191,255,0.1)",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-geist-mono)",
                    maxWidth: "220px",
                  }}
                >
                  app.stratanodex.vercel.app
                </div>
              </div>

              {/* Canvas area */}
              <div
                className="relative overflow-hidden"
                style={{
                  height: "280px",
                  background: "#080c0f",
                }}
              >
                {/* Grid lines */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="grid"
                      width="30"
                      height="30"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 30 0 L 0 0 0 30"
                        fill="none"
                        stroke="rgba(14,42,53,0.5)"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Connector lines */}
                  <line x1="110" y1="55" x2="255" y2="45" stroke="#0e2a35" strokeWidth="1" />
                  <line x1="310" y1="45" x2="440" y2="35" stroke="#0e2a35" strokeWidth="1" />
                  <line x1="310" y1="45" x2="440" y2="105" stroke="#0e2a35" strokeWidth="1" />
                  <line x1="110" y1="55" x2="255" y2="135" stroke="#0e2a35" strokeWidth="1" />
                </svg>

                {/* Nodes */}
                {mockNodes.map((node, i) => (
                  <div
                    key={node.id}
                    ref={(el) => { nodesRef.current[i] = el; }}
                    className="absolute flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      left: node.x,
                      top: node.y,
                      background: node.selected
                        ? "rgba(0,191,255,0.08)"
                        : "rgba(13,19,24,0.95)",
                      border: node.selected
                        ? "1px solid rgba(0,191,255,0.4)"
                        : "1px solid rgba(14,42,53,0.8)",
                      minWidth: "140px",
                    }}
                  >
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: `${statusColors[node.status]}20`,
                        color: statusColors[node.status],
                        fontFamily: "var(--font-geist-mono)",
                        fontSize: "10px",
                        flexShrink: 0,
                      }}
                    >
                      {node.status}
                    </span>
                    <span
                      className="text-xs truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {node.title}
                    </span>
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
