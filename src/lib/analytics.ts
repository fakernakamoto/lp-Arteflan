// Shared Google tag: Arteflan Ads is enabled by default; GA4 is optional.
// Env: VITE_GA4_ID (e.g. G-XXXXXXX), VITE_ADS_ID (e.g. AW-XXXXXXX),
//      VITE_ADS_CONVERSION_LABEL (label for Lead conversion).

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
export const ADS_ID =
  (import.meta.env.VITE_ADS_ID as string | undefined)?.trim() || "AW-10900216944";
export const ADS_CONVERSION_LABEL = import.meta.env.VITE_ADS_CONVERSION_LABEL as string | undefined;

export function hasAnalytics(): boolean {
  return Boolean(GA4_ID || ADS_ID);
}

export function gaEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export function adsConversion(params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  if (!ADS_ID || !ADS_CONVERSION_LABEL) return;
  window.gtag("event", "conversion", {
    send_to: `${ADS_ID}/${ADS_CONVERSION_LABEL}`,
    ...params,
  });
}

export type ConsentState = "granted" | "denied";

export function updateConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: state,
    analytics_storage: state,
    ad_user_data: state,
    ad_personalization: state,
  });
}
