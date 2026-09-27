// Capture and persist marketing attribution parameters across sessions.
const STORAGE_KEY = "arteflan_attrib_v1";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "ttclid",
  "msclkid",
] as const;

export type AttribKey = (typeof KEYS)[number];
export type Attrib = Partial<Record<AttribKey, string>> & {
  first_landing_url?: string;
  first_referrer?: string;
  saved_at?: number;
};

function safeParse(raw: string | null): Attrib | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Attrib;
    if (v.saved_at && Date.now() - v.saved_at > TTL_MS) return null;
    return v;
  } catch {
    return null;
  }
}

export function captureAttribution(): Attrib {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const incoming: Attrib = {};
  for (const k of KEYS) {
    const v = url.searchParams.get(k);
    if (v) incoming[k] = v;
  }
  const existing = safeParse(window.localStorage.getItem(STORAGE_KEY));
  // First-touch wins: keep existing values if present, add new ones only if missing.
  const merged: Attrib = { ...incoming, ...existing };
  if (Object.keys(incoming).length > 0 || !existing) {
    // Only overwrite storage if we're recording something new.
    const payload: Attrib = {
      ...merged,
      first_landing_url:
        existing?.first_landing_url ?? window.location.href,
      first_referrer: existing?.first_referrer ?? document.referrer ?? "",
      saved_at: existing?.saved_at ?? Date.now(),
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore quota errors
    }
    return payload;
  }
  return existing;
}

export function getAttribution(): Attrib {
  if (typeof window === "undefined") return {};
  return safeParse(window.localStorage.getItem(STORAGE_KEY)) ?? {};
}
