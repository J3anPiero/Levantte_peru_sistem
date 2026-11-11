export type PartKind =
  | "pads"
  | "disc"
  | "filter"
  | "airfilter"
  | "plug"
  | "battery"
  | "shock"
  | "lamp"
  | "belt"
  | "fluid"
  | "sensor"
  | "kit"
  | "clutch"
  | "engine"
  | "transmission"
  | "body";

export type PartType = "original" | "alternativo";
export type Position = "delantero" | "posterior";
export type Badge = "nuevo" | "destacado" | "masVendido";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: PartKind;
  parentId?: string;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  type: PartType;
}

export interface VehicleFit {
  make: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  engine?: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  oem?: string;
  ref?: string;
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  brandId: string;
  categoryId: string;
  kind: PartKind;
  type: PartType;
  position?: Position;
  price: number;
  compareAtPrice?: number;
  stock: number;
  stockMin: number;
  leadTimeDays?: number;
  warrantyMonths: number;
  specs: Spec[];
  fits: VehicleFit[];
  badges?: Badge[];
  rating?: { avg: number; count: number };
  soldCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export type OrderStatus =
  | "pagado"
  | "por_validar"
  | "preparando"
  | "en_camino"
  | "entregado"
  | "cancelado";

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  number: string;
  date: string;
  customer: string;
  invoiceType: "boleta" | "factura";
  paymentMethod: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}
