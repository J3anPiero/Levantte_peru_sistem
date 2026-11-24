import { categoryTree } from "@/data/categories";
import { products } from "@/data/products";
import { fitsVehicle } from "./catalog";
import type { VehicleRecord } from "./plate";
import type { Product } from "./types";

/**
 * Despiece del vehículo por sistemas. Cada zona agrupa categorías del catálogo
 * y tiene un punto sobre el dibujo lateral del auto, cuyo lienzo es 0 0 400 190.
 */
export interface Zone {
  id: string;
  label: string;
  detail: string;
  /** Categorías del catálogo, con sus subcategorías, que caen en esta zona. */
  categories: string[];
  hotspot: { x: number; y: number };
}

export const zones: Zone[] = [
  {
    id: "iluminacion",
    label: "Iluminación",
    detail: "Faros, neblineros y luces posteriores.",
    categories: ["iluminacion"],
    hotspot: { x: 30, y: 118 },
  },
  {
    id: "electrico",
    label: "Eléctrico y batería",
    detail: "Batería, alternador, arrancador y sensores.",
    categories: ["electrico"],
    hotspot: { x: 64, y: 98 },
  },
  {
    id: "motor",
    label: "Motor y filtros",
    detail: "Bujías, distribución y filtros de aceite, aire y combustible.",
    categories: ["motor", "filtros"],
    hotspot: { x: 101, y: 120 },
  },
  {
    id: "frenos",
    label: "Sistema de frenos",
    detail: "Pastillas, discos, tambores, bombas y líquido.",
    categories: ["frenos"],
    hotspot: { x: 105, y: 152 },
  },
  {
    id: "suspension",
    label: "Suspensión y dirección",
    detail: "Amortiguadores, rótulas, terminales y bujes.",
    categories: ["suspension"],
    hotspot: { x: 154, y: 141 },
  },
  {
    id: "transmision",
    label: "Transmisión y embrague",
    detail: "Kits de embrague, volantes y semiejes.",
    categories: ["transmision"],
    hotspot: { x: 207, y: 149 },
  },
  {
    id: "carroceria",
    label: "Carrocería y exterior",
    detail: "Espejos, parachoques, manijas y accesorios.",
    categories: ["carroceria"],
    hotspot: { x: 212, y: 70 },
  },
];

export interface ZonePart {
  product: Product;
  /** `exacta` cuando la ficha declara este vehículo; `universal` cuando la pieza no depende del modelo. */
  match: "exacta" | "universal";
}

export interface ZoneResult extends Zone {
  parts: ZonePart[];
  /** Piezas con stock disponible ahora mismo. */
  available: number;
}

/**
 * Cruza el vehículo con el catálogo y devuelve, por zona, las piezas que le
 * corresponden. Una pieza sin compatibilidades declaradas se considera universal
 * en lugar de descartarla, porque aplica a cualquier vehículo.
 */
export function teardown(vehicle: Pick<VehicleRecord, "make" | "model" | "year">): ZoneResult[] {
  const query = { make: vehicle.make, model: vehicle.model, year: vehicle.year };

  return zones.map((zone) => {
    const ids = new Set(zone.categories.flatMap((c) => categoryTree(c)));
    const parts = products
      .filter((p) => ids.has(p.categoryId))
      .map((product) => ({ product, fit: fitsVehicle(product, query) }))
      .filter((entry) => entry.fit !== false)
      .map<ZonePart>(({ product, fit }) => ({ product, match: fit === true ? "exacta" : "universal" }))
      // Primero las compatibilidades exactas, y dentro de ellas lo que hay en stock.
      .sort((a, b) => {
        if (a.match !== b.match) return a.match === "exacta" ? -1 : 1;
        if ((a.product.stock > 0) !== (b.product.stock > 0)) return a.product.stock > 0 ? -1 : 1;
        return b.product.soldCount - a.product.soldCount;
      });

    return { ...zone, parts, available: parts.filter((p) => p.product.stock > 0).length };
  });
}

export function teardownTotals(result: ZoneResult[]) {
  const all = result.flatMap((z) => z.parts);
  return {
    total: all.length,
    exact: all.filter((p) => p.match === "exacta").length,
    available: all.filter((p) => p.product.stock > 0).length,
    zonesWithParts: result.filter((z) => z.parts.length > 0).length,
  };
}
