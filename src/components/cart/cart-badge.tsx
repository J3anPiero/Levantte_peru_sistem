"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartBadge({ compact = false }: { compact?: boolean }) {
  const { count, hydrated } = useCart();
  const n = hydrated ? count : 0;
  return (
    <Link
      href="/carrito"
      aria-label={`Carrito, ${n} productos`}
      className={
        compact
          ? "group relative flex size-11 items-center justify-center text-white no-underline"
          : "group relative flex min-w-16 flex-col items-center gap-1 px-2.5 py-1.5 text-xs text-[#d8d8de] no-underline transition-colors hover:text-white"
      }
    >
      <ShoppingCart
        className={`${compact ? "size-6" : "size-[22px]"} transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-brand`}
        strokeWidth={1.8}
      />
      {!compact && "Carrito"}
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
