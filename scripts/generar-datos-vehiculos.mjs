/*
 * Genera los módulos de datos del catálogo a partir de la base de car-api
 * (paquete auto-parts-db, licencia MIT; copia en data-source/).
 *
 *   node scripts/generar-datos-vehiculos.mjs
 *
 * Produce dos archivos y no se ejecuta en tiempo de compilación: los archivos
 * generados se versionan, de modo que la aplicación no depende de este script
 * ni de los JSON originales para construirse.
 *
 *   src/data/vehicles.ts    marcas y modelos con su rango de años
 *   src/data/part-types.ts  nomenclatura de piezas (nombre en español, slug en inglés)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const brands = read("data-source/car-brands.json");
const parts = read("data-source/car-parts.json");

/*
 * La base viene del mercado europeo y le faltan modelos muy vendidos en el Perú.
 * Sin estos, los repuestos del catálogo que los declaran como compatibles
 * quedarían huérfanos y el buscador por placa no encontraría el vehículo.
 * Los años son los de comercialización en la región.
 */
const extras = {
  Nissan: [
    { name: "Versa", from: 2006, to: null },
    { name: "Frontier", from: 1997, to: null },
  ],
  Chevrolet: [
    { name: "Sail", from: 2010, to: null },
    { name: "Onix", from: 2012, to: null },
    { name: "D-Max", from: 2002, to: null },
  ],
  Volkswagen: [{ name: "Gol", from: 1980, to: null }],
  Mazda: [
    { name: "Mazda 2", from: 2002, to: null },
    { name: "Mazda 3", from: 2003, to: null },
  ],
};

/**
 * Rango de años de un modelo a partir de sus generaciones.
 * `to` nulo significa que sigue en producción; `from` nulo, que el origen no
 * declara generaciones y no se conoce el rango (dos modelos de Dacia). Inventar
 * una fecha ahí haría que el selector ofreciera años falsos.
 */
function yearRange(generations) {
  if (!generations?.length) return { from: null, to: null };
  const from = Math.min(...generations.map((g) => g.yearFrom));
  const tos = generations.map((g) => g.yearTo);
  return { from, to: tos.includes(null) ? null : Math.max(...tos) };
}

const added = [];
const vehicles = brands
  .map((b) => {
    const models = b.models.map((m) => ({ name: m.name, ...yearRange(m.generations) }));
    for (const extra of extras[b.brand] ?? []) {
      if (!models.some((m) => m.name.toLowerCase() === extra.name.toLowerCase())) {
        models.push(extra);
        added.push(`${b.brand} ${extra.name}`);
      }
    }
    models.sort((a, z) => a.name.localeCompare(z.name, "es"));
    return { brand: b.brand, models };
  })
  .sort((a, z) => a.brand.localeCompare(z.brand, "es"));

// Algunos slugs se repiten en el origen; nos quedamos con la primera aparición.
const seen = new Set();
const partTypes = [];
let duplicates = 0;
for (const p of parts) {
  if (seen.has(p.slug)) {
    duplicates++;
    continue;
  }
  seen.add(p.slug);
  partTypes.push({ slug: p.slug, name: p.name });
}
partTypes.sort((a, z) => a.name.localeCompare(z.name, "es"));

const header = (what) => `// Archivo generado por scripts/generar-datos-vehiculos.mjs — no editar a mano.
// Origen: data-source/car-${what}.json (auto-parts-db, licencia MIT).
`;

writeFileSync(
  join(root, "src/data/vehicles.ts"),
  `${header("brands")}
export interface VehicleModel {
  name: string;
  /** Primer año de fabricación, o null si el origen no lo declara. */
  from: number | null;
  /** Último año, o null si el modelo sigue en producción. */
  to: number | null;
}

export interface VehicleBrand {
  brand: string;
  models: VehicleModel[];
}

export const vehicleBrands: VehicleBrand[] = ${JSON.stringify(vehicles)};
`,
  "utf8",
);

writeFileSync(
  join(root, "src/data/part-types.ts"),
  `${header("parts")}
export interface PartType {
  /** Identificador en inglés, estable entre versiones de la base. */
  slug: string;
  /** Nombre comercial en español. */
  name: string;
}

export const partTypes: PartType[] = ${JSON.stringify(partTypes)};
`,
  "utf8",
);

const modelCount = vehicles.reduce((n, b) => n + b.models.length, 0);
console.log(`Marcas: ${vehicles.length}`);
console.log(`Modelos: ${modelCount} (${added.length} añadidos para el mercado peruano)`);
added.forEach((a) => console.log(`  + ${a}`));
console.log(`Piezas: ${partTypes.length} (${duplicates} duplicados descartados)`);
