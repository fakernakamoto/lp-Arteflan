const ARTEFLAN_WHATSAPP = "5567992348962";

export function getArteflanWhatsAppNumber(): string {
  return ARTEFLAN_WHATSAPP;
}

export function buildArteflanWhatsAppUrl(message: string): string {
  return `https://wa.me/${getArteflanWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}
