import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { CoffeeLottie } from "@/components/ui/coffee-lottie";

type QuoteTransitionScreenProps = {
  title: string;
  subtitle?: string;
  /** Duration (ms) for the progress bar. Omit to hide the bar. */
  progressMs?: number;
  loop?: boolean;
  speed?: number;
  onAnimationComplete?: () => void;
  onAnimationUnavailable?: () => void;
  /** Optional action rendered under the text (e.g. a manual WhatsApp link). */
  children?: ReactNode;
};

/**
 * Full-screen white transition screen.
 *
 * This is the ONLY place a loading animation is allowed to appear: between the
 * site and the quiz, and between the quiz and the WhatsApp hand-off. The quiz
 * card itself never shows an animation.
 *
 * Rendered through a portal into <body> so no page layout, header or stacking
 * context can contain it, clip it or overlap it.
 */
export function QuoteTransitionScreen({
  title,
  subtitle,
  progressMs,
  loop = false,
  speed = 0.5,
  onAnimationComplete,
  onAnimationUnavailable,
  children,
}: QuoteTransitionScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Freeze background scroll while this screen owns the viewport.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 z-[2147483647] flex flex-col items-center justify-center gap-6 bg-white px-6"
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <motion.div
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="flex items-center justify-center"
      >
        <CoffeeLottie
          size={240}
          loop={loop}
          speed={speed}
          onComplete={onAnimationComplete}
          onUnavailable={onAnimationUnavailable}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex max-w-sm flex-col items-center gap-2 text-center"
      >
        <p className="font-display text-xl text-foreground md:text-2xl">{title}</p>
        {subtitle && <p className="font-sans text-sm text-muted-foreground">{subtitle}</p>}
      </motion.div>

      {children && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {children}
        </motion.div>
      )}

      {progressMs !== undefined && (
        <div
          className="h-1 w-48 overflow-hidden rounded-full bg-brand-brown/10"
          aria-hidden="true"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "8%" }}
            animate={{ width: "100%" }}
            transition={{ duration: progressMs / 1000, ease: "easeInOut" }}
          />
        </div>
      )}
    </motion.div>,
    document.body,
  );
}
