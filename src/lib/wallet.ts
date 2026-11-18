import { round2 } from "./format";

/** Tipo de cliente. Los mecánicos y talleres acceden al cashback más alto. */
export type CustomerType = "persona" | "mecanico";

export type TierId = "regular" | "mayor" | "frecuente";

export interface Tier {
  id: TierId;
  label: string;
  /** Porcentaje sobre el monto de la compra, sin contar el envío. */
  rate: number;
  /** Tope de cashback por compra, en soles. */
  cap: number;
  detail: string;
}

/**
 * Niveles de cashback del programa de fidelización.
 * Las tasas y topes siguen la tabla comercial acordada: las compras regulares y
 * los repuestos originales tienen el margen más ajustado, los alternativos y las
 * compras grandes permiten devolver más, y los talleres reciben el máximo porque
 * compran todas las semanas y recomiendan la tienda.
 */
export const tiers: Record<TierId, Tier> = {
  regular: {
    id: "regular",
    label: "Compra regular",
    rate: 0.025,
    cap: 20,
    detail: "2.5% en compras regulares y repuestos originales, hasta S/ 20 por pedido.",
  },
  mayor: {
    id: "mayor",
    label: "Compra mayor",
    rate: 0.05,
    cap: 40,
    detail: "5% en compras grandes o con repuestos alternativos, hasta S/ 40 por pedido.",
  },
  frecuente: {
    id: "frecuente",
    label: "Taller o mecánico",
    rate: 0.07,
    cap: 80,
    detail: "7% para talleres y mecánicos registrados, hasta S/ 80 por pedido.",
  },
};

/** Porcentaje legible, sin decimales sobrantes: 0.025 da "2.5%" y 0.05 da "5%". */
export function formatRate(rate: number) {
  return `${Math.round(rate * 1000) / 10}%`;
}

/** Monto desde el cual un pedido cuenta como "compra mayor". */
export const BIG_PURCHASE_FROM = 500;

/** Proporción del monto en repuestos alternativos que activa el nivel "mayor". */
const ALTERNATIVE_SHARE_THRESHOLD = 0.5;

export interface CashbackInput {
  /** Monto del pedido tras descuentos y sin incluir el envío. */
  amount: number;
  /** Proporción del monto que corresponde a repuestos alternativos, de 0 a 1. */
  alternativeShare: number;
  customerType: CustomerType;
}

export interface CashbackResult {
  tier: Tier;
  /** Cashback a acreditar, ya aplicado el tope. */
  amount: number;
  /** Cuánto habría correspondido sin el tope, para explicarlo en la interfaz. */
  beforeCap: number;
  capped: boolean;
  /** Por qué le tocó este nivel, en lenguaje para el cliente. */
  reason: string;
}

export function resolveCashback({ amount, alternativeShare, customerType }: CashbackInput): CashbackResult {
  let tier = tiers.regular;
  let reason = "Compra regular de repuestos originales.";

  if (customerType === "mecanico") {
    tier = tiers.frecuente;
    reason = "Cuenta de taller o mecánico registrado.";
  } else if (amount >= BIG_PURCHASE_FROM) {
    tier = tiers.mayor;
    reason = `Compra mayor a S/ ${BIG_PURCHASE_FROM}.`;
  } else if (alternativeShare > ALTERNATIVE_SHARE_THRESHOLD) {
    tier = tiers.mayor;
    reason = "La mayor parte del pedido son repuestos alternativos.";
  }

  const beforeCap = round2(Math.max(0, amount) * tier.rate);
  const capped = beforeCap > tier.cap;
  return { tier, amount: round2(Math.min(beforeCap, tier.cap)), beforeCap, capped, reason };
}

export type WalletTxType = "cashback" | "pago" | "ajuste";

export interface WalletTx {
  id: string;
  date: string;
  type: WalletTxType;
  /** Positivo abona a la billetera, negativo descuenta. */
  amount: number;
  note: string;
  orderNumber?: string;
}

export interface Wallet {
  balance: number;
  txs: WalletTx[];
}

/** Cuenta de cliente tal como se guarda. `hash` y `salt` nunca salen del almacenamiento. */
export interface StoredAccount {
  id: string;
  email: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  documento: string;
  customerType: CustomerType;
  createdAt: string;
  salt: string;
  hash: string;
  wallet: Wallet;
}

/** Lo que la aplicación expone del usuario: sin credenciales. */
export type Account = Omit<StoredAccount, "salt" | "hash">;

export function publicAccount({ salt: _salt, hash: _hash, ...rest }: StoredAccount): Account {
  return rest;
}

/** Saldo máximo que se puede usar en un pedido: nunca más que el total a pagar. */
export function maxWalletUse(balance: number, payable: number) {
  return round2(Math.max(0, Math.min(balance, payable)));
}
