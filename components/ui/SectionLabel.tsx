import React from "react";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      aria-label={`Section: ${children}`}
    >
      <span
        style={{ color: "var(--accent-teal)" }}
        className="text-sm font-medium"
        aria-hidden="true"
      >
        •
      </span>
      <span
        style={{
          fontSize: "11px",
          letterSpacing: "0.3em",
          color: "var(--accent-teal)",
          fontFamily: "var(--font-geist-mono)",
          textTransform: "uppercase",
        }}
      >
        {children}
      </span>
    </div>
  );
}
