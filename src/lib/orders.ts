import type { Order } from "./types";

/**
 * Pedido realizado desde el checkout. Mientras no exista el backend se guarda
 * en sessionStorage para mostrar la página de confirmación.
 */
export interface PlacedOrder extends Order {
  email: string;
  phone: string;
  shippingMethod: string;
  shippingAddress: string;
  estimatedDelivery: string;
  paymentLast4?: string;
  invoiceNumber: string;
}

const KEY = "levante-orders-v1";

export function nextOrderNumber() {
  const year = new Date().getFullYear();
  const seq = Math.floor(4872 + Math.random() * 900);
  return `LP-${year}-${String(seq).padStart(6, "0")}`;
}

export function savePlacedOrder(order: PlacedOrder) {
  try {
    const all = JSON.parse(window.sessionStorage.getItem(KEY) ?? "{}") as Record<string, PlacedOrder>;
    all[order.number] = order;
    window.sessionStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function getPlacedOrder(number: string): PlacedOrder | undefined {
  try {
    const all = JSON.parse(window.sessionStorage.getItem(KEY) ?? "{}") as Record<string, PlacedOrder>;
    return all[number];
  } catch {
    return undefined;
  }
}
