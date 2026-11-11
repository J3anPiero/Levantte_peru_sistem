import type { Brand } from "@/lib/types";

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

/** Vehicle makes the store carries parts for (shown as wordmarks). */
export const vehicleMakes = [
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

export const vehicleModels: Record<string, string[]> = {
  Toyota: ["Hilux", "Fortuner", "Corolla", "Yaris", "RAV4", "Innova"],
  Hyundai: ["Tucson", "Elantra", "Accent", "Santa Fe", "Creta"],
  Kia: ["Sportage", "Rio", "Cerato", "Sorento", "Picanto"],
  Nissan: ["Sentra", "Versa", "Frontier", "X-Trail", "Kicks"],
  Chevrolet: ["Sail", "Spark", "Onix", "Tracker", "D-Max"],
  Suzuki: ["Swift", "Vitara", "Alto", "Baleno", "Jimny"],
  Mitsubishi: ["L200", "Montero", "ASX", "Outlander"],
  Honda: ["Civic", "CR-V", "HR-V", "Fit"],
  Mazda: ["Mazda 3", "CX-5", "Mazda 2", "BT-50"],
  Volkswagen: ["Gol", "Polo", "Amarok", "Tiguan"],
};

export const vehicleYears = Array.from({ length: 22 }, (_, i) => 2026 - i);
