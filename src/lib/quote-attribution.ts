export const ENTRY_SOURCE_KEY = "arteflan_quote_entry_source";

export function getEntrySource(): string {
  if (typeof window === "undefined") return "";
  try {
    return sessionStorage.getItem(ENTRY_SOURCE_KEY) ?? "";
  } catch {
    return "";
  }
}
