/*
 * Genera src/data/products-generated.ts: el grueso del catálogo.
 *
 *   node scripts/generar-productos.mjs
 *
 * Qué está fundado en datos reales y qué no:
 *
 *   REAL  El nombre técnico de cada pieza y su slug salen de la nomenclatura de
 *         car-api (data-source/car-parts.json).
 *   REAL  La compatibilidad sale de las generaciones declaradas en
 *         data-source/car-brands.json: cada producto se lista para la
 *         generación concreta de un modelo, con su rango de años.
 *   REAL  Las marcas de repuesto son fabricantes que existen y que fabrican esa
 *         familia de pieza; ninguna plantilla asigna, por ejemplo, filtros a
 *         Brembo.
 *   NO    Los precios son marcadores de posición. La banda de cada familia está
 *         tomada de precios de venta al público observados en el mercado
 *         peruano (ver BANDAS más abajo), pero el precio concreto de cada
 *         producto se sortea dentro de esa banda: sirve para que la tienda se
 *         vea coherente, no para cobrar. El precio real se carga por SKU en
 *         src/data/precios.csv y pisa a este; mientras no esté ahí, el producto
 *         queda marcado como `priceEstimated` para el panel.
 *   NO    El stock es de muestra.
 *   NO    No se generan números OEM ni referencias de fabricante. Inventar un
 *         número de parte es el error más caro de una tienda de repuestos:
 *         hace que el cliente compre una pieza que no calza. Se cargan desde el
 *         catálogo del proveedor.
 *
 * La generación es determinista: la misma entrada produce siempre el mismo
 * archivo, así que el diff solo cambia cuando cambian los datos o las reglas.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const carBrands = read("data-source/car-brands.json");
const carParts = read("data-source/car-parts.json");
const partName = new Map(carParts.map((p) => [p.slug, p.name]));

/* ------------------------------------------------- aleatoriedad reproducible */

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Generador con semilla: mismos datos de entrada, mismo catálogo de salida. */
function rng(seed) {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (rand, list) => list[Math.floor(rand() * list.length)];
const between = (rand, min, max) => min + rand() * (max - min);

/* ------------------------------------------------------------- vehículos */

/** Modelos con presencia real en el parque automotor peruano. */
const targetVehicles = [
  ["Toyota", "Hilux"],
  ["Toyota", "Corolla"],
  ["Toyota", "Yaris"],
  ["Toyota", "RAV4"],
  ["Toyota", "Fortuner"],
  ["Toyota", "Land Cruiser Prado"],
  ["Hyundai", "Tucson"],
  ["Hyundai", "Accent"],
  ["Hyundai", "Elantra"],
  ["Hyundai", "Santa Fe"],
  ["Kia", "Rio"],
  ["Kia", "Sportage"],
  ["Kia", "Cerato"],
  ["Nissan", "Sentra"],
  ["Nissan", "Versa"],
  ["Nissan", "Frontier"],
  ["Nissan", "X-Trail"],
  ["Chevrolet", "Sail"],
  ["Chevrolet", "Spark"],
  ["Suzuki", "Swift"],
  ["Suzuki", "Vitara"],
  ["Mitsubishi", "L200"],
  ["Honda", "Civic"],
  ["Honda", "CR-V"],
  ["Mazda", "Mazda 3"],
  ["Volkswagen", "Gol"],
];

const CURRENT_YEAR = 2026;

/**
 * Aplicaciones: una por generación reciente de cada modelo objetivo. Se
 * descartan las generaciones que terminaron hace más de 25 años, porque para
 * esas ya casi no se pide repuesto.
 */
const applications = [];
for (const [make, model] of targetVehicles) {
  const brand = carBrands.find((b) => b.brand === make);
  const found = brand?.models.find((m) => m.name === model);
  const generations = found?.generations ?? [];
  if (!generations.length) {
    // Los modelos que el origen no trae (añadidos para el mercado peruano) no
    // tienen generaciones: se listan como un rango único y abierto.
    applications.push({ make, model, generation: null, yearFrom: 2010, yearTo: null });
    continue;
  }
  for (const g of generations) {
    const end = g.yearTo ?? CURRENT_YEAR;
    if (end < CURRENT_YEAR - 25) continue;
    applications.push({ make, model, generation: g.name, yearFrom: g.yearFrom, yearTo: g.yearTo });
  }
}

/* ------------------------------------------------------------ plantillas */

const ORIGINAL_BY_MAKE = {
  Toyota: "toyota-genuine",
  Hyundai: "hyundai-mobis",
  Kia: "kia-genuine",
  Nissan: "nissan-genuine",
};

/*
 * BANDAS DE PRECIO
 *
 * Las familias marcadas con `banda: "mercado"` tienen su rango tomado de
 * precios de venta al público publicados por tiendas peruanas y por Mercado
 * Libre Perú, consultados en noviembre de 2026. Son precios de anuncio, no de
 * compra verificada, y varían por motor, año y marca:
 *
 *   Pastillas de freno       S/ 80 – 215   genéricas desde 80; Fritec 150; Nikmat 215
 *   Discos de freno          S/ 160 – 585  March/Versa 160; CX-5 585; Santa Fe 463
 *   Bujías (juego de 4)      S/ 60 – 360   cobre 60–120, platino 120–200, iridio 200–360
 *   Kit de distribución      S/ 520 – 1700 Hilux 3.0 523; K2700 651; Amarok 741
 *   Kit de embrague          S/ 235 – 1350 Atos/Eon 235; Yaris 430; Hilux 1GD 1350
 *   Filtro de aceite         S/ 12 – 51    Bosch 18–27 en tienda; Mann 25–37
 *   Filtro de aire           S/ 40 – 137   Bosch 40; Mann CF600/1 69; C23610 137
 *   Amortiguador (unidad)    S/ 250 – 500  Hilux KYB 360; Sentra 365; CR-V 495
 *   Rótulas y terminales     S/ 18 – 240   GMB/CTR 76–78; Accent interior 184
 *   Faro delantero           S/ 348 – 1940 Sentra B13 348; Sportage 1390; Prisma LED 1940
 *   Batería 12 V             S/ 293 – 340  Etna HL-11 294; Etna W-13 310; Capsa 340
 *
 * Las familias sin esa marca conservan una banda estimada: no encontré precios
 * peruanos publicados para alternadores, arrancadores, bombas de agua, espejos
 * ni sensores de autos livianos. Las tiendas que los listan piden cotización
 * por placa o por código OEM. Quedan como estimación declarada hasta que entre
 * la lista del proveedor.
 *
 * Nada de esto es el precio de GAUDI: el margen y la lista final se cargan por
 * SKU en src/data/precios.csv.
 */

/**
 * Cada plantilla describe una familia de pieza: a qué categoría pertenece, qué
 * fabricantes la hacen, en qué banda de precio se mueve y qué ficha técnica
 * aplica. `oem` se deja siempre vacío a propósito.
 */
const templates = [
  // Frenos
  { slug: "brake-pad-set-front", cat: "pastillas-de-freno", kind: "pads", pos: "delantero", price: [90, 240], banda: "mercado", warranty: 12, brands: ["bosch", "brembo", "trw", "akebono", "ferodo", "delphi"], original: true, apps: 6,
    specs: (r) => [["Material", pick(r, ["Cerámico, sin asbesto", "Semimetálico", "Orgánico de baja abrasión"])], ["Contenido", "4 pastillas + láminas antirruido"]] },
  { slug: "brake-pad-set-rear", cat: "pastillas-de-freno", kind: "pads", pos: "posterior", price: [85, 210], banda: "mercado", warranty: 12, brands: ["bosch", "brembo", "trw", "ferodo", "delphi"], original: true, apps: 5,
    specs: (r) => [["Material", pick(r, ["Cerámico, sin asbesto", "Semimetálico"])], ["Contenido", "4 pastillas"]] },
  { slug: "front-brake-disc", cat: "discos-de-freno", kind: "disc", pos: "delantero", price: [160, 480], banda: "mercado", warranty: 12, brands: ["brembo", "bosch", "trw", "delphi"], original: true, apps: 6,
    specs: (r) => [["Tipo", pick(r, ["Ventilado", "Sólido"])], ["Acabado", "Recubrimiento anticorrosión"]] },
  { slug: "rear-brake-disc", cat: "discos-de-freno", kind: "disc", pos: "posterior", price: [150, 430], banda: "mercado", warranty: 12, brands: ["brembo", "bosch", "trw"], apps: 4,
    specs: () => [["Tipo", "Sólido"]] },
  { slug: "brake-drum", cat: "tambores-y-zapatas", kind: "disc", pos: "posterior", price: [160, 420], warranty: 12, brands: ["bosch", "trw"], apps: 3, specs: () => [["Material", "Fundición gris"]] },
  { slug: "brake-master-cylinder", cat: "cilindros-y-bombas", kind: "kit", price: [180, 540], warranty: 12, brands: ["bosch", "trw", "delphi"], apps: 3, specs: () => [["Montaje", "Con depósito"]] },
  { slug: "front-brake-caliper", cat: "cilindros-y-bombas", kind: "kit", pos: "delantero", price: [320, 880], warranty: 12, brands: ["brembo", "trw", "bosch"], apps: 3, specs: () => [["Estado", "Nuevo, no remanufacturado"]] },
  { slug: "brake-pad-wear-sensor", cat: "pastillas-de-freno", kind: "sensor", pos: "delantero", price: [30, 85], warranty: 12, brands: ["bosch", "trw", "febi"], original: true, apps: 3, specs: () => [] },

  // Motor
  { slug: "spark-plug-set", cat: "bujias", kind: "plug", price: [70, 340], banda: "mercado", warranty: 12, brands: ["ngk", "denso", "bosch", "champion"], apps: 6,
    specs: (r) => [["Electrodo", pick(r, ["Iridio", "Platino", "Níquel"])], ["Contenido", "Juego de 4"]] },
  { slug: "ignition-coil", cat: "bujias", kind: "sensor", price: [120, 380], warranty: 12, brands: ["denso", "bosch", "ngk", "delphi"], apps: 4, specs: () => [["Tipo", "Bobina individual (lápiz)"]] },
  { slug: "timing-belt-kit", cat: "distribucion", kind: "belt", price: [480, 1250], banda: "mercado", warranty: 12, brands: ["gates", "dayco", "continental", "skf"], apps: 5, specs: () => [["Contenido", "Correa + tensor + poleas"]] },
  { slug: "timing-chain-kit", cat: "distribucion", kind: "belt", price: [700, 1700], banda: "mercado", warranty: 12, brands: ["aisin", "febi", "skf"], apps: 3, specs: () => [["Contenido", "Cadena + tensor + guías"]] },
  { slug: "alternator-belt", cat: "distribucion", kind: "belt", price: [45, 150], warranty: 6, brands: ["gates", "dayco", "continental", "bosch"], apps: 5, specs: () => [["Tipo", "Poli V estriada"]] },
  { slug: "water-pump", cat: "refrigeracion", kind: "kit", price: [160, 450], warranty: 12, brands: ["gmb", "aisin", "gates", "skf"], apps: 5, specs: () => [["Incluye", "Empaquetadura"]] },
  { slug: "thermostat", cat: "refrigeracion", kind: "kit", price: [60, 190], warranty: 12, brands: ["wahler", "gates", "mahle"], apps: 4, specs: (r) => [["Apertura", `${pick(r, [82, 85, 88])} °C`]] },
  { slug: "engine-mount", cat: "soportes-de-motor", kind: "kit", price: [90, 320], warranty: 12, brands: ["corteco", "febi", "moog"], apps: 4, specs: () => [["Material", "Caucho y metal"]] },

  // Filtros
  { slug: "oil-filter", cat: "filtros-de-aceite", kind: "filter", price: [18, 60], banda: "mercado", warranty: 6, brands: ["mann-filter", "mahle", "hengst", "bosch", "denso"], original: true, apps: 7, specs: () => [["Tipo", "Roscado con válvula antirretorno"]] },
  { slug: "air-filter", cat: "filtros-de-aire", kind: "airfilter", price: [40, 140], banda: "mercado", warranty: 6, brands: ["mann-filter", "mahle", "hengst", "bosch"], apps: 7, specs: () => [["Tipo", "Panel con sello de poliuretano"]] },
  { slug: "cabin-air-filter", cat: "filtros-de-cabina", kind: "airfilter", price: [35, 110], warranty: 6, brands: ["mann-filter", "corteco", "mahle", "bosch"], apps: 6, specs: (r) => [["Tipo", pick(r, ["Partículas", "Carbón activado"])]] },
  { slug: "fuel-filter", cat: "filtros-de-combustible", kind: "filter", price: [45, 160], warranty: 6, brands: ["mann-filter", "bosch", "delphi", "hengst"], apps: 5, specs: () => [["Montaje", "En línea"]] },

  // Suspensión y dirección
  { slug: "front-shock-absorber", cat: "amortiguadores", kind: "shock", pos: "delantero", price: [180, 520], banda: "mercado", warranty: 12, brands: ["kyb", "monroe", "sachs", "bosch"], apps: 6, specs: (r) => [["Tipo", pick(r, ["Gas, doble tubo", "Gas, monotubo"])], ["Unidad", "Vendido por pieza"]] },
  { slug: "rear-shock-absorber", cat: "amortiguadores", kind: "shock", pos: "posterior", price: [160, 460], banda: "mercado", warranty: 12, brands: ["kyb", "monroe", "sachs"], apps: 5, specs: () => [["Unidad", "Vendido por pieza"]] },
  { slug: "ball-joint", cat: "rotulas-y-terminales", kind: "kit", price: [50, 200], banda: "mercado", warranty: 12, brands: ["moog", "febi", "trw", "skf"], apps: 5, specs: () => [["Incluye", "Guardapolvo y tuerca"]] },
  { slug: "tie-rod-end", cat: "rotulas-y-terminales", kind: "kit", price: [45, 185], banda: "mercado", warranty: 12, brands: ["moog", "trw", "febi"], apps: 5, specs: () => [["Rosca", "Métrica, según aplicación"]] },
  { slug: "front-sway-bar-link", cat: "rotulas-y-terminales", kind: "kit", pos: "delantero", price: [40, 130], warranty: 12, brands: ["moog", "febi", "trw", "skf"], apps: 5, specs: () => [] },
  { slug: "steering-rack", cat: "direccion", kind: "kit", price: [850, 2400], warranty: 12, brands: ["trw", "bosch", "delphi"], apps: 2, specs: () => [["Estado", "Nueva"]] },

  // Eléctrico
  { slug: "alternator", cat: "alternadores", kind: "battery", price: [480, 1350], warranty: 12, brands: ["bosch", "denso", "valeo", "delphi"], apps: 4, specs: (r) => [["Amperaje", `${pick(r, [70, 90, 100, 120])} A`], ["Voltaje", "12 V"]] },
  { slug: "starter-motor", cat: "arrancadores", kind: "battery", price: [420, 1100], warranty: 12, brands: ["bosch", "denso", "valeo"], apps: 4, specs: (r) => [["Potencia", `${pick(r, ["1.0", "1.4", "2.0"])} kW`], ["Voltaje", "12 V"]] },
  { slug: "oxygen-sensor-lambda", cat: "sensores", kind: "sensor", price: [180, 520], warranty: 12, brands: ["denso", "bosch", "ngk", "delphi"], apps: 4, specs: (r) => [["Cables", String(pick(r, [4, 5]))], ["Posición", pick(r, ["Antes del catalizador", "Después del catalizador"])]] },
  { slug: "abs-sensor", cat: "sensores", kind: "sensor", price: [90, 300], warranty: 12, brands: ["bosch", "delphi", "febi"], apps: 4, specs: () => [["Tipo", "Activo"]] },
  { slug: "fuel-pump", cat: "bombas-de-combustible", kind: "kit", price: [220, 780], warranty: 12, brands: ["bosch", "delphi", "denso"], apps: 4, specs: () => [["Montaje", "En el tanque"]] },

  // Iluminación
  { slug: "right-headlight", cat: "faros", kind: "lamp", price: [320, 1400], banda: "mercado", warranty: 12, brands: ["depo", "hella", "valeo"], apps: 5, specs: (r) => [["Lado", "Derecho (pasajero)"], ["Fuente", pick(r, ["Halógeno H4", "Halógeno H7", "LED"])]] },
  { slug: "left-headlight", cat: "faros", kind: "lamp", price: [320, 1400], banda: "mercado", warranty: 12, brands: ["depo", "hella", "valeo"], apps: 5, specs: (r) => [["Lado", "Izquierdo (conductor)"], ["Fuente", pick(r, ["Halógeno H4", "Halógeno H7", "LED"])]] },
  { slug: "right-fog-light", cat: "neblineros", kind: "lamp", price: [110, 340], warranty: 12, brands: ["depo", "hella", "osram"], apps: 4, specs: () => [["Lado", "Derecho"]] },

  // Transmisión
  { slug: "clutch-kit", cat: "embrague", kind: "clutch", price: [260, 1300], banda: "mercado", warranty: 12, brands: ["exedy", "luk", "valeo", "sachs", "aisin"], apps: 5, specs: () => [["Contenido", "Disco, prensa y collarín"]] },
  { slug: "clutch-release-bearing", cat: "embrague", kind: "clutch", price: [120, 380], warranty: 12, brands: ["exedy", "luk", "skf", "sachs"], apps: 3, specs: () => [] },
  { slug: "outer-cv-joint", cat: "semiejes", kind: "transmission", price: [180, 560], warranty: 12, brands: ["skf", "febi", "gmb"], apps: 4, specs: () => [["Incluye", "Guardapolvo y grasa"]] },

  // Carrocería
  { slug: "right-side-mirror", cat: "espejos", kind: "body", price: [180, 680], warranty: 12, brands: ["depo", "hella"], original: true, apps: 4, specs: (r) => [["Lado", "Derecho"], ["Funciones", pick(r, ["Manual", "Eléctrico", "Eléctrico con direccional"])]] },
  { slug: "left-side-mirror", cat: "espejos", kind: "body", price: [180, 680], warranty: 12, brands: ["depo", "hella"], apps: 4, specs: (r) => [["Lado", "Izquierdo"], ["Funciones", pick(r, ["Manual", "Eléctrico", "Eléctrico con direccional"])]] },
];

/* ------------------------------------------------------------- generación */

const CAT_CODE = {
  "pastillas-de-freno": "FR", "discos-de-freno": "FR", "tambores-y-zapatas": "FR",
  "cilindros-y-bombas": "FR", "liquido-de-frenos": "FR",
  bujias: "EN", distribucion: "EN", refrigeracion: "EN", "soportes-de-motor": "EN",
  "filtros-de-aceite": "FL", "filtros-de-aire": "FL", "filtros-de-cabina": "FL", "filtros-de-combustible": "FL",
  amortiguadores: "SU", "rotulas-y-terminales": "SU", direccion: "SU",
  baterias: "EL", alternadores: "EL", arrancadores: "EL", sensores: "EL", "bombas-de-combustible": "EL",
  faros: "IL", neblineros: "IL",
  embrague: "TR", semiejes: "TR",
  espejos: "CA",
};

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const BRAND_LABEL = {
  bosch: "Bosch", brembo: "Brembo", trw: "TRW", akebono: "Akebono", ferodo: "Ferodo",
  "mann-filter": "Mann-Filter", ngk: "NGK", gates: "Gates", kyb: "KYB", depo: "Depo",
  valeo: "Valeo", exedy: "Exedy", denso: "Denso", aisin: "Aisin", luk: "LuK", sachs: "Sachs",
  monroe: "Monroe", skf: "SKF", mahle: "Mahle", hengst: "Hengst", champion: "Champion",
  delphi: "Delphi", corteco: "Corteco", dayco: "Dayco", continental: "Continental",
  hella: "Hella", osram: "Osram", moog: "Moog", gmb: "GMB", wahler: "Wahler", febi: "Febi",
  "toyota-genuine": "Toyota Genuine", "hyundai-mobis": "Hyundai Mobis",
  "kia-genuine": "Kia Genuine", "nissan-genuine": "Nissan Genuine",
};

const products = [];
const usedSlugs = new Set();
let serial = 10000;

for (const t of templates) {
  const name = partName.get(t.slug);
  if (!name) throw new Error(`El slug ${t.slug} no existe en la nomenclatura`);

  // Aplicaciones distintas por plantilla, elegidas de forma estable.
  const r = rng(`app:${t.slug}`);
  const pool = applications.slice().sort(() => r() - 0.5).slice(0, t.apps);

  for (const app of pool) {
    const rand = rng(`${t.slug}|${app.make}|${app.model}|${app.generation ?? "-"}`);

    // Si el fabricante del vehículo tiene línea original y la plantilla la
    // admite, una de cada cuatro aplicaciones usa el repuesto original.
    const originalId = ORIGINAL_BY_MAKE[app.make];
    const useOriginal = Boolean(t.original && originalId && rand() < 0.25);
    const brandId = useOriginal ? originalId : pick(rand, t.brands);
    const type = useOriginal ? "original" : "alternativo";

    const years = app.yearTo ? `${app.yearFrom}-${app.yearTo}` : `${app.yearFrom}+`;
    const fullName = `${name} para ${app.make} ${app.model} ${years}`;
    let slug = slugify(`${name}-${app.make}-${app.model}-${years}`);
    while (usedSlugs.has(slug)) slug += "-b";
    usedSlugs.add(slug);

    // Precio: la banda de la plantilla, con recargo si es pieza original.
    const base = between(rand, t.price[0], t.price[1]) * (useOriginal ? 1.25 : 1);
    const price = Math.round(base / 5) * 5 - 0.1;
    const onSale = rand() < 0.18;
    const compareAtPrice = onSale ? Math.round((price * between(rand, 1.12, 1.3)) / 5) * 5 - 0.1 : undefined;

    const roll = rand();
    const stock = roll < 0.12 ? 0 : roll < 0.28 ? 1 + Math.floor(rand() * 3) : 4 + Math.floor(rand() * 26);
    const soldCount = Math.floor(between(rand, 5, 320));
    const rated = rand() < 0.65;

    serial += 7;
    const code = CAT_CODE[t.cat] ?? "XX";

    products.push({
      id: `g-${code.toLowerCase()}-${serial}`,
      sku: `LP-${code}-${String(serial).padStart(5, "0")}`,
      partType: t.slug,
      slug,
      name: fullName,
      shortName: name,
      description:
        `${name} para ${app.make} ${app.model}` +
        (app.generation ? ` generación ${app.generation}` : "") +
        ` (${years}). Pieza de ${BRAND_LABEL[brandId]}` +
        (type === "original" ? ", línea original del fabricante." : ", equivalente homologado al equipo original.") +
        " Verificamos la compatibilidad con tu vehículo antes de despachar.",
      brandId,
      categoryId: t.cat,
      kind: t.kind,
      type,
      ...(t.pos ? { position: t.pos } : {}),
      price,
      ...(compareAtPrice ? { compareAtPrice } : {}),
      stock,
      stockMin: 4 + Math.floor(rand() * 8),
      ...(stock === 0 ? { leadTimeDays: 3 + Math.floor(rand() * 8) } : {}),
      warrantyMonths: t.warranty,
      specs: [
        ...t.specs(rand).map(([label, value]) => ({ label, value: String(value) })),
        ...(t.pos ? [{ label: "Posición", value: t.pos === "delantero" ? "Eje delantero" : "Eje posterior" }] : []),
      ],
      fits: [
        {
          make: app.make,
          model: app.model,
          yearFrom: app.yearFrom,
          yearTo: app.yearTo ?? CURRENT_YEAR,
          ...(app.generation ? { engine: `Generación ${app.generation}` } : {}),
        },
      ],
      ...(rated ? { rating: { avg: Math.round(between(rand, 4.1, 5) * 10) / 10, count: 3 + Math.floor(rand() * 60) } } : {}),
      soldCount,
      createdAt: `202${4 + Math.floor(rand() * 3)}-${String(1 + Math.floor(rand() * 12)).padStart(2, "0")}-${String(1 + Math.floor(rand() * 28)).padStart(2, "0")}`,
    });
  }
}

products.sort((a, b) => a.sku.localeCompare(b.sku));

const file = `// Archivo generado por scripts/generar-productos.mjs — no editar a mano.
//
// Nombres de pieza y compatibilidades provienen de data-source/ (car-api, MIT).
// PRECIOS Y STOCK SON DE MUESTRA: el precio real se carga por SKU en
// src/data/precios.csv y pisa a este. Mientras un SKU no esté en esa lista, el
// producto queda marcado como priceEstimated y el panel lo cuenta como pendiente.
// No se generan números OEM: se cargan desde el catálogo del proveedor.

import type { Product } from "@/lib/types";

export const generatedProducts: Product[] = ${JSON.stringify(products, null, 2)};
`;

writeFileSync(join(root, "src/data/products-generated.ts"), file, "utf8");

const byCat = {};
for (const p of products) byCat[p.categoryId] = (byCat[p.categoryId] ?? 0) + 1;
console.log(`Productos generados: ${products.length}`);
console.log(`Aplicaciones disponibles: ${applications.length}`);
console.log(`Sin stock: ${products.filter((p) => p.stock === 0).length} · En oferta: ${products.filter((p) => p.compareAtPrice).length}`);

const marketTemplates = templates.filter((t) => t.banda === "mercado");
const marketSlugs = new Set(marketTemplates.map((t) => t.slug));
const withMarketBand = products.filter((p) => marketSlugs.has(p.partType)).length;
console.log(
  `Bandas de precio: ${marketTemplates.length} de ${templates.length} familias con referencia de mercado ` +
    `(${withMarketBand} de ${products.length} productos). El resto queda con banda estimada.`,
);
console.log("Por categoría:", Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(" "));
