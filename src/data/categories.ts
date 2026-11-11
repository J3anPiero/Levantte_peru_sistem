import type { Category } from "@/lib/types";

export const categories: Category[] = [
  { id: "frenos", slug: "frenos", name: "Frenos", description: "Pastillas, discos, tambores, cilindros y líquido de frenos.", icon: "disc" },
  { id: "motor", slug: "motor", name: "Motor", description: "Bujías, correas, kits de distribución y componentes internos.", icon: "engine" },
  { id: "suspension", slug: "suspension", name: "Suspensión y dirección", description: "Amortiguadores, rótulas, terminales y bujes.", icon: "shock" },
  { id: "filtros", slug: "filtros", name: "Filtros", description: "Filtros de aceite, aire, combustible y cabina.", icon: "filter" },
  { id: "electrico", slug: "electrico", name: "Eléctrico y baterías", description: "Baterías, alternadores, arrancadores y sensores.", icon: "battery" },
  { id: "iluminacion", slug: "iluminacion", name: "Iluminación", description: "Faros, neblineros, luces posteriores y focos.", icon: "lamp" },
  { id: "transmision", slug: "transmision", name: "Transmisión y embrague", description: "Kits de embrague, volantes y semiejes.", icon: "transmission" },
  { id: "carroceria", slug: "carroceria", name: "Carrocería y accesorios", description: "Espejos, parachoques, manijas y accesorios.", icon: "body" },

  { id: "pastillas-de-freno", slug: "pastillas-de-freno", name: "Pastillas de freno", description: "Pastillas delanteras y posteriores, cerámicas y semimetálicas, para todas las marcas.", icon: "pads", parentId: "frenos" },
  { id: "discos-de-freno", slug: "discos-de-freno", name: "Discos de freno", description: "Discos ventilados y sólidos.", icon: "disc", parentId: "frenos" },
  { id: "tambores-y-zapatas", slug: "tambores-y-zapatas", name: "Tambores y zapatas", description: "Sistemas de freno de tambor.", icon: "disc", parentId: "frenos" },
  { id: "cilindros-y-bombas", slug: "cilindros-y-bombas", name: "Cilindros y bombas", description: "Bombas de freno y cilindros de rueda.", icon: "kit", parentId: "frenos" },
  { id: "liquido-de-frenos", slug: "liquido-de-frenos", name: "Líquido de frenos", description: "DOT 3, DOT 4 y DOT 5.1.", icon: "fluid", parentId: "frenos" },

  { id: "bujias", slug: "bujias", name: "Bujías", description: "Bujías de cobre, platino e iridio.", icon: "plug", parentId: "motor" },
  { id: "distribucion", slug: "distribucion", name: "Distribución", description: "Kits de distribución, correas y tensores.", icon: "belt", parentId: "motor" },
  { id: "amortiguadores", slug: "amortiguadores", name: "Amortiguadores", description: "Amortiguadores y struts.", icon: "shock", parentId: "suspension" },
  { id: "filtros-de-aceite", slug: "filtros-de-aceite", name: "Filtros de aceite", description: "", icon: "filter", parentId: "filtros" },
  { id: "filtros-de-aire", slug: "filtros-de-aire", name: "Filtros de aire", description: "", icon: "airfilter", parentId: "filtros" },
  { id: "baterias", slug: "baterias", name: "Baterías", description: "", icon: "battery", parentId: "electrico" },
  { id: "faros", slug: "faros", name: "Faros", description: "", icon: "lamp", parentId: "iluminacion" },
  { id: "embrague", slug: "embrague", name: "Embrague", description: "", icon: "clutch", parentId: "transmision" },
  { id: "espejos", slug: "espejos", name: "Espejos", description: "", icon: "body", parentId: "carroceria" },
];

export const topCategories = categories.filter((c) => !c.parentId);

export function getCategory(slugOrId: string) {
  return categories.find((c) => c.slug === slugOrId || c.id === slugOrId);
}

export function getChildren(categoryId: string) {
  return categories.filter((c) => c.parentId === categoryId);
}

/** Ids of a category plus all of its descendants. */
export function categoryTree(categoryId: string): string[] {
  const ids = [categoryId];
  for (const child of getChildren(categoryId)) ids.push(...categoryTree(child.id));
  return ids;
}
