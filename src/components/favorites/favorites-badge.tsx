"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "./favorites-provider";

/** Acceso a favoritos en la cabecera, con el contador de lo guardado. */
export function FavoritesBadge() {
  const { count, hydrated } = useFavorites();
  // Antes de leer localStorage se pinta en cero: el servidor no puede saber el
  // número y pintar otro provocaría un desajuste de hidratación.
  const n = hydrated ? count : 0;

  return (
    <Link
      href="/favoritos"
      aria-label={n > 0 ? `Favoritos, ${n} productos guardados` : "Favoritos"}
      className="group relative flex min-w-16 flex-col items-center gap-1 px-2.5 py-1.5 text-xs text-[#c9c9d2] no-underline transition-colors hover:text-white"
    >
      <Heart
        className="size-[22px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-brand"
        strokeWidth={1.8}
      />
      Favoritos
      {n > 0 && (
        <span
          key={n}
          className="absolute top-0 right-1.5 flex h-[18px] min-w-[18px] animate-scale-in items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white shadow-[0_0_12px_rgba(225,6,0,0.7)]"
        >
          {n}
        </span>
      )}
    </Link>
  );
}
