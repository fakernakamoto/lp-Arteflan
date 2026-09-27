import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Discreet scroll hint. Pure CSS animation, hides after ~80px of scroll or on
 * any keyboard/touch interaction. Decorative → aria-hidden.
 */
export function ScrollIndicator({
  label = "Role para conhecer",
  tone = "light",
  className,
}: {
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = () => setVisible(false);
    const onScroll = () => {
      if (window.scrollY > 80) hide();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", hide, { once: true });
    window.addEventListener("touchstart", hide, { once: true, passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", hide);
      window.removeEventListener("touchstart", hide);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none flex items-center gap-2.5 transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      <span
        className={cn(
          "scroll-mouse",
          tone === "dark" ? "scroll-mouse-dark" : "scroll-mouse-light",
        )}
      />
      <span
        className={cn(
          "scroll-hint-text type-label",
          tone === "dark" ? "text-white/75" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </div>
  );
}
