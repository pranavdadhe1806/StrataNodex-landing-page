import React from "react";
import Link from "next/link";

interface GlowButtonProps {
  children: React.ReactNode;
  variant: "primary" | "ghost" | "outline";
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  id?: string;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: "rgba(0,51,68,0.8)",
    border: "1px solid rgba(0,191,255,0.4)",
    color: "#00bfff",
  },
  ghost: {
    background: "transparent",
    border: "none",
    color: "#4a8a9a",
  },
  outline: {
    background: "transparent",
    border: "1px solid #0e2a35",
    color: "#4a8a9a",
  },
};

const variantHoverClass: Record<string, string> = {
  primary:
    "hover:border-[rgba(0,191,255,0.7)] hover:shadow-[0_0_18px_rgba(0,191,255,0.15)] hover:bg-[rgba(0,60,80,0.9)]",
  ghost: "hover:text-[#e0f8ff]",
  outline: "hover:border-[#0e3a4a] hover:text-[#e0f8ff]",
};

export default function GlowButton({
  children,
  variant,
  onClick,
  href,
  type = "button",
  disabled = false,
  className = "",
  id,
}: GlowButtonProps) {
  const baseClass = `inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-300 ${variantHoverClass[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClass} style={variantStyles[variant]}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      id={id}
      className={baseClass}
      style={variantStyles[variant]}
    >
      {children}
    </button>
  );
}
