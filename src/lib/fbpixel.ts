// Meta Pixel helper
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const FB_PIXEL_ID = "1026791440196162";
export const FB_PROD_HOSTNAME = "lp-arteflan.vercel.app";

export function isFbProd(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname === FB_PROD_HOSTNAME;
}

function setCookie(name: string, value: string, days = 90) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const host = window.location.hostname;
  // scope to eTLD+1 when possible so both apex and www share it
  const parts = host.split(".");
  const domain = parts.length > 1 ? "." + parts.slice(-2).join(".") : host;
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=${domain}; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"),
  );
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * Capture fbclid from URL and persist `_fbc` cookie in Meta's format:
 *   fb.1.<timestamp_ms>.<fbclid>
 * Called once on page load.
 */
export function captureFbclid() {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const fbclid = url.searchParams.get("fbclid");
    if (fbclid && !getCookie("_fbc")) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`;
      setCookie("_fbc", fbc, 90);
    }
  } catch {
    // ignore
  }
}

export function getFbc(): string | null {
  return getCookie("_fbc");
}

export function getFbp(): string | null {
  return getCookie("_fbp");
}

export function fbTrack(
  event: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string },
) {
  if (typeof window === "undefined") return;
  if (!isFbProd()) return;
  if (typeof window.fbq !== "function") return;
  if (options && options.eventID) {
    window.fbq("track", event, params ?? {}, { eventID: options.eventID });
  } else if (params) {
    window.fbq("track", event, params);
  } else {
    window.fbq("track", event);
  }
}

function normalizePhoneE164(raw: string): string {
  // Digits only; ensure BR country code (55) for 10/11-digit local numbers.
  const d = raw.replace(/\D+/g, "");
  if (!d) return "";
  if (d.startsWith("55")) return d;
  if (d.length === 10 || d.length === 11) return "55" + d;
  return d;
}

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

async function sha256Hex(input: string): Promise<string> {
  if (!input) return "";
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashUserData(
  email: string,
  phone: string,
): Promise<{ em?: string; ph?: string }> {
  try {
    const em = email ? await sha256Hex(normalizeEmail(email)) : "";
    const ph = phone ? await sha256Hex(normalizePhoneE164(phone)) : "";
    const out: { em?: string; ph?: string } = {};
    if (em) out.em = em;
    if (ph) out.ph = ph;
    return out;
  } catch {
    return {};
  }
}

/**
 * Re-init the pixel with hashed advanced-matching parameters before tracking.
 * Meta only uses em/ph for matching when supplied via `init` (or Automatic
 * Advanced Matching) — passing them inside `track` params does not match.
 */
export function fbInitWithUserData(hashed: { em?: string; ph?: string }) {
  if (typeof window === "undefined") return;
  if (!isFbProd()) return;
  if (typeof window.fbq !== "function") return;
  const data: Record<string, string> = {};
  if (hashed.em) data.em = hashed.em;
  if (hashed.ph) data.ph = hashed.ph;
  if (!Object.keys(data).length) return;
  window.fbq("init", FB_PIXEL_ID, data);
}

/**
 * Build the CAPI-style user_data object to forward to the server (Make → CAPI).
 * Hashes are already normalized in `hashed`.
 */
export function buildCapiUserData(hashed: { em?: string; ph?: string }) {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  return {
    em: hashed.em ?? "",
    ph: hashed.ph ?? "",
    fbc: getFbc() ?? "",
    fbp: getFbp() ?? "",
    client_user_agent: ua,
  };
}

export function fbEventId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
