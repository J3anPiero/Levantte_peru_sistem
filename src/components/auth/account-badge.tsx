"use client";

import Link from "next/link";
import { User, Wallet } from "lucide-react";
import { useAuth } from "./auth-provider";
import { formatPrice } from "@/lib/format";

export function AccountBadge() {
  const { user, hydrated } = useAuth();

  if (!hydrated || !user) {
    return (
      <Link href="/cuenta" className="group flex min-w-16 flex-col items-center gap-1 px-2.5 py-1.5 text-xs text-[#d8d8de] no-underline transition-colors hover:text-white">
        <User className="size-[22px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-brand" strokeWidth={1.8} />
        Mi cuenta
      </Link>
    );
  }

  return (
    <Link
      href="/cuenta"
      className="group flex items-center gap-2.5 rounded-xl border border-white/10 px-3 py-1.5 no-underline transition-colors hover:border-brand"
      aria-label={`Mi cuenta, saldo ${formatPrice(user.wallet.balance)}`}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
        {user.nombres.charAt(0).toUpperCase()}
        {user.apellidos.charAt(0).toUpperCase()}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-xs text-[#d8d8de]">Hola, {user.nombres.split(" ")[0]}</span>
        <span className="flex items-center gap-1 text-[13px] font-bold text-white">
          <Wallet className="size-3.5 text-brand" strokeWidth={2.2} />
          {formatPrice(user.wallet.balance)}
        </span>
      </span>
    </Link>
  );
}
