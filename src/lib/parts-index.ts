import { partTypes, type PartType } from "@/data/part-types";
import { products } from "@/data/products";
import type { Product } from "./types";

/*
 * Índice de la nomenclatura de piezas. Los datos vienen de la base de car-api
 * (1521 tipos de pieza con nombre en español) y se cruzan con los productos que
 * sí tenemos en catálogo, que son los únicos con precio y stock.
 *
 * Este módulo se usa solo desde componentes de servidor: la nomenclatura pesa
 * unos 110 KB y no tiene por qué viajar al navegador.
 */

export const PART_PAGE_SIZE = 60;

const productsByType = new Map<string, Product[]>();
for (const product of products) {
  if (!product.partType) continue;
  const list = productsByType.get(product.partType) ?? [];
  list.push(product);
  productsByType.set(product.partType, list);
}

export interface PartTypeRow extends PartType {
  /** Productos nuestros de este tipo. */
  count: number;
  /** De esos, cuántos tienen stock disponible. */
  available: number;
  letter: string;
}

/** Quita acentos para que "batería" se encuentre escribiendo "bateria". */
function fold(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const rows: PartTypeRow[] = partTypes.map((t) => {
  const own = productsByType.get(t.slug) ?? [];
  return {
    ...t,
    count: own.length,
    available: own.filter((p) => p.stock > 0).length,
    letter: fold(t.name).charAt(0).toUpperCase(),
  };
});

export const partTypeLetters = [...new Set(rows.map((r) => r.letter))].sort((a, b) => a.localeCompare(b, "es"));

export const stockedPartTypes = rows.filter((r) => r.count > 0);

export interface PartsQuery {
  q?: string;
  letter?: string;
  /** Solo los tipos de pieza que tenemos en catálogo. */
  onlyStocked?: boolean;
  page?: number;
}

export function searchPartTypes({ q, letter, onlyStocked, page = 1 }: PartsQuery) {
  let list = rows;

  if (onlyStocked) list = list.filter((r) => r.count > 0);
  if (letter) list = list.filter((r) => r.letter === letter.toUpperCase());
  if (q?.trim()) {
    const needle = fold(q);
    const words = needle.split(/\s+/).filter(Boolean);
    list = list.filter((r) => {
      const hay = `${fold(r.name)} ${r.slug}`;
      return words.every((w) => hay.includes(w));
    });
  }

  // Lo que sí vendemos va primero; el resto en orden alfabético.
  list = list.slice().sort((a, b) => {
    if ((a.count > 0) !== (b.count > 0)) return a.count > 0 ? -1 : 1;
    return a.name.localeCompare(b.name, "es");
  });

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PART_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pages);
  return {
    items: list.slice((current - 1) * PART_PAGE_SIZE, current * PART_PAGE_SIZE),
    total,
    page: current,
    pages,
  };
}

export function partTypeBySlug(slug: string) {
  return rows.find((r) => r.slug === slug);
}

export const partsIndexTotals = {
  types: rows.length,
  stocked: stockedPartTypes.length,
};
