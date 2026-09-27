import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { suppressQuoteOffer } from "@/lib/quote-offer";
import { gaEvent } from "@/lib/analytics";

export function WhatsAppFab() {
  const { pathname } = useLocation();

  const [quoteVisible, setQuoteVisible] = useState(false);
  useEffect(() => {
    const quote = document.getElementById("cotacao");
    if (!quote) return;
    const observer = new IntersectionObserver(([entry]) => setQuoteVisible(entry.isIntersecting));
    observer.observe(quote);
    return () => observer.disconnect();
  }, [pathname]);

  // Hide the FAB on the quote page to avoid covering form fields
  if (pathname === "/orcamento" || quoteVisible) return null;

  return (
    <a
      href="#cotacao"
      aria-label="Falar com a Arteflan no WhatsApp"
      title="Falar no WhatsApp"
      className="animate-wa-pulse fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#063b20] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      onClick={() => {
        suppressQuoteOffer();
        gaEvent("click_cta", { source: "whatsapp_fab", destination: "#cotacao" });
      }}
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
    </a>
  );
}
