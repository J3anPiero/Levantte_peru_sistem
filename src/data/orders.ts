import type { Order } from "@/lib/types";

export const orders: Order[] = [
  {
    number: "LP-2026-004871",
    date: "2026-11-11T10:42:00",
    customer: "Carlos Mendoza",
    invoiceType: "factura",
    paymentMethod: "Tarjeta",
    status: "pagado",
    items: [
      { productId: "p-04512", name: "Pastillas de freno delanteras cerámicas", sku: "LP-FR-04512", qty: 1, unitPrice: 189 },
      { productId: "p-02230", name: "Disco de freno ventilado delantero 296 mm", sku: "LP-FR-02230", qty: 2, unitPrice: 310 },
      { productId: "p-09001", name: "Líquido de frenos DOT 4 · 500 ml", sku: "LP-FR-09001", qty: 1, unitPrice: 28 },
    ],
    subtotal: 837,
    discount: 161.8,
    shipping: 0,
    total: 675.2,
  },
  { number: "LP-2026-004870", date: "2026-11-11T09:15:00", customer: "Taller Rodríguez S.A.C.", invoiceType: "factura", paymentMethod: "Transferencia", status: "por_validar", items: [{ productId: "p-02110", name: "Kit de embrague Exedy", sku: "LP-TR-02110", qty: 2, unitPrice: 890 }, { productId: "p-00230", name: "Filtro de aire C 26 017", sku: "LP-FL-00230", qty: 2, unitPrice: 58 }], subtotal: 1896, discount: 0, shipping: 0, total: 1896 },
  { number: "LP-2026-004869", date: "2026-11-10T18:02:00", customer: "Andrea Quispe", invoiceType: "boleta", paymentMethod: "Yape", status: "en_camino", items: [{ productId: "p-00218", name: "Filtro de aceite W 68/3", sku: "LP-FL-00218", qty: 1, unitPrice: 32.9 }], subtotal: 32.9, discount: 0, shipping: 25, total: 57.9 },
  { number: "LP-2026-004868", date: "2026-11-10T16:40:00", customer: "Luis Paredes", invoiceType: "boleta", paymentMethod: "Tarjeta", status: "preparando", items: [{ productId: "p-00077", name: "Batería S4 60 Ah", sku: "LP-EL-00077", qty: 1, unitPrice: 420 }], subtotal: 420, discount: 0, shipping: 0, total: 420 },
  { number: "LP-2026-004867", date: "2026-11-10T11:20:00", customer: "María Torres", invoiceType: "boleta", paymentMethod: "Contra entrega", status: "entregado", items: [{ productId: "p-01190", name: "Amortiguador delantero Excel-G", sku: "LP-SU-01190", qty: 1, unitPrice: 245 }], subtotal: 245, discount: 0, shipping: 0, total: 245 },
  { number: "LP-2026-004866", date: "2026-11-09T15:05:00", customer: "Autopartes Norte E.I.R.L.", invoiceType: "factura", paymentMethod: "Transferencia", status: "cancelado", items: [{ productId: "p-02230", name: "Disco de freno ventilado delantero 296 mm", sku: "LP-FR-02230", qty: 10, unitPrice: 310 }], subtotal: 3100, discount: 0, shipping: 20, total: 3120 },
];

export const orderStatusLabel: Record<Order["status"], string> = {
  pagado: "Pagado",
  por_validar: "Por validar",
  preparando: "Preparando",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

/** Daily sales for the dashboard chart (soles). Demo data. */
export const dailySales = [
  { day: "29", label: "Mié 29 oct", total: 5460, orders: 21 },
  { day: "30", label: "Jue 30 oct", total: 6410, orders: 24 },
  { day: "31", label: "Vie 31 oct", total: 4620, orders: 17 },
  { day: "1", label: "Sáb 1 nov", total: 7350, orders: 28 },
  { day: "2", label: "Dom 2 nov", total: 6090, orders: 22 },
  { day: "3", label: "Lun 3 nov", total: 3680, orders: 14 },
  { day: "4", label: "Mar 4 nov", total: 2940, orders: 11 },
  { day: "5", label: "Mié 5 nov", total: 6930, orders: 26 },
  { day: "6", label: "Jue 6 nov", total: 7770, orders: 30 },
  { day: "7", label: "Vie 7 nov", total: 6620, orders: 25 },
  { day: "8", label: "Sáb 8 nov", total: 11240, orders: 41 },
  { day: "9", label: "Dom 9 nov", total: 5040, orders: 19 },
  { day: "10", label: "Lun 10 nov", total: 5990, orders: 23 },
  { day: "11", label: "Mar 11 nov", total: 8420, orders: 31 },
];

export const salesByCategory = [
  { name: "Frenos", share: 34 },
  { name: "Motor", share: 21 },
  { name: "Suspensión", share: 15 },
  { name: "Filtros", share: 12 },
  { name: "Eléctrico", share: 9 },
  { name: "Otros", share: 9 },
];
