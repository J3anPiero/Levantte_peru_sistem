import type { Product } from "@/lib/types";
import { coreProducts } from "./products-core";
import { generatedProducts } from "./products-generated";

/*
 * El catálogo tiene dos orígenes:
 *
 *   products-core.ts       Fichas escritas a mano, con número OEM verificado y
 *                          descripción propia. Son la referencia de calidad.
 *   products-generated.ts  Catálogo amplio generado desde la base de car-api
 *                          (scripts/generar-productos.mjs). Nombres y
 *                          compatibilidades reales; precios y stock de muestra,
 *                          y sin número OEM porque inventarlo haría que el
 *                          cliente comprara una pieza que no calza.
 *
 * Las fichas a mano van primero para que ganen en los desempates de orden.
 */
export const products: Product[] = [...coreProducts, ...generatedProducts];
