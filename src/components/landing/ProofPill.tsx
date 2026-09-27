import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

export function ProofPill({
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
    <li
      className={cn(
        "inline-flex min-w-0 items-center gap-2 rounded-full px-3 py-1.5 text-[0.8rem] font-medium",
        tone === "dark"
          ? "border border-white/20 bg-white/10 text-white"
          : "glass-pill text-foreground",
        className,
      )}
    >
      {Icon && (
        <Icon
          className={cn("h-4 w-4 shrink-0", tone === "dark" ? "text-brand-gold" : "text-primary")}
          aria-hidden="true"
        />
      )}
      <span className="min-w-0">{children}</span>
    </li>
  );
}
