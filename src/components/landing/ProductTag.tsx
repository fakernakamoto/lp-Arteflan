import { cn } from "@/lib/utils";

/** Compact tag for product use, size or category. Works over images (glass). */
export function ProductTag({
  children,
  onImage = false,
  className,
}: {
  children: React.ReactNode;
  onImage?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.72rem] font-medium tracking-wide",
        onImage
          ? "glass-pill text-foreground"
          : "border border-primary/25 bg-primary/8 text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}
