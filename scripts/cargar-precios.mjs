/*
 * Carga la lista de precios del negocio y la convierte en un módulo tipado.
 *
 *   node scripts/cargar-precios.mjs      (o: npm run precios)
 *
 * Entrada   src/data/precios.csv       editado a mano por el negocio
 * Salida    src/data/price-list.ts     generado, no editar
 *
 * Por qué existe este paso en lugar de escribir los precios en los productos:
 *
 *   - El catálogo grande se regenera (scripts/generar-productos.mjs). Si los
 *     precios reales vivieran ahí, cada regeneración los borraría.
 *   - Un CSV lo edita cualquiera en Excel y se revisa en el diff línea por
 *     línea, que es como se audita una lista de precios.
 *   - Un precio en el CSV vale para cualquier producto, generado o escrito a
 *     mano, porque la unión se hace por SKU en src/data/products.ts.
 *
 * El script falla sin escribir nada si encuentra un error, y dice en qué línea
 * está. Un precio mal cargado se cobra mal, así que no se tolera a medias.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSV = "src/data/precios.csv";
const OUT = "src/data/price-list.ts";

/* --------------------------------------------- SKU existentes en el catálogo */

/**
 * Los SKU se leen de los archivos de datos con una expresión regular en vez de
 * importarlos: son TypeScript y este script corre en Node pelado. El formato es
 * estable (`sku: "LP-..."`) porque uno lo genera el script hermano y el otro
 * sigue la misma forma.
 */
function catalogSkus() {
  const skus = new Set();
  for (const file of ["src/data/products-core.ts", "src/data/products-generated.ts"]) {
    const text = readFileSync(join(root, file), "utf8");
    for (const m of text.matchAll(/"sku":\s*"([^"]+)"|sku:\s*"([^"]+)"/g)) {
      skus.add(m[1] ?? m[2]);
    }
  }
  if (!skus.size) throw new Error("No se encontró ningún SKU en src/data. ¿Cambió el formato de los archivos?");
  return skus;
}

/* ------------------------------------------------------------------ parseo */

const num = (raw) => {
  // Se acepta "1,250.50" y "1250.50": en una lista hecha en Excel el separador
  // de miles aparece solo.
  const clean = raw.replace(/\s/g, "").replace(/,(?=\d{3}\b)/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
  return Number(clean);
};

function parse(text, skus) {
  const errors = [];
  const entries = new Map();
  const lines = text.split(/\r?\n/);
  let seenHeader = false;

  lines.forEach((line, i) => {
    const n = i + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const cells = trimmed.split(",").map((c) => c.trim());

    if (!seenHeader) {
      seenHeader = true;
      if (cells[0].toLowerCase() === "sku") return; // cabecera
      errors.push(`Línea ${n}: la primera fila con datos debe ser la cabecera "sku,precio,precio_lista,costo".`);
      return;
    }

    const [sku, precio, lista, costo] = cells;

    if (!sku) return errors.push(`Línea ${n}: falta el SKU.`);
    if (sku.toLowerCase() === "sku") {
      // Pasa al pegar dos listas una debajo de la otra. Sin este mensaje el
      // error dice "el SKU sku no existe", que no ayuda a encontrarlo.
      return errors.push(`Línea ${n}: hay una segunda fila de cabecera. Déjala solo al inicio del archivo.`);
    }
    if (!skus.has(sku)) return errors.push(`Línea ${n}: el SKU ${sku} no existe en el catálogo.`);
    if (entries.has(sku)) return errors.push(`Línea ${n}: el SKU ${sku} ya estaba en la lista.`);

    const price = num(precio ?? "");
    if (price === null) return errors.push(`Línea ${n}: "${precio ?? ""}" no es un precio válido para ${sku}.`);
    if (price <= 0) return errors.push(`Línea ${n}: el precio de ${sku} tiene que ser mayor que cero.`);

    const entry = { price };

    if (lista) {
      const compareAt = num(lista);
      if (compareAt === null) return errors.push(`Línea ${n}: "${lista}" no es un precio de lista válido para ${sku}.`);
      // Un precio tachado por debajo del de venta muestra un descuento negativo
      // en la ficha, que es peor que no mostrar oferta.
      if (compareAt <= price) {
        return errors.push(`Línea ${n}: el precio de lista de ${sku} (${lista}) debe ser mayor que el de venta (${precio}).`);
      }
      entry.compareAtPrice = compareAt;
    }

    if (costo) {
      const cost = num(costo);
      if (cost === null) return errors.push(`Línea ${n}: "${costo}" no es un costo válido para ${sku}.`);
      if (cost > price) {
        console.warn(`  Aviso · línea ${n}: ${sku} se vendería por debajo del costo (${precio} < ${costo}).`);
      }
      entry.cost = cost;
    }

    entries.set(sku, entry);
  });

  return { entries, errors };
}

/* ------------------------------------------------------------------- salida */

const skus = catalogSkus();

if (!existsSync(join(root, CSV))) {
  console.error(`No existe ${CSV}. Créalo con la cabecera "sku,precio,precio_lista,costo".`);
  process.exit(1);
}

const { entries, errors } = parse(readFileSync(join(root, CSV), "utf8"), skus);

if (errors.length) {
  console.error(`\n${CSV} tiene ${errors.length} error(es). No se escribió nada:\n`);
  for (const e of errors) console.error(`  ${e}`);
  console.error("");
  process.exit(1);
}

const sorted = [...entries.entries()].sort((a, b) => a[0].localeCompare(b[0]));

const body = sorted.length
  ? sorted
      .map(([sku, e]) => {
        const parts = [`price: ${e.price}`];
        if (e.compareAtPrice != null) parts.push(`compareAtPrice: ${e.compareAtPrice}`);
        if (e.cost != null) parts.push(`cost: ${e.cost}`);
        return `  "${sku}": { ${parts.join(", ")} },`;
      })
      .join("\n")
  : "  /* Vacío: todos los precios del catálogo siguen siendo marcadores. */";

writeFileSync(
  join(root, OUT),
  `// Archivo generado por scripts/cargar-precios.mjs — no editar a mano.
// La fuente es src/data/precios.csv. Para regenerarlo: npm run precios

export interface PriceEntry {
  /** Precio de venta al público en soles, con IGV. */
  price: number;
  /** Precio tachado, para mostrar una oferta. */
  compareAtPrice?: number;
  /** Costo de reposición; solo se usa en el panel. */
  cost?: number;
}

/** Precios confirmados por el negocio, indexados por SKU. */
export const priceList: Record<string, PriceEntry> = {
${body}
};
`,
  "utf8",
);

const pending = skus.size - entries.size;
console.log(`Precios confirmados: ${entries.size} de ${skus.size} SKU`);
console.log(`Pendientes con marcador: ${pending}`);
if (pending) {
  console.log(`\nAgrega las filas que falten en ${CSV} y vuelve a correr "npm run precios".`);
}
