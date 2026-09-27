import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, inView } from "@/lib/motion";
import { SectionEyebrow } from "./SectionEyebrow";

type Align = "left" | "center";
type Tone = "light" | "dark";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "light",
  as: As = "h2",
  titleId,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: Align;
  tone?: Tone;
  as?: "h2" | "h3";
  titleId?: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className,
      )}
    >
      {eyebrow && <SectionEyebrow tone={tone}>{eyebrow}</SectionEyebrow>}
      <As
        id={titleId}
        tabIndex={titleId ? -1 : undefined}
        className={cn(
          titleId && "outline-none",
          As === "h2" ? "type-h2" : "type-h3",
          "mt-4 text-balance",
          tone === "dark" ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </As>
      {description && (
        <p
          className={cn(
            "type-body measure-wide mt-4",
            align === "center" && "mx-auto",
            tone === "dark" ? "text-white/75" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
