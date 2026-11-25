import type { Brand } from "@/lib/types";
import { vehicleBrands, type VehicleModel } from "./vehicles";

/** Marcas de los repuestos que vendemos, distintas de las marcas de vehículos. */
export const brands: Brand[] = [
  { id: "toyota-genuine", slug: "toyota-genuine", name: "Toyota Genuine", type: "original" },
  { id: "hyundai-mobis", slug: "hyundai-mobis", name: "Hyundai Mobis", type: "original" },
  { id: "bosch", slug: "bosch", name: "Bosch", type: "alternativo" },
  { id: "brembo", slug: "brembo", name: "Brembo", type: "alternativo" },
  { id: "trw", slug: "trw", name: "TRW", type: "alternativo" },
  { id: "akebono", slug: "akebono", name: "Akebono", type: "alternativo" },
  { id: "ferodo", slug: "ferodo", name: "Ferodo", type: "alternativo" },
  { id: "mann-filter", slug: "mann-filter", name: "Mann-Filter", type: "alternativo" },
  { id: "ngk", slug: "ngk", name: "NGK", type: "alternativo" },
  { id: "gates", slug: "gates", name: "Gates", type: "alternativo" },
  { id: "kyb", slug: "kyb", name: "KYB", type: "alternativo" },
  { id: "depo", slug: "depo", name: "Depo", type: "alternativo" },
  { id: "valeo", slug: "valeo", name: "Valeo", type: "alternativo" },
  { id: "exedy", slug: "exedy", name: "Exedy", type: "alternativo" },
];

export function getBrand(slugOrId: string) {
  return brands.find((b) => b.slug === slugOrId || b.id === slugOrId);
}

/* ------------------------------------------------------------- vehículos */

/** Las 142 marcas de vehículos de la base, en orden alfabético. */
export const vehicleMakes = vehicleBrands.map((b) => b.brand);

/**
 * Marcas con más presencia en el parque automotor peruano. Se usan donde
 * mostrar las 142 sería ruido, como el carrusel del inicio.
 */
export const featuredMakes = [
  "Toyota",
  "Hyundai",
  "Kia",
  "Nissan",
  "Chevrolet",
  "Suzuki",
  "Mitsubishi",
  "Honda",
  "Mazda",
  "Volkswagen",
];

export function modelsFor(make: string): VehicleModel[] {
  return vehicleBrands.find((b) => b.brand.toLowerCase() === make.toLowerCase())?.models ?? [];
}

export function findModel(make: string, model: string): VehicleModel | undefined {
  return modelsFor(make).find((m) => m.name.toLowerCase() === model.toLowerCase());
}

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Años válidos para un modelo, del más reciente al más antiguo. Sin modelo se
 * devuelven los últimos veinticinco años, que es el rango útil para repuestos.
 */
export function yearsFor(make?: string, model?: string): number[] {
  const found = make && model ? findModel(make, model) : undefined;
  const from = found?.from ?? CURRENT_YEAR - 24;
  const to = found?.to ?? CURRENT_YEAR;
  const years: number[] = [];
  for (let y = Math.min(to, CURRENT_YEAR); y >= from; y--) years.push(y);
  return years;
}

/** Rango legible de un modelo: "2015 – presente", "2005 – 2015" o "sin dato". */
export function modelRange(model: VehicleModel) {
  if (model.from == null) return "años sin dato";
  return `${model.from} – ${model.to ?? "presente"}`;
}
