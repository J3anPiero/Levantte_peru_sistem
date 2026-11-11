"use client";

import clsx from "clsx";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./cart-provider";
import type { Product } from "@/lib/types";

interface Props {
  product: Product;
  qty?: number;
  size?: "sm" | "lg";
  label?: string;
  className?: string;
}

export function AddToCartButton({ product, qty = 1, size = "sm", label, className }: Props) {
  const { add } = useCart();
  const backorder = product.stock === 0;
  return (
    <button
      type="button"
      onClick={() => add(product.id, qty)}
      className={clsx(
        size === "sm" ? "btn h-10 px-3.5 text-[13px]" : "btn h-[50px] px-6 text-[15px] font-bold",
        backorder ? "bg-ink text-white hover:bg-steel" : "bg-brand-deep text-white hover:bg-brand-dark",
        className,
      )}
    >
      {size === "lg" && <ShoppingCart className="size-5" strokeWidth={2} />}
      {label ?? (backorder ? "Reservar" : size === "lg" ? "Agregar al carrito" : "Agregar")}
    </button>
  );
}
