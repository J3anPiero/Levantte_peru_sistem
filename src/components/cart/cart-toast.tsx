"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import { useCart } from "./cart-provider";

export function CartToast() {
  const { toast, dismissToast } = useCart();
  if (!toast) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-[380px] animate-toast-in items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-black p-3.5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand-light to-brand" />
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-brand">
        <Check className="size-5 text-white" strokeWidth={2.6} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-semibold">{toast.title}</span>
        {toast.detail && <span className="truncate text-xs text-muted-2">{toast.detail}</span>}
      </span>
      <Link href="/carrito" onClick={dismissToast} className="shrink-0 text-[13px] font-bold whitespace-nowrap text-brand no-underline transition-colors hover:text-brand-light">
        Ver carrito
      </Link>
      <button type="button" aria-label="Cerrar" onClick={dismissToast} className="shrink-0 cursor-pointer rounded-md p-1 text-muted-2 transition-colors hover:text-white">
        <X className="size-4" />
      </button>
    </div>
  );
}
