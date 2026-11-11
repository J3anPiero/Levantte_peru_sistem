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
      className="fixed top-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-[380px] items-center gap-3 rounded-xl bg-white p-3.5 text-ink shadow-[0_16px_40px_rgba(0,0,0,0.25)] motion-safe:animate-[toast-in_.22s_ease-out]"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-ok-soft">
        <Check className="size-5 text-ok" strokeWidth={2.6} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-semibold">{toast.title}</span>
        {toast.detail && <span className="truncate text-xs text-muted">{toast.detail}</span>}
      </span>
      <Link href="/carrito" onClick={dismissToast} className="shrink-0 text-[13px] font-bold whitespace-nowrap text-brand-deep no-underline">
        Ver carrito
      </Link>
      <button type="button" aria-label="Cerrar" onClick={dismissToast} className="shrink-0 cursor-pointer rounded-md p-1 text-muted hover:text-ink">
        <X className="size-4" />
      </button>
      <style>{`@keyframes toast-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
