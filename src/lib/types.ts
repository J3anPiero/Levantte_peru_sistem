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
  /**
   * Slug del tipo de pieza en la nomenclatura (src/data/part-types.ts).
   * Queda sin definir cuando la nomenclatura no tiene un equivalente exacto.
   */
  partType?: string;
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
  /** Costo de reposición. Solo se usa en el panel; nunca llega a la tienda. */
  cost?: number;
  /**
   * `true` mientras el precio sea un marcador de posición, es decir, mientras el
   * SKU no aparezca en src/data/precios.csv. La tienda no lo muestra: sirve
   * para que el panel sepa qué falta cargar antes de publicar.
   */
  priceEstimated?: boolean;
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
