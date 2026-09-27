const QUOTE_CONVERSION_DESTINATION = "AW-10900216944/WNpCCJzLsIgdEPC40M0o";
const CONVERSION_TIMEOUT_MS = 300;

/** Wait for tag processing before navigation, without blocking leads if tracking fails. */
export function reportQuoteConversion(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let finished = false;
    const complete = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(timer);
      resolve();
    };
    // Independent fallback: blocked Google scripts cannot invoke event_callback.
    const timer = window.setTimeout(complete, CONVERSION_TIMEOUT_MS);
    try {
      if (typeof window.gtag !== "function") return;
      window.gtag("event", "conversion", {
        send_to: QUOTE_CONVERSION_DESTINATION,
        event_callback: complete,
        event_timeout: CONVERSION_TIMEOUT_MS,
      });
    } catch {
      // Keep the independent 300ms delay even when a tracking script fails.
    }
  });
}
