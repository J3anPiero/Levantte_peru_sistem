"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="-ml-2.5 flex size-11 cursor-pointer items-center justify-center text-white transition-colors hover:text-brand"
      >
        <Menu className="size-6" strokeWidth={2.2} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <button type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} className="flex-1 cursor-pointer bg-black/70 animate-fade-in" />
          <div className="flex w-[300px] max-w-[85vw] animate-slide-right flex-col overflow-y-auto bg-black text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <Logo size="sm" />
              <button type="button" aria-label="Cerrar" onClick={() => setOpen(false)} className="flex size-11 cursor-pointer items-center justify-center transition-colors hover:text-brand">
                <X className="size-6" />
              </button>
            </div>
            <div className="px-4 pt-4 pb-2 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">Categorías</div>
            {categories.map((c, i) => (
              <Link
                key={c.id}
                href={`/catalogo/${c.slug}`}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${60 + i * 35}ms` }}
                className="animate-fade-up border-l-2 border-transparent px-4 py-3 text-[15px] font-medium text-white no-underline transition-colors hover:border-brand hover:bg-coal"
              >
                {c.name}
              </Link>
            ))}
            <div className="px-4 pt-5 pb-2 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">Empresa</div>
            {corporate.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-l-2 border-transparent px-4 py-3 text-[15px] text-muted-2 no-underline transition-colors hover:border-brand hover:bg-coal hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
