import type { Variants, Transition } from "framer-motion";

export const EASE_EMPHASIZED = [0.2, 0.8, 0.2, 1] as const;
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

/** Shared viewport config so sections animate once, slightly before entering. */
export const inView = { once: true, margin: "-60px" } as const;

const base: Transition = { duration: 0.55, ease: EASE_EMPHASIZED };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: base },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE_STANDARD } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_EMPHASIZED } },
};

export const imageReveal: Variants = {
  hidden: { opacity: 0, y: 24, clipPath: "inset(8% 0% 8% 0% round 1.25rem)" },
  show: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0% 0% 0% 0% round 1.25rem)",
    transition: { duration: 0.7, ease: EASE_EMPHASIZED },
  },
};

export const lineReveal: Variants = {
  hidden: { opacity: 0, scaleX: 0 },
  show: { opacity: 1, scaleX: 1, transition: { duration: 0.7, ease: EASE_EMPHASIZED } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_EMPHASIZED } },
};
