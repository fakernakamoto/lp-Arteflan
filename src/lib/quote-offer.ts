const OFFER_KEY = "arteflan_wholesale_offer_seen";
let suppressed = false;

export function isQuoteOfferSuppressed(): boolean {
  if (suppressed) return true;
  try {
    return sessionStorage.getItem(OFFER_KEY) === "1";
  } catch {
    return false;
  }
}

export function suppressQuoteOffer() {
  suppressed = true;
  try {
    sessionStorage.setItem(OFFER_KEY, "1");
  } catch {
    /* Private storage may be unavailable. */
  }
}
