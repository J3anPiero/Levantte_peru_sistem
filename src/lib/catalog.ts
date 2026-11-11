import { brands, getBrand } from "@/data/brands";
import { categories, categoryTree, getCategory } from "@/data/categories";
import { products } from "@/data/products";
import type { Product, VehicleFit } from "@/lib/types";

export const PAGE_SIZE = 9;

export type SortKey = "popular" | "precio-asc" | "precio-desc" | "nuevos" | "valorados";

export interface VehicleQuery {
  make?: string;
  model?: string;
  year?: number;
}

export interface CatalogQuery {
  category?: string;
  brands?: string[];
  vehicle?: VehicleQuery;
  priceMin?: number;
  priceMax?: number;
  availability?: ("en-stock" | "bajo-pedido")[];
  type?: ("original" | "alternativo")[];
  position?: ("delantero" | "posterior")[];
  q?: string;
  sort?: SortKey;
  page?: number;
}

export function getProduct(slugOrId: string) {
  return products.find((p) => p.slug === slugOrId || p.id === slugOrId);
}

export function productBrand(p: Product) {
  return getBrand(p.brandId)!;
}

export function productCategory(p: Product) {
  return getCategory(p.categoryId)!;
}

/** Breadcrumb trail of categories from root to the product's category. */
export function categoryPath(categoryId: string) {
  const path = [];
  let current = getCategory(categoryId);
  while (current) {
    path.unshift(current);
    current = current.parentId ? getCategory(current.parentId) : undefined;
  }
  return path;
}

export function fitsVehicle(p: Product, v?: VehicleQuery): boolean | undefined {
  if (!v?.make) return undefined;
  if (p.fits.length === 0) return undefined;
  return p.fits.some(
    (f) =>
      f.make.toLowerCase() === v.make!.toLowerCase() &&
      (!v.model || f.model.toLowerCase() === v.model.toLowerCase()) &&
      (!v.year || (v.year >= f.yearFrom && v.year <= f.yearTo)),
  );
}

export function describeFit(f: VehicleFit) {
  return `${f.make} ${f.model} ${f.yearFrom}–${f.yearTo}${f.engine ? ` · ${f.engine}` : ""}`;
}

function matchesSearch(p: Product, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [p.name, p.sku, p.oem, p.ref, productBrand(p).name, productCategory(p).name, ...p.fits.map(describeFit)]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((word) => hay.includes(word));
}

export function searchProducts(query: CatalogQuery) {
  let list = products.slice();

  if (query.category) {
    const cat = getCategory(query.category);
    if (cat) {
      const ids = new Set(categoryTree(cat.id));
      list = list.filter((p) => ids.has(p.categoryId));
    }
  }
  if (query.brands?.length) {
    const set = new Set(query.brands);
    list = list.filter((p) => set.has(p.brandId));
  }
  if (query.vehicle?.make) {
    list = list.filter((p) => fitsVehicle(p, query.vehicle) !== false);
  }
  if (query.priceMin != null) list = list.filter((p) => p.price >= query.priceMin!);
  if (query.priceMax != null) list = list.filter((p) => p.price <= query.priceMax!);
  if (query.availability?.length) {
    const wantStock = query.availability.includes("en-stock");
    const wantOrder = query.availability.includes("bajo-pedido");
    list = list.filter((p) => (wantStock && p.stock > 0) || (wantOrder && p.stock === 0));
  }
  if (query.type?.length) {
    const set = new Set(query.type);
    list = list.filter((p) => set.has(p.type));
  }
  if (query.position?.length) {
    const set = new Set(query.position);
    list = list.filter((p) => p.position && set.has(p.position));
  }
  if (query.q) list = list.filter((p) => matchesSearch(p, query.q!));

  switch (query.sort) {
    case "precio-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "precio-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "nuevos":
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "valorados":
      list.sort((a, b) => (b.rating?.avg ?? 0) - (a.rating?.avg ?? 0));
      break;
    default:
      list.sort((a, b) => b.soldCount - a.soldCount);
  }

  const total = list.length;
  const page = Math.max(1, query.page ?? 1);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const items = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return { items, total, page: Math.min(page, pages), pages, all: list };
}

/** Facet counts for the sidebar, computed over the category scope only. */
export function facets(categorySlug?: string) {
  let scope = products;
  if (categorySlug) {
    const cat = getCategory(categorySlug);
    if (cat) {
      const ids = new Set(categoryTree(cat.id));
      scope = products.filter((p) => ids.has(p.categoryId));
    }
  }
  const count = (fn: (p: Product) => boolean) => scope.filter(fn).length;
  return {
    brands: brands.map((b) => ({ ...b, count: count((p) => p.brandId === b.id) })).filter((b) => b.count > 0),
    categories: categories.map((c) => ({ ...c, count: count((p) => categoryTree(c.id).includes(p.categoryId)) })),
    inStock: count((p) => p.stock > 0),
    backorder: count((p) => p.stock === 0),
    original: count((p) => p.type === "original"),
    alternativo: count((p) => p.type === "alternativo"),
    delantero: count((p) => p.position === "delantero"),
    posterior: count((p) => p.position === "posterior"),
    priceMin: Math.min(...scope.map((p) => p.price)),
    priceMax: Math.max(...scope.map((p) => p.price)),
  };
}

export const featuredProducts = () => products.filter((p) => p.badges?.includes("destacado")).slice(0, 4);
export const bestSellers = () => products.slice().sort((a, b) => b.soldCount - a.soldCount).slice(0, 4);

export function relatedProducts(p: Product, n = 4) {
  const sameCat = products.filter((o) => o.id !== p.id && productCategory(o).parentId === productCategory(p).parentId);
  const others = products.filter((o) => o.id !== p.id && !sameCat.includes(o));
  return [...sameCat.filter((o) => o.categoryId !== p.categoryId), ...sameCat, ...others].filter((o, i, arr) => arr.indexOf(o) === i).slice(0, n);
}

export function stockState(p: Product): { label: string; tone: "ok" | "warn" | "muted" } {
  if (p.stock === 0) return { label: `Bajo pedido · ${p.leadTimeDays ?? 5} días`, tone: "muted" };
  if (p.stock <= 4) return { label: `Últimas ${p.stock} unidades`, tone: "warn" };
  return { label: "En stock", tone: "ok" };
}
