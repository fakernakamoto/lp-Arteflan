import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type QuizOptionProps = {
  id: string;
  label: string;
  selected: boolean;
  multiple?: boolean;
  onSelect: () => void;
  disabled?: boolean;
};

/**
 * Keyboard-accessible option button. Uses aria-checked with radio/checkbox
 * roles so selection is announced without relying on colour alone.
 */
export function QuizOption({
  id,
  label,
  selected,
  multiple = false,
  onSelect,
  disabled,
}: QuizOptionProps) {
  return (
    <button
      type="button"
      id={id}
      role={multiple ? "checkbox" : "radio"}
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-primary bg-primary/8 text-foreground shadow-soft"
          : "border-brand-brown/15 bg-card text-foreground hover:border-primary/40 hover:bg-muted",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center border text-primary-foreground",
          multiple ? "rounded-md" : "rounded-full",
          selected ? "border-primary bg-primary" : "border-brand-brown/30 bg-background",
        )}
      >
        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span className="min-w-0 font-sans text-sm leading-snug md:text-[0.95rem]">{label}</span>
    </button>
  );
}
