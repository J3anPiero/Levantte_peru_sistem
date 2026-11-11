import type { CatalogQuery, SortKey } from "./catalog";

export type SearchParams = Record<string, string | string[] | undefined>;

const list = (v: string | string[] | undefined) => (v == null ? [] : Array.isArray(v) ? v : [v]).filter(Boolean);
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
const num = (v: string | string[] | undefined) => {
  const raw = one(v);
  const n = Number(raw);
  return raw !== undefined && Number.isFinite(n) ? n : undefined;
};

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Más populares" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nuevos", label: "Novedades" },
  { value: "valorados", label: "Mejor valorados" },
];

export function parseCatalogParams(sp: SearchParams, category?: string): CatalogQuery {
  const sort = one(sp.orden) as SortKey | undefined;
  return {
    category,
    brands: list(sp.marca),
    vehicle: { make: one(sp.vmarca), model: one(sp.vmodelo), year: num(sp.vanio) },
    priceMin: num(sp.pmin),
    priceMax: num(sp.pmax),
    availability: list(sp.disp) as CatalogQuery["availability"],
    type: list(sp.tipo) as CatalogQuery["type"],
    position: list(sp.pos) as CatalogQuery["position"],
    q: one(sp.q),
    sort: sortOptions.some((o) => o.value === sort) ? sort : "popular",
    page: num(sp.pagina) ?? 1,
  };
}

/** Builds a query string from the raw params, overriding or removing keys. */
export function buildQuery(sp: SearchParams, changes: Record<string, string | string[] | null>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (k in changes) continue;
    for (const item of list(v)) params.append(k, item);
  }
  for (const [k, v] of Object.entries(changes)) {
    if (v == null) continue;
    for (const item of list(v)) params.append(k, item);
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

/** Removes one value from a multi-valued param. */
export function withoutValue(sp: SearchParams, key: string, value: string) {
  return buildQuery(sp, { [key]: list(sp[key]).filter((v) => v !== value), pagina: null });
}
