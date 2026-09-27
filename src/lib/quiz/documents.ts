/** Validação e máscara de CPF/CNPJ. Sem dependência de rede. */

export const onlyDigits = (v: string) => v.replace(/\D+/g, "");

export function maskCPF(raw: string): string {
  const d = onlyDigits(raw).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function maskCNPJ(raw: string): string {
  const d = onlyDigits(raw).slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export function maskCEP(raw: string): string {
  const d = onlyDigits(raw).slice(0, 8);
  return d.length <= 5 ? d : `${d.slice(0, 5)}-${d.slice(5)}`;
}

/** CPF com dígitos verificadores. Rejeita sequências repetidas (000..., 111...). */
export function validateCPF(raw: string): boolean {
  const d = onlyDigits(raw);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;

  const digit = (slice: number) => {
    let sum = 0;
    for (let i = 0; i < slice; i += 1) sum += Number(d[i]) * (slice + 1 - i);
    const mod = (sum * 10) % 11;
    return mod === 10 ? 0 : mod;
  };

  return digit(9) === Number(d[9]) && digit(10) === Number(d[10]);
}

/** CNPJ com dígitos verificadores. Rejeita sequências repetidas. */
export function validateCNPJ(raw: string): boolean {
  const d = onlyDigits(raw);
  if (d.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(d)) return false;

  const digit = (slice: number) => {
    const weights = slice === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
                                 : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < slice; i += 1) sum += Number(d[i]) * weights[i];
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  return digit(12) === Number(d[12]) && digit(13) === Number(d[13]);
}

export function isValidCEP(raw: string): boolean {
  return onlyDigits(raw).length === 8;
}
