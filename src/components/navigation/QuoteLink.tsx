import type { MouseEvent, ReactNode } from "react";
import { gaEvent } from "@/lib/analytics";
import { suppressQuoteOffer } from "@/lib/quote-offer";

import { ENTRY_SOURCE_KEY } from "@/lib/quote-attribution";

type QuoteLinkProps = {
  source: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

/** Native anchors keep the quote path usable with keyboard and without JavaScript. */
export function QuoteLink({ source, children, className, onClick }: QuoteLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    suppressQuoteOffer();
    try {
      sessionStorage.setItem(ENTRY_SOURCE_KEY, source);
    } catch {
      /* Optional attribution. */
    }
    gaEvent("click_cta", { source, destination: "#cotacao" });
    onClick?.();
  }
  return (
    <a href="#cotacao" onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
