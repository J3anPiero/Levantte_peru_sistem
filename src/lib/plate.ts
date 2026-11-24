/*
 * Búsqueda por placa y utilidades de VIN.
 *
 * El padrón de vehículos de este módulo es SINTÉTICO: sirve para probar el flujo
 * completo sin depender de un servicio externo. En producción, la consulta de
 * placa a VIN debe resolverse contra una fuente oficial o un proveedor
 * autorizado (en Perú, SUNARP o el MTC), que son datos personales y exigen
 * convenio y base legal para tratarlos. La función `lookupPlate` concentra ese
 * punto de cambio: basta reemplazar su cuerpo por la llamada a la API.
 */

export interface VehicleRecord {
  plate: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  fuel: "Gasolina" | "Diésel" | "GLP" | "Híbrido";
  transmission: "Manual" | "Automática";
  bodyType: string;
  color: string;
  /** Planta de fabricación declarada en el VIN. */
  plant: string;
}

/* ------------------------------------------------------------------ placas */

/** Deja la placa en mayúsculas y sin separadores. */
export function normalizePlate(input: string) {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Formato visual peruano: tres caracteres, guion, tres dígitos. */
export function formatPlate(input: string) {
  const raw = normalizePlate(input).slice(0, 6);
  return raw.length > 3 ? `${raw.slice(0, 3)}-${raw.slice(3)}` : raw;
}

/**
 * Formatos vigentes en Perú para vehículos livianos: tres letras y tres dígitos
 * (ABC-123) o letra, dígito, letra y tres dígitos (A1B-234).
 */
export function isValidPlate(input: string) {
  const raw = normalizePlate(input);
  return /^[A-Z]{3}\d{3}$/.test(raw) || /^[A-Z]\d[A-Z]\d{3}$/.test(raw);
}

/* --------------------------------------------------------------------- VIN */

/** El VIN no usa I, O ni Q para no confundirlas con 1 y 0. */
const VIN_ALPHABET = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";

/** Valores de transliteración del estándar ISO 3779 para el dígito verificador. */
const TRANSLITERATION: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

function valueOf(char: string) {
  if (char >= "0" && char <= "9") return Number(char);
  return TRANSLITERATION[char] ?? 0;
}

/** Dígito verificador que va en la posición 9 del VIN. El resto 10 se escribe "X". */
export function vinCheckDigit(vin17: string) {
  const sum = vin17
    .split("")
    .reduce((acc, char, i) => acc + valueOf(char) * WEIGHTS[i], 0);
  const rest = sum % 11;
  return rest === 10 ? "X" : String(rest);
}

/**
 * Arma un VIN de 17 caracteres y calcula su dígito verificador, de modo que el
 * número generado pase la validación estándar en lugar de ser una cadena al azar.
 */
export function buildVin(parts: { wmi: string; vds: string; yearCode: string; plant: string; serial: string }) {
  const draft = `${parts.wmi}${parts.vds}0${parts.yearCode}${parts.plant}${parts.serial}`;
  if (draft.length !== 17) {
    throw new Error(`VIN inválido: se esperaban 17 caracteres y llegaron ${draft.length}`);
  }
  return `${draft.slice(0, 8)}${vinCheckDigit(draft)}${draft.slice(9)}`;
}

export function isValidVin(vin: string) {
  const value = vin.toUpperCase();
  if (value.length !== 17) return false;
  if (![...value].every((c) => VIN_ALPHABET.includes(c))) return false;
  return vinCheckDigit(value) === value[8];
}

/** Código del año modelo que ocupa la posición 10 del VIN. */
const YEAR_CODES = "ABCDEFGHJKLMNPRSTVWXY123456789";

export function yearCode(year: number) {
  // El ciclo de 30 códigos arrancó en 1980 y se repite; 2010 vuelve a "A".
  return YEAR_CODES[(year - 1980) % 30];
}

/** Descompone el VIN en sus tres bloques, para mostrarlos explicados. */
export function explainVin(vin: string) {
  return {
    wmi: vin.slice(0, 3),
    vds: vin.slice(3, 8),
    check: vin[8],
    yearCode: vin[9],
    plant: vin[10],
    serial: vin.slice(11),
  };
}
