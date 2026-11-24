import Link from "next/link";
import { ChevronDown, Heart, LayoutGrid, ScanLine } from "lucide-react";
import { topCategories, getChildren } from "@/data/categories";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { CartBadge } from "@/components/cart/cart-badge";
import { AccountBadge } from "@/components/auth/account-badge";
import { SearchBar } from "@/components/search/search-bar";
import { MobileMenu } from "./mobile-menu";

const mainNav = ["frenos", "motor", "suspension", "filtros", "electrico", "iluminacion", "transmision", "carroceria"];

/* Los enlaces corporativos viven en la barra de servicio, arriba, para que la
   barra principal quede solo con lo que sirve para comprar y no se parta en dos
   líneas en pantallas medianas. */
const utilityLinks = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/marcas", label: "Marcas" },
  { href: "/garantias-y-devoluciones", label: "Garantías" },
  { href: "/contacto", label: "Contacto" },
  { href: "/preguntas-frecuentes", label: "Ayuda" },
];

export function Header() {
  const navCats = mainNav.map((id) => topCategories.find((c) => c.id === id)!).filter(Boolean);

  return (
    <header className="sticky top-0 z-40 bg-black text-white">
      {/* Barra de servicio */}
      <div className="hidden border-b border-white/5 bg-black text-[13px] text-muted-2 md:block">
        <div className="container-x flex min-h-9 items-center justify-between gap-6">
          <div className="flex items-center gap-5 overflow-hidden">
            <span className="flex shrink-0 items-center gap-2">
              <span className="size-1.5 animate-pulse rounded-full bg-brand" />
              Envíos a todo el Perú
            </span>
            <span className="hidden shrink-0 lg:inline">Atención: {site.hours}</span>
            <span className="hidden shrink-0 xl:inline">Repuestos originales y alternativos garantizados</span>
          </div>
          <nav aria-label="Enlaces de servicio" className="flex shrink-0 items-center gap-4">
            <Link href="/preguntas-frecuentes" className="util-link">Rastrear pedido</Link>
            <Link href="/contacto" className="util-link">Mayoristas</Link>
            <span aria-hidden="true" className="h-3.5 w-px bg-white/15" />
            {utilityLinks.map((l) => (
              <Link key={l.href} href={l.href} className="util-link">{l.label}</Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Logo, buscador y accesos */}
      <div className="container-x flex flex-wrap items-center gap-x-8 gap-y-3 py-3 md:py-4">
        <div className="flex items-center gap-1 md:hidden">
          <MobileMenu categories={topCategories} />
        </div>
        <Logo size="md" className="mr-auto md:mr-0" />
        <div className="md:hidden">
          <CartBadge compact />
        </div>

        <SearchBar className="order-last basis-full md:order-none md:flex-1 md:basis-[420px]" />

        <div className="hidden items-center gap-1.5 md:flex">
          <AccountBadge />
          <Link href="/cuenta" className="group flex min-w-16 flex-col items-center gap-1 px-2.5 py-1.5 text-xs text-[#c9c9d2] no-underline transition-colors hover:text-white">
            <Heart className="size-[22px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-brand" strokeWidth={1.8} />
            Favoritos
          </Link>
          <CartBadge />
        </div>
      </div>

      {/* Barra principal de categorías */}
      <nav
        aria-label="Principal"
        className="relative hidden border-t border-white/8 bg-gradient-to-b from-[#0d0d10] to-black md:block"
      >
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent" />

        <div className="container-x flex items-stretch gap-2">
          {/* Disparador del mega menú */}
          <div className="group relative -ml-4 shrink-0 sm:-ml-6">
            <Link
              href="/catalogo"
              className="relative flex h-full items-center gap-2.5 bg-brand px-[18px] text-sm font-bold text-white no-underline transition-colors duration-300 hover:bg-brand-deep"
            >
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/25" />
              <LayoutGrid className="size-[18px] transition-transform duration-500 group-hover:rotate-90" strokeWidth={2.2} />
              Todas las categorías
              <ChevronDown className="size-4 transition-transform duration-300 group-hover:rotate-180" strokeWidth={2.4} />
            </Link>

            <div className="invisible absolute top-full left-0 z-30 w-[640px] translate-y-2 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-b-2xl border border-t-2 border-line border-t-brand bg-white p-5 text-ink shadow-float">
                {topCategories.map((c) => (
                  <div key={c.id} className="py-1.5">
                    <Link href={`/catalogo/${c.slug}`} className="text-sm font-bold text-ink no-underline transition-colors hover:text-brand">
                      {c.name}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] text-muted">
                      {getChildren(c.id).map((s) => (
                        <Link key={s.id} href={`/catalogo/${s.slug}`} className="text-muted no-underline transition-colors hover:text-brand">
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categorías: una sola fila que se desplaza si no entra */}
          <div className="scroll-row flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto py-1.5">
            {navCats.map((c) => (
              <Link key={c.id} href={`/catalogo/${c.slug}`} className="nav-link">
                {c.name.split(" y ")[0]}
              </Link>
            ))}
            <Link href="/catalogo?orden=nuevos" className="nav-link">
              Ofertas
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            </Link>
          </div>

          {/* Acceso destacado al buscador por placa */}
          <div className="flex shrink-0 items-center py-1.5 pl-2">
            <Link href="/placa" className="nav-featured">
              <ScanLine className="size-4" strokeWidth={2.2} />
              Buscar por placa
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
