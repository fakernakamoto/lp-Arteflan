import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuoteForm } from "./QuoteForm";
import { isQuoteOfferSuppressed, suppressQuoteOffer } from "@/lib/quote-offer";
import { gaEvent } from "@/lib/analytics";

export function WholesaleOffer() {
  const [open, setOpen] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isQuoteOfferSuppressed()) return;
    const showOffer = (trigger: "timer" | "exit_intent") => {
      if (isQuoteOfferSuppressed() || document.visibilityState !== "visible") return;
      if (
        document.querySelector('[role="dialog"], #menu-mobile') ||
        document.activeElement?.closest(
          'input, select, textarea, [contenteditable="true"], [data-quote-form]',
        )
      )
        return;
      previousFocus.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      suppressQuoteOffer();
      setOpen(true);
      gaEvent("wholesale_offer_view", { trigger });
    };
    const timer = window.setTimeout(() => showOffer("timer"), 15000);
    const onMouseLeave = (event: MouseEvent) => {
      if (
        event.clientY <= 0 &&
        !event.relatedTarget &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
      )
        showOffer("exit_intent");
    };
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.clearTimeout(timer);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl p-5 sm:p-7"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById("wholesale-offer-title")?.focus();
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          const target = previousFocus.current;
          if (target?.isConnected && target !== document.body)
            target.focus({ preventScroll: true });
          else document.getElementById("cotacao-link-header")?.focus({ preventScroll: true });
        }}
      >
        <DialogHeader className="text-left">
          <FileText className="mb-2 h-7 w-7 text-[#128C4A]" aria-hidden="true" />
          <DialogTitle
            id="wholesale-offer-title"
            tabIndex={-1}
            className="pr-6 font-display text-2xl leading-tight"
          >
            Tabela de Preços de Atacado
          </DialogTitle>
          <DialogDescription className="pt-2 leading-relaxed">
            Receba os tamanhos, preços e condições para o seu negócio diretamente com a fábrica pelo
            WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <QuoteForm source="wholesale_popup" />
      </DialogContent>
    </Dialog>
  );
}
