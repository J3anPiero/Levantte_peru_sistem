"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, Search, X } from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { AdminNav } from "./admin-nav";

function Brand() {
  return (
    <Link href="/" aria-label="LEVANTE PERÚ, ir a la tienda" className="flex items-center gap-2.5 px-2.5 py-1.5 text-white no-underline">
      <LogoMark size={34} />
      <span className="flex flex-col leading-none">
        <span className="font-display text-base font-extrabold tracking-[0.08em]">LEVANTE</span>
        <span className="font-display text-[9px] font-semibold tracking-[0.3em] text-brand">PANEL ADMIN</span>
      </span>
    </Link>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-mist">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto bg-ink px-3 pt-[18px] pb-6 lg:flex">
        <div className="pb-3">
          <Brand />
        </div>
        <AdminNav />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="flex w-[280px] max-w-[85vw] flex-col overflow-y-auto bg-ink px-3 pt-3 pb-6">
            <div className="flex items-center justify-between pb-3">
              <Brand />
              <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} className="flex size-11 cursor-pointer items-center justify-center text-white"><X className="size-6" /></button>
            </div>
            <AdminNav onNavigate={() => setOpen(false)} />
          </div>
          <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} className="flex-1 cursor-pointer bg-black/60" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-3 sm:px-7">
          <button type="button" aria-label="Abrir menú" onClick={() => setOpen(true)} className="flex size-10 cursor-pointer items-center justify-center rounded-[10px] border border-line lg:hidden"><Menu className="size-5" /></button>
          <form className="flex h-[42px] min-w-0 flex-[1_1_280px] items-center gap-2.5 rounded-[10px] border border-line bg-mist px-3.5">
            <Search className="size-[18px] shrink-0 text-muted" />
            <label htmlFor="admin-q" className="sr-only">Buscar</label>
            <input id="admin-q" type="search" placeholder="Buscar pedido, producto, código o cliente" className="min-w-0 flex-1 border-0 bg-transparent text-sm focus:outline-none" />
          </form>
          <span className="rounded-full bg-warn-soft px-2.5 py-1.5 text-xs font-semibold text-warn">Datos de demostración</span>
          <button type="button" aria-label="Notificaciones" className="relative flex size-[42px] cursor-pointer items-center justify-center rounded-[10px] border border-line bg-white">
            <Bell className="size-[18px]" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-brand-deep" />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="flex size-[38px] items-center justify-center rounded-full bg-ink text-[13px] font-bold text-white">AD</span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-[13px] font-semibold">Administrador</span>
              <span className="text-xs text-muted">Rol: Administrador general</span>
            </span>
          </div>
        </div>
        <main className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-7">{children}</main>
      </div>
    </div>
  );
}
