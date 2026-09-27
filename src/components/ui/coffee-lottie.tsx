import { Component, useCallback, type ReactNode } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-react";
import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export const COFFEE_LOTTIE_SRC =
  "https://lottie.host/2f72901a-c0db-488b-a97c-4d39ab51555c/KVx5szL8DQ.lottie";

/**
 * Error boundary around the Lottie renderer.
 *
 * The dotLottie player loads a WASM module from a CDN at runtime. If that fetch
 * fails (offline, CSP, ad-blocker, CDN outage) the player can throw during
 * render — which, without a boundary, unmounts the whole route and shows the
 * root "Esta página não carregou" screen. We degrade to a static icon instead.
 */
class LottieErrorBoundary extends Component<
  { fallback: ReactNode; onFail?: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[CoffeeLottie] renderer failed, using static fallback", error);
    this.props.onFail?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type CoffeeLottieProps = {
  /** Rendered size in px (square). */
  size: number;
  loop?: boolean;
  speed?: number;
  /** Fired when a non-looping animation reaches its last frame. */
  onComplete?: () => void;
  /** Fired when the animation cannot be loaded/rendered at all. */
  onUnavailable?: () => void;
  className?: string;
};

function LottiePlayer({
  size,
  loop = true,
  speed = 1,
  onComplete,
  onUnavailable,
  className,
}: CoffeeLottieProps) {
  // IMPORTANT: `dotLottieRefCallback` is a React ref callback. React invokes it
  // with the instance on mount AND with `null` on unmount. Calling a method on
  // that `null` was the original crash ("Cannot read properties of null").
  const handleRef = useCallback(
    (instance: DotLottie | null) => {
      if (!instance) return;

      try {
        instance.setSpeed(speed);
        if (onComplete) instance.addEventListener("complete", onComplete);
        if (onUnavailable) instance.addEventListener("loadError", onUnavailable);
      } catch (error) {
        console.warn("[CoffeeLottie] could not configure player", error);
        onUnavailable?.();
      }
    },
    [speed, onComplete, onUnavailable],
  );

  return (
    <DotLottieReact
      src={COFFEE_LOTTIE_SRC}
      autoplay
      loop={loop}
      dotLottieRefCallback={handleRef}
      style={{ width: size, height: size }}
      className={className}
      aria-hidden="true"
    />
  );
}

/**
 * Safe coffee animation.
 *
 * Never throws, never blocks the page: falls back to a static coffee icon when
 * the user prefers reduced motion or when the player fails to load.
 */
export function CoffeeLottie(props: CoffeeLottieProps) {
  const reduced = usePrefersReducedMotion();
  const { size, className, onUnavailable } = props;

  const staticFallback = (
    <Coffee
      aria-hidden="true"
      className={cn("text-primary", !reduced && "animate-pulse", className)}
      style={{ width: size * 0.52, height: size * 0.52 }}
    />
  );

  if (reduced) {
    return (
      <span
        className="inline-flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {staticFallback}
      </span>
    );
  }

  return (
    <LottieErrorBoundary fallback={staticFallback} onFail={onUnavailable}>
      <LottiePlayer {...props} />
    </LottieErrorBoundary>
  );
}
