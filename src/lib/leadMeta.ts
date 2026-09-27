// Helpers to enrich webhook payloads with tracking/context metadata.
import { getAttribution } from "./utm";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function buildLeadMeta() {
  if (typeof window === "undefined") {
    return {
      page_url: "",
      page_path: "",
      referrer: "",
      user_agent: "",
      language: "",
      screen: "",
      timezone: "",
      fbp: null,
      fbc: null,
      utms: {},
    };
  }
  const url = new URL(window.location.href);
  const attrib = getAttribution();
  const utms: Record<string, string> = {};
  for (const [k, v] of Object.entries(attrib)) {
    if (typeof v === "string") utms[k] = v;
  }
  return {
    page_url: window.location.href,
    page_path: url.pathname + url.search,
    page_hostname: window.location.hostname,
    referrer: document.referrer || "",
    user_agent: navigator.userAgent || "",
    language: navigator.language || "",
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    utms,
    first_landing_url: attrib.first_landing_url ?? "",
    first_referrer: attrib.first_referrer ?? "",
  };
}
