import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

export function SectionEyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "type-label inline-flex items-center gap-2",
        tone === "dark" ? "text-brand-gold" : "text-primary",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          tone === "dark" ? "bg-brand-gold" : "bg-primary",
        )}
      />
      {children}
    </span>
  );
}
