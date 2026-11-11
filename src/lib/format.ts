const pen = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});

/** Formats a price in soles as "S/ 1,234.50". */
export function formatPrice(value: number) {
  return pen.format(value).replace(/^PEN\s?/, "S/ ").replace("S/ ", "S/ ");
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  return new Intl.DateTimeFormat("es-PE", opts).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

export const IGV_RATE = 0.18;

/** IGV included inside a gross amount. */
export function igvIncluded(gross: number) {
  return gross - gross / (1 + IGV_RATE);
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
