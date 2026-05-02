import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card p-6 ${hover ? "" : "hover:border-[rgba(0,191,255,0.12)] hover:shadow-none"} ${className}`}
    >
      {children}
    </div>
  );
}
