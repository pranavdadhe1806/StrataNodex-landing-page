"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

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
  tag: Tag = "h2",
  className = "",
  id,
  style,
  delay = 0,
  splitType = "words",
  stagger = 0.06,
}: AnimatedTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const el = ref.current;
    if (!el) return;

    const split = new SplitType(el, { types: splitType });
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

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y: "100%",
        opacity: 0,
        stagger,
        delay,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => {
      ctx.revert();
      split.revert();
    };
  }, [text, splitType, stagger, delay]);

  return (
    // @ts-expect-error - dynamic tag typing with ref
    <Tag ref={ref} id={id} className={`overflow-hidden ${className}`} style={style}>
      {text}
    </Tag>
  );
}
