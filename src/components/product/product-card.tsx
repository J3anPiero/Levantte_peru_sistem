import Link from "next/link";
import clsx from "clsx";
import { Check, Info } from "lucide-react";
import type { Product } from "@/lib/types";
import { describeFit, fitsVehicle, productBrand, stockState, type VehicleQuery } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { PartIllustration } from "./part-illustration";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

interface Props {
  product: Product;
  vehicle?: VehicleQuery;
  rank?: number;
  compact?: boolean;
}

export function ProductBadge({ product, rank }: { product: Product; rank?: number }) {
  const base = "absolute top-3 left-3 z-10 rounded-md px-2 py-1 text-[11px] font-bold tracking-[0.08em]";
  if (rank) {
    return <span className={clsx(base, "bg-brand text-white shadow-red")}>{rank === 1 ? "#1 MÁS VENDIDO" : `#${rank}`}</span>;
  }
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  if (product.type === "original") return <span className={clsx(base, "bg-black text-white")}>ORIGINAL</span>;
  if (discount > 0) return <span className={clsx(base, "bg-brand text-white")}>-{discount}%</span>;
  if (product.badges?.includes("nuevo")) return <span className={clsx(base, "bg-ok text-white")}>NUEVO</span>;
  return null;
}

export function StockLabel({ product, className }: { product: Product; className?: string }) {
  const s = stockState(product);
  return (
    <span className={clsx("text-xs font-semibold", s.tone === "ok" && "text-ok", s.tone === "warn" && "text-warn", s.tone === "muted" && "text-muted", className)}>
      {s.tone === "muted" ? "○ " : "● "}
      {s.label}
    </span>
  );
}

export function ProductCard({ product, vehicle, rank, compact }: Props) {
  const brand = productBrand(product);
  const fit = fitsVehicle(product, vehicle);
  const fitLine = product.fits.length
    ? describeFit(product.fits[0]).replace(/ ·.*$/, "") + (product.fits.length > 1 ? ` y ${product.fits.length - 1} más` : "")
    : "Compatible con múltiples modelos";

  return (
    <article className="product-card h-full">
      <Link
        href={`/producto/${product.slug}`}
        className={clsx("product-media relative flex items-center justify-center overflow-hidden bg-mist", compact ? "h-[150px]" : "h-[210px]")}
        aria-label={product.name}
      >
        <ProductBadge product={product} rank={rank} />
        <PartIllustration kind={product.kind} size={compact ? 92 : 128} />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[11px] font-bold tracking-[0.1em] text-muted uppercase">{brand.name}</span>
        <Link href={`/producto/${product.slug}`} className="text-[15px] leading-snug font-semibold text-ink no-underline transition-colors duration-300 hover:text-brand">
          {product.shortName ?? product.name}
        </Link>
        <span className="text-xs text-muted">
          Cód. {product.sku}
          {product.oem ? ` · OEM ${product.oem}` : product.ref ? ` · Ref. ${product.ref}` : ""}
        </span>
        {fit === true ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ok">
            <Check className="size-3.5" strokeWidth={3} />
            Compatible con tu {vehicle?.make} {vehicle?.model} {vehicle?.year}
          </span>
        ) : fit === undefined && vehicle?.make ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
            <Info className="size-3.5" strokeWidth={2.5} />
            Verificar compatibilidad
          </span>
        ) : (
          <span className="text-xs text-muted">{fitLine}</span>
        )}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-display text-xl font-bold">{formatPrice(product.price)}</span>
          {product.compareAtPrice && <span className="text-[13px] text-muted line-through">{formatPrice(product.compareAtPrice)}</span>}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <StockLabel product={product} />
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
