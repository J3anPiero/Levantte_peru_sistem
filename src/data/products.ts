import type { Product } from "@/lib/types";
import { coreProducts } from "./products-core";
import { generatedProducts } from "./products-generated";
import { priceList } from "./price-list";

/*
 * El catálogo tiene dos orígenes:
 *
 *   products-core.ts       Fichas escritas a mano, con número OEM verificado y
 *                          descripción propia. Son la referencia de calidad.
 *   products-generated.ts  Catálogo amplio generado desde la base de car-api
 *                          (scripts/generar-productos.mjs). Nombres y
 *                          compatibilidades reales; stock de muestra, y sin
 *                          número OEM porque inventarlo haría que el cliente
 *                          comprara una pieza que no calza.
 *
 * Las fichas a mano van primero para que ganen en los desempates de orden.
 *
 * Sobre los precios: el precio que viene en esos dos archivos es un marcador
 * dentro de una banda de mercado, no el precio del negocio. El precio real vive
 * en src/data/precios.csv y entra por `price-list.ts`, que lo pisa por SKU.
 * Mientras un SKU no esté en esa lista queda `priceEstimated: true`, que es lo
 * que el panel usa para saber qué falta cargar antes de publicar. La tienda no
 * muestra esa marca: un cliente no tiene por qué ver nuestra contabilidad.
 */
function withRealPrice(product: Product): Product {
  const real = priceList[product.sku];
  if (!real) return { ...product, priceEstimated: true };

  return {
    ...product,
    price: real.price,
    // Un precio confirmado sin precio de lista quita la oferta de muestra: si
    // el negocio no declaró el tachado, no hay descuento que anunciar.
    compareAtPrice: real.compareAtPrice,
    ...(real.cost != null ? { cost: real.cost } : {}),
    priceEstimated: false,
  };
}

export const products: Product[] = [...coreProducts, ...generatedProducts].map(withRealPrice);

/** Productos que todavía esperan su precio real. Se usa en el panel. */
export const productsPendingPrice = products.filter((p) => p.priceEstimated);
