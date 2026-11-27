"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { products } from "@/data/products";
import { useCart } from "@/components/cart/cart-provider";
import { useFavorites } from "@/components/favorites/favorites-provider";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { stockState } from "@/lib/catalog";

export default function FavoritesPage() {
  const { ids, hydrated, clear } = useFavorites();
  const cart = useCart();

  // El orden lo manda la lista guardada, no el catálogo: lo último que marcaste
  // va primero.
  const saved = ids.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined);
  const disponibles = saved.filter((p) => p.stock > 0);

  if (!hydrated) {
    return <div className="container-x py-16 text-sm text-muted">Cargando tus favoritos…</div>;
  }

  if (saved.length === 0) {
    return (
      <div className="container-x flex flex-col items-center gap-4 py-24 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-white shadow-card">
          <Heart className="size-9 text-muted" strokeWidth={1.6} />
        </span>
        <h1 className="text-3xl font-bold tracking-tight">Todavía no guardaste nada</h1>
        <p className="m-0 max-w-[440px] text-muted">
          Toca el corazón de cualquier repuesto para dejarlo aquí y compararlo con calma antes de comprar.
        </p>
        <Link href="/catalogo" className="btn-primary mt-2">
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x flex flex-col gap-6 py-6 pb-20">
      <Breadcrumbs items={[{ label: "Favoritos" }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kicker">Favoritos</span>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight sm:text-[36px]">Tus repuestos guardados</h1>
          <p className="mt-1.5 text-[15px] text-muted">
            {saved.length} {saved.length === 1 ? "repuesto guardado" : "repuestos guardados"}
            {disponibles.length < saved.length ? ` · ${saved.length - disponibles.length} sin stock` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {disponibles.length > 0 && (
            <button
              type="button"
              onClick={() => {
                for (const p of disponibles) cart.add(p.id);
                cart.notify(
                  "Favoritos agregados al carrito",
                  `${disponibles.length} ${disponibles.length === 1 ? "repuesto" : "repuestos"} con stock`,
                );
              }}
              className="btn-primary h-10"
            >
              <ShoppingCart className="size-4" />
              Agregar los {disponibles.length} con stock
            </button>
          )}
          <button type="button" onClick={clear} className="btn-outline h-10">
            <Trash2 className="size-4" />
            Vaciar la lista
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {saved.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <p className="m-0 text-[13px] text-muted">
        La lista se guarda en este navegador, así que no te sigue al celular todavía.{" "}
        {saved.some((p) => stockState(p).tone === "muted")
          ? "Los repuestos sin stock se quedan aquí para que los recuperes cuando vuelvan."
          : ""}
      </p>
    </div>
  );
}
