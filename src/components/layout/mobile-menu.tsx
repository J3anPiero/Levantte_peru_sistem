"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { Logo } from "@/components/ui/logo";

const corporate = [
  { href: "/marcas", label: "Marcas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/garantias-y-devoluciones", label: "Garantías y devoluciones" },
  { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
  { href: "/cuenta", label: "Mi cuenta" },
];

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="-ml-2.5 flex size-11 cursor-pointer items-center justify-center text-white"
      >
        <Menu className="size-6" strokeWidth={2.2} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} className="flex-1 cursor-pointer bg-black/60" />
          <div className="flex w-[300px] max-w-[85vw] flex-col overflow-y-auto bg-ink text-white">
            <div className="flex items-center justify-between border-b border-steel px-4 py-3">
              <Logo size="sm" />
              <button type="button" aria-label="Cerrar" onClick={() => setOpen(false)} className="flex size-11 cursor-pointer items-center justify-center">
                <X className="size-6" />
              </button>
            </div>
            <div className="px-4 pt-4 pb-2 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">Categorías</div>
            {categories.map((c) => (
              <Link key={c.id} href={`/catalogo/${c.slug}`} onClick={() => setOpen(false)} className="px-4 py-3 text-[15px] font-medium text-white no-underline hover:bg-steel">
                {c.name}
              </Link>
            ))}
            <div className="px-4 pt-5 pb-2 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">Empresa</div>
            {corporate.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-4 py-3 text-[15px] text-muted-2 no-underline hover:bg-steel hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
