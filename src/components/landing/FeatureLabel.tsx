import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

export function FeatureLabel({
  icon: Icon,
  children,
  tone = "light",
  className,
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[0.8rem] font-medium",
        tone === "dark"
          ? "border border-white/15 bg-white/10 text-white"
          : "border border-brand-brown/15 bg-muted text-foreground",
        className,
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />}
      <span className="min-w-0">{children}</span>
    </span>
  );
}
