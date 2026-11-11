"use client";

import { useState } from "react";
import clsx from "clsx";
import { Heart, ZoomIn } from "lucide-react";
import type { Product } from "@/lib/types";
import { PartIllustration } from "./part-illustration";
import { ProductBadge } from "./product-card";

const views = ["Vista frontal", "Vista lateral", "Juego completo", "Empaque original"];

/**
 * Galería del producto. Las vistas usan la ilustración del tipo de pieza como
 * marcador hasta cargar las fotografías reales (recomendado 1600×1600, WebP).
 */
export function Gallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [fav, setFav] = useState(false);
  return (
    <section aria-label="Galería" className="flex flex-col-reverse gap-3.5 sm:flex-row">
      <div className="flex gap-2.5 sm:flex-col">
        {views.map((v, i) => (
          <button
            key={v}
            type="button"
            aria-label={v}
            aria-pressed={active === i}
            onClick={() => setActive(i)}
            className={clsx("flex size-[72px] cursor-pointer items-center justify-center rounded-[10px] border-2 bg-mist sm:size-[84px]", active === i ? "border-brand" : "border-line hover:border-line-2")}
          >
            <PartIllustration kind={product.kind} size={48} className={clsx(i === 1 && "rotate-90", i === 2 && "scale-75", i === 3 && "opacity-50")} />
          </button>
        ))}
      </div>
      <div className="card relative flex min-h-[320px] flex-1 items-center justify-center sm:min-h-[560px]">
        <ProductBadge product={product} />
        <button
          type="button"
          aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          aria-pressed={fav}
          onClick={() => setFav((v) => !v)}
          className="absolute top-4 right-4 flex size-10 cursor-pointer items-center justify-center rounded-[10px] border border-line bg-white"
        >
          <Heart className={clsx("size-5", fav ? "fill-brand-deep text-brand-deep" : "text-ink")} strokeWidth={1.8} />
        </button>
        <PartIllustration kind={product.kind} size="70%" label={`${product.name}, ${views[active].toLowerCase()}`} className={clsx("max-w-[360px]", active === 1 && "rotate-90", active === 2 && "scale-75", active === 3 && "opacity-50")} />
        <span className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-lg bg-mist px-2.5 py-1.5 text-xs text-muted">
          <ZoomIn className="size-3.5" />
          {views[active]} · Fotografía 1600×1600
        </span>
      </div>
    </section>
  );
}
