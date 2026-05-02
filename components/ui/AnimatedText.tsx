"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import React from "react";

interface AnimatedTextProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  delay?: number;
  splitType?: "words" | "chars" | "lines";
  stagger?: number;
}

export default function AnimatedText({
  text,
  tag = "h2",
  className = "",
  id,
  style,
  delay = 0,
  splitType = "words",
  stagger = 0.06,
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;

    const el = ref.current;
    if (!el) return;

    let split: SplitType | null = null;
    let ctx: gsap.Context | null = null;

    const init = () => {
      try {
        gsap.registerPlugin(ScrollTrigger);

        split = new SplitType(el, { types: splitType });
        const targets =
          splitType === "words"
            ? split.words
            : splitType === "chars"
              ? split.chars
              : split.lines;

        if (!targets || targets.length === 0) return;

        targets.forEach((target) => {
          (target as HTMLElement).style.display = "inline-block";
        });

        ctx = gsap.context(() => {
          gsap.fromTo(
            targets,
            { y: "80%", opacity: 0 },
            {
              y: "0%",
              opacity: 1,
              stagger,
              delay,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      } catch {
        // Fallback: element remains visible with no animation
      }
    };

    const timer = setTimeout(init, 50);

    return () => {
      clearTimeout(timer);
      ctx?.revert();
      split?.revert();
    };
  }, [mounted, text, splitType, stagger, delay]);

  // We render a div wrapper then use the semantic tag inside via createElement
  // This avoids complex generic ref typing
  return React.createElement(
    tag,
    {
      ref,
      id,
      className,
      style,
    } as React.HTMLAttributes<HTMLElement> & { ref: React.Ref<HTMLDivElement> },
    text
  );
}
