import { useCallback, useEffect, useRef } from "react";
import { QuoteTransitionScreen } from "@/components/quote/QuoteTransitionScreen";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/** Shortest time the intro stays on screen, so it never flashes. */
const MIN_MS = 1600;
/** Hard ceiling: the intro ALWAYS closes by this point, no matter what. */
const MAX_MS = 3800;
/** Reduced motion: near-instant hand-off. */
const REDUCED_MS = 500;

type QuoteIntroScreenProps = {
  /** Called exactly once, when the intro is finished. */
  onDone: () => void;
};

/** White loading screen shown between the landing page and the quiz. */
export function QuoteIntroScreen({ onDone }: QuoteIntroScreenProps) {
  const reduced = usePrefersReducedMotion();

  const doneRef = useRef(false);
  const minElapsedRef = useRef(false);
  const animDoneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  }, [onDone]);

  // Timers are the source of truth. The animation can only make this *faster*,
  // never slower — a blocked CDN or failed WASM fetch can never strand anyone.
  useEffect(() => {
    if (reduced) {
      const t = setTimeout(finish, REDUCED_MS);
      return () => clearTimeout(t);
    }

    const minTimer = setTimeout(() => {
      minElapsedRef.current = true;
      if (animDoneRef.current) finish();
    }, MIN_MS);

    const maxTimer = setTimeout(finish, MAX_MS);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [reduced, finish]);

  const handleAnimationEnd = useCallback(() => {
    animDoneRef.current = true;
    if (minElapsedRef.current) finish();
  }, [finish]);

  return (
    <QuoteTransitionScreen
      title="Preparando sua cotação…"
      subtitle="Só um instante enquanto organizamos as perguntas certas para o seu negócio."
      progressMs={reduced ? REDUCED_MS : MAX_MS}
      onAnimationComplete={handleAnimationEnd}
      onAnimationUnavailable={handleAnimationEnd}
    />
  );
}
