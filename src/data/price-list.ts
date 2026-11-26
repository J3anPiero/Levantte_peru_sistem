// Archivo generado por scripts/cargar-precios.mjs — no editar a mano.
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
  /* Vacío: todos los precios del catálogo siguen siendo marcadores. */
};
