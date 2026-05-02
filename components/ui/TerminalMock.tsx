"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type TerminalLineColor =
  | "cyan"
  | "green"
  | "red"
  | "dim"
  | "white"
  | "teal";

export interface TerminalLine {
  text: string;
  color?: TerminalLineColor;
  indent?: number;
  delay?: number;
}

interface TerminalMockProps {
  title?: string;
  lines: TerminalLine[];
  animate?: boolean;
  loop?: boolean;
  className?: string;
}

const colorMap: Record<TerminalLineColor, string> = {
  cyan: "#00bfff",
  green: "#00ff99",
  red: "#ff4466",
  dim: "#4a8a9a",
  white: "#e0f8ff",
  teal: "#00c896",
};

export default function TerminalMock({
  title = "stratanodex",
  lines,
  animate = false,
  loop = false,
  className = "",
}: TerminalMockProps) {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>(
    animate ? [] : lines
  );
  const [showCursor, setShowCursor] = useState(animate);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const runAnimation = useCallback(() => {
    setVisibleLines([]);
    setShowCursor(true);

    let cumulativeDelay = 0;

    lines.forEach((line, idx) => {
      const delay = line.delay ?? 400 * idx;
      cumulativeDelay = delay;

      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
      }, delay);
      timeoutsRef.current.push(t);
    });

    if (loop) {
      const loopT = setTimeout(() => {
        clearTimeouts();
        setVisibleLines([]);
        setTimeout(() => runAnimation(), 500);
      }, cumulativeDelay + 3000);
      timeoutsRef.current.push(loopT);
    } else {
      const endT = setTimeout(() => {
        setShowCursor(false);
      }, cumulativeDelay + 500);
      timeoutsRef.current.push(endT);
    }
  }, [lines, loop, clearTimeouts]);

  useEffect(() => {
    if (!animate) return;
    runAnimation();
    return () => clearTimeouts();
  }, [animate, runAnimation, clearTimeouts]);

  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{
        background: "#0a0f13",
        border: "1px solid rgba(0,191,255,0.12)",
        fontFamily: "var(--font-geist-mono)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          background: "#0d1318",
          borderBottom: "1px solid #0e2a35",
        }}
      >
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: "#ff5f56" }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: "#ffbd2e" }}
        />
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: "#27c93f" }}
        />
        <span
          className="ml-3 text-xs"
          style={{ color: "var(--text-muted)", letterSpacing: "0.05em" }}
        >
          {title}
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-5 text-sm leading-relaxed min-h-[200px]">
        {visibleLines.map((line, i) => (
          <div key={i} className="flex">
            {line.indent ? (
              <span style={{ width: `${line.indent * 12}px`, flexShrink: 0 }} />
            ) : null}
            <span
              style={{
                color: line.color ? colorMap[line.color] : "#e0f8ff",
                whiteSpace: "pre",
              }}
            >
              {line.text}
            </span>
          </div>
        ))}
        {showCursor && (
          <span
            className="cursor-blink inline-block w-2 h-4 ml-0.5 align-middle"
            style={{ background: "#00bfff", opacity: 0.8 }}
          />
        )}
      </div>
    </div>
  );
}
