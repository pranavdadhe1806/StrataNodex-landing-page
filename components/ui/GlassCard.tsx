import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
  style,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card p-6 ${hover ? "" : "hover:border-[rgba(0,191,255,0.12)] hover:shadow-none"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
