import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export type SvgFollowScrollProps = {
  className?: string;
  pathClassName?: string;
  /** Scroll progress (0-1) at which the line starts drawing. */
  start?: number;
  /** Scroll progress (0-1) at which the line is fully drawn. */
  end?: number;
  strokeWidth?: number;
  /** When true and reduced motion is preferred, render the full static line. */
  reducedMotionFallback?: boolean;
};

/**
 * Decorative "thread of coffee" path that draws itself as the surrounding
 * section scrolls through the viewport. Fluid viewBox, no fixed heights,
 * never intercepts pointer events.
 */
export function SvgFollowScroll({
  className,
  pathClassName,
  start = 0.05,
  end = 0.85,
  strokeWidth = 2,
  reducedMotionFallback = true,
}: SvgFollowScrollProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [start, end], [0, 1], {
    clamp: true,
  });

  const staticLine = reduceMotion && reducedMotionFallback;

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <svg
        viewBox="0 0 120 1000"
        preserveAspectRatio="none"
        className="h-full w-full"
        fill="none"
      >
        {/* soft guide */}
        <path
          d="M60 0 C60 120, 20 180, 20 280 C20 400, 100 440, 100 560 C100 690, 20 720, 20 840 C20 930, 60 950, 60 1000"
          stroke="hsl(var(--brand-brown) / 0.12)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* progress line */}
        <motion.path
          d="M60 0 C60 120, 20 180, 20 280 C20 400, 100 440, 100 560 C100 690, 20 720, 20 840 C20 930, 60 950, 60 1000"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={pathClassName}
          style={staticLine ? { pathLength: 1 } : { pathLength }}
        />
      </svg>
    </div>
  );
}
