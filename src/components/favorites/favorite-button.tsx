"use client";

import clsx from "clsx";
import { Heart } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { useFavorites } from "./favorites-provider";
import type { Product } from "@/lib/types";

/**
 * Corazón de favoritos.
 *
 * `card` es el que va encima de la imagen en las rejillas; `panel` el de la
 * ficha, más grande y con borde. Antes de hidratar se pinta apagado: el
 * servidor no sabe qué hay guardado en este navegador y pintar el relleno
 * después provocaría un desajuste de hidratación.
 */
export function FavoriteButton({
  product,
  variant = "card",
  className,
}: {
  product: Product;
  variant?: "card" | "panel";
  className?: string;
}) {
  const { has, toggle, hydrated } = useFavorites();
  const { notify } = useCart();
  const marked = hydrated && has(product.id);
  const name = product.shortName ?? product.name;

  return (
    <button
      type="button"
      aria-label={marked ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`}
      aria-pressed={marked}
      title={marked ? "Quitar de favoritos" : "Guardar en favoritos"}
      onClick={(e) => {
        // En las rejillas el corazón va dentro del enlace de la tarjeta.
        e.preventDefault();
        e.stopPropagation();
        const ahora = toggle(product.id);
        notify(ahora ? "Guardado en favoritos" : "Quitado de favoritos", name);
      }}
      className={clsx(
        "group/fav flex cursor-pointer items-center justify-center transition-all duration-300",
        variant === "card"
          ? "absolute top-3 right-3 z-10 size-9 rounded-full border border-line bg-white/90 opacity-0 backdrop-blur-sm hover:border-brand/50 hover:bg-white focus-visible:opacity-100 group-hover/card:opacity-100 max-md:opacity-100"
          : "size-10 rounded-[10px] border border-line bg-white hover:border-brand/50",
        marked && "border-brand/50 opacity-100",
        className,
      )}
    >
      <Heart
        className={clsx(
          "size-5 transition-transform duration-300 group-hover/fav:scale-110",
          variant === "card" && "size-[18px]",
          marked ? "animate-scale-in fill-brand text-brand" : "text-ink",
        )}
        strokeWidth={1.8}
      />
    </button>
  );
}
