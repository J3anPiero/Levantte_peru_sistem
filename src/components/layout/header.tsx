import Link from "next/link";
import { Heart, LayoutGrid, Search, User } from "lucide-react";
import { topCategories, getChildren } from "@/data/categories";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { CartBadge } from "@/components/cart/cart-badge";
import { MobileMenu } from "./mobile-menu";

const mainNav = ["frenos", "motor", "suspension", "filtros", "electrico", "iluminacion"];

export function Header() {
  const navCats = mainNav.map((id) => topCategories.find((c) => c.id === id)!).filter(Boolean);
  return (
    <header className="bg-ink text-white">
      <div className="hidden bg-ink-2 text-[13px] text-muted-2 md:block">
        <div className="container-x flex min-h-9 flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6">
            <span>Envíos a todo el Perú</span>
            <span>Atención: {site.hours}</span>
            <span>Repuestos originales y alternativos garantizados</span>
          </div>
          <div className="flex gap-5">
            <Link href="/preguntas-frecuentes" className="text-muted-2 no-underline hover:text-white">Rastrear pedido</Link>
            <Link href="/preguntas-frecuentes" className="text-muted-2 no-underline hover:text-white">Ayuda</Link>
            <Link href="/contacto" className="text-muted-2 no-underline hover:text-white">Mayoristas</Link>
          </div>
        </div>
      </div>

      <div className="container-x flex flex-wrap items-center gap-x-8 gap-y-3 py-3.5 md:py-[18px]">
        <div className="flex items-center gap-1 md:hidden">
          <MobileMenu categories={topCategories} />
        </div>
        <Logo size="md" className="mr-auto md:mr-0" />
        <div className="md:hidden">
          <CartBadge compact />
        </div>

        <form action="/catalogo" method="get" role="search" className="order-last flex h-12 basis-full overflow-hidden rounded-xl bg-white md:order-none md:flex-1 md:basis-[420px]">
          <label htmlFor="header-q" className="sr-only">Buscar repuesto</label>
          <input
            id="header-q"
            name="q"
            type="search"
            placeholder="Busca por nombre, código o número de pieza"
            className="min-w-0 flex-1 border-0 px-4 text-sm text-ink placeholder:text-muted focus:outline-none"
          />
          <button type="submit" className="flex cursor-pointer items-center gap-2 bg-brand px-4 text-sm font-bold text-ink hover:bg-[#e3611c] md:px-5">
            <Search className="size-[18px]" strokeWidth={2.2} />
            <span className="hidden sm:inline">Buscar</span>
          </button>
        </form>

        <div className="hidden items-center gap-1.5 md:flex">
          <Link href="/cuenta" className="flex min-w-16 flex-col items-center gap-1 px-2.5 py-1.5 text-xs text-[#E6EAF0] no-underline hover:text-white">
            <User className="size-[22px]" strokeWidth={1.8} />
            Mi cuenta
          </Link>
          <Link href="/cuenta" className="flex min-w-16 flex-col items-center gap-1 px-2.5 py-1.5 text-xs text-[#E6EAF0] no-underline hover:text-white">
            <Heart className="size-[22px]" strokeWidth={1.8} />
            Favoritos
          </Link>
          <CartBadge />
        </div>
      </div>

      <nav aria-label="Principal" className="hidden border-t border-steel md:block">
        <div className="container-x flex flex-wrap items-center gap-1">
          <div className="group relative">
            <Link href="/catalogo" className="inline-flex items-center gap-2.5 bg-brand px-[18px] py-3.5 text-sm font-bold text-ink no-underline">
              <LayoutGrid className="size-[18px]" strokeWidth={2.2} />
              Todas las categorías
            </Link>
            <div className="invisible absolute top-full left-0 z-30 w-[640px] translate-y-1 opacity-0 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-b-2xl border border-line bg-white p-5 text-ink shadow-float">
                {topCategories.map((c) => (
                  <div key={c.id} className="py-1.5">
                    <Link href={`/catalogo/${c.slug}`} className="text-sm font-bold text-ink no-underline hover:text-brand-deep">
                      {c.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] text-muted">
                      {getChildren(c.id).map((s) => (
                        <Link key={s.id} href={`/catalogo/${s.slug}`} className="text-muted no-underline hover:text-brand-deep">
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {navCats.map((c) => (
            <Link key={c.id} href={`/catalogo/${c.slug}`} className="px-3.5 py-3.5 text-sm font-medium text-[#E6EAF0] no-underline hover:text-white">
              {c.name.split(" ")[0]}
            </Link>
          ))}
          <Link href="/catalogo?orden=nuevos" className="px-3.5 py-3.5 text-sm font-semibold text-brand no-underline">Ofertas</Link>
          <span className="flex-1" />
          <Link href="/marcas" className="px-3.5 py-3.5 text-sm font-medium text-[#E6EAF0] no-underline hover:text-white">Marcas</Link>
          <Link href="/nosotros" className="px-3.5 py-3.5 text-sm font-medium text-[#E6EAF0] no-underline hover:text-white">Nosotros</Link>
          <Link href="/garantias-y-devoluciones" className="px-3.5 py-3.5 text-sm font-medium text-[#E6EAF0] no-underline hover:text-white">Garantías</Link>
          <Link href="/contacto" className="px-3.5 py-3.5 text-sm font-medium text-[#E6EAF0] no-underline hover:text-white">Contacto</Link>
        </div>
      </nav>
    </header>
  );
}
