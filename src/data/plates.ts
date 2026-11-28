import { buildVin, normalizePlate, yearCode, type VehicleRecord } from "@/lib/plate";

/*
 * Padrón SINTÉTICO de vehículos para probar el buscador por placa.
 *
 * Ninguna de estas placas corresponde a un vehículo real: las combinaciones se
 * eligieron para cubrir los modelos que tienen piezas en el catálogo, más un
 * caso sin repuestos específicos para ver el comportamiento del desguace cuando
 * no hay stock exacto. Los VIN se arman con códigos de fabricante reales y el
 * dígito verificador calculado, así que pasan la validación del estándar aunque
 * el número no pertenezca a ningún vehículo.
 */

interface Seed extends Omit<VehicleRecord, "vin"> {
  wmi: string;
  vds: string;
  serial: string;
}

const seeds: Seed[] = [
  {
    plate: "V1A-234",
    make: "Toyota",
    model: "Hilux",
    year: 2019,
    engine: "2.4 D-4D",
    fuel: "Diésel",
    transmission: "Manual",
    bodyType: "Pickup doble cabina",
    color: "Gris plata",
    plant: "Z",
    wmi: "MR0",
    vds: "HA8ED",
    serial: "417620",
  },
  {
    plate: "X9Z-001",
    make: "Toyota",
    model: "Fortuner",
    year: 2021,
    engine: "2.8 D-4D",
    fuel: "Diésel",
    transmission: "Automática",
    bodyType: "SUV",
    color: "Gris grafito",
    plant: "Z",
    wmi: "MR0",
    vds: "GX8EA",
    serial: "558913",
  },
  {
    plate: "ARQ-845",
    make: "Hyundai",
    model: "Tucson",
    year: 2013,
    engine: "2.0 GL",
    fuel: "Gasolina",
    transmission: "Automática",
    bodyType: "SUV",
    color: "Blanco",
    plant: "U",
    wmi: "KMH",
    vds: "JU81B",
    serial: "092744",
  },
  {
    plate: "B2C-118",
    make: "Kia",
    model: "Sportage",
    year: 2018,
    engine: "2.0 LX",
    fuel: "Gasolina",
    transmission: "Automática",
    bodyType: "SUV",
    color: "Negro",
    plant: "5",
    wmi: "KNA",
    vds: "PU81C",
    serial: "331408",
  },
  {
    plate: "D4F-902",
    make: "Nissan",
    model: "Sentra",
    year: 2016,
    engine: "1.6 Sense",
    fuel: "Gasolina",
    transmission: "Automática",
    bodyType: "Sedán",
    color: "Plata",
    plant: "L",
    wmi: "3N1",
    vds: "AB7AP",
    serial: "604177",
  },
  {
    plate: "T7K-330",
    make: "Toyota",
    model: "Corolla",
    year: 2020,
    engine: "1.8 GLi",
    fuel: "Gasolina",
    transmission: "Automática",
    bodyType: "Sedán",
    color: "Blanco perla",
    plant: "B",
    wmi: "9BR",
    vds: "BLWHE",
    serial: "210356",
  },
  {
    plate: "M3P-574",
    make: "Toyota",
    model: "Yaris",
    year: 2016,
    engine: "1.3 XLi",
    fuel: "Gasolina",
    transmission: "Manual",
    bodyType: "Hatchback",
    color: "Rojo",
    plant: "Z",
    wmi: "MR0",
    vds: "KS9AF",
    serial: "148290",
  },
  {
    plate: "C5H-760",
    make: "Chevrolet",
    model: "Sail",
    year: 2017,
    engine: "1.4 LS",
    fuel: "Gasolina",
    transmission: "Manual",
    bodyType: "Sedán",
    color: "Azul",
    plant: "D",
    wmi: "LSG",
    serial: "873025",
    vds: "KA48D",
  },
];

export const vehicleRegistry: Record<string, VehicleRecord> = Object.fromEntries(
  seeds.map(({ wmi, vds, serial, ...vehicle }) => [
    normalizePlate(vehicle.plate),
    {
      ...vehicle,
      vin: buildVin({ wmi, vds, yearCode: yearCode(vehicle.year), plant: vehicle.plant, serial }),
    },
  ]),
);

/**
 * Placas sugeridas en la interfaz para que cualquiera pueda probar el buscador.
 * Llevan carrocería y color porque cada sugerencia se dibuja: ocho placas en
 * fila son ocho cadenas indistinguibles, y la silueta deja ver de un vistazo
 * que hay una pickup, un hatchback y varios sedanes entre ellas.
 */
export const samplePlates = seeds.map((s) => ({
  plate: s.plate,
  label: `${s.make} ${s.model} ${s.year}`,
  bodyType: s.bodyType,
  color: s.color,
}));

/**
 * Punto único de cambio cuando exista el servicio real de consulta vehicular.
 * El retardo simula la latencia de una API para que la interfaz muestre su
 * estado de carga tal como se comportará en producción.
 */
export async function lookupPlate(plate: string): Promise<VehicleRecord | null> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return vehicleRegistry[normalizePlate(plate)] ?? null;
}
