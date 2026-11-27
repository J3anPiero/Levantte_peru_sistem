import Link from "next/link";
import clsx from "clsx";
import { ChevronDown, LayoutGrid, ScanLine } from "lucide-react";
import { topCategories, getChildren } from "@/data/categories";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/logo";
import { CartBadge } from "@/components/cart/cart-badge";
import { AccountBadge } from "@/components/auth/account-badge";
import { FavoritesBadge } from "@/components/favorites/favorites-badge";
import { SearchBar } from "@/components/search/search-bar";
import { MobileMenu } from "./mobile-menu";

/* Las ocho categorías, ordenadas por rotación en una tienda de repuestos.
   Piezas A-Z salió de aquí —no es una categoría, es el índice de la
   nomenclatura, y ya tiene su fila al pie del mega menú.
 *
 * `hide` es el ancho por debajo del cual esa categoría deja de entrar y se
 * retira de la barra. Una etiqueta a medias bajo el degradado es lo que hace
 * que una barra se vea rota, así que se prefiere mostrar menos y completas: las
 * ocho siguen en el mega menú, con todas sus subcategorías. Los cortes salen de
 * medir el ancho real de cada etiqueta, no de los puntos de ruptura de Tailwind,
 * que aquí no coinciden con nada: a 1280 px faltaban 35 px justos. */
const mainNav = [
  { id: "frenos", hide: "" },
  { id: "filtros", hide: "" },
  { id: "motor", hide: "max-[800px]:hidden" },
  { id: "suspension", hide: "max-[900px]:hidden" },
  { id: "electrico", hide: "max-[1000px]:hidden" },
  { id: "transmision", hide: "max-[1110px]:hidden" },
  { id: "iluminacion", hide: "max-[1220px]:hidden" },
  { id: "carroceria", hide: "max-[1320px]:hidden" },
];

/* Los enlaces corporativos viven en la barra de servicio, arriba, para que la
   barra principal quede solo con lo que sirve para comprar y no se parta en dos
   líneas en pantallas medianas. Van detrás del separador y en gris: antes del
   separador está lo que el cliente viene a hacer. */
const utilityLinks = [
  { href: "/garantias-y-devoluciones", label: "Garantías" },
  { href: "/preguntas-frecuentes", label: "Ayuda" },
  { href: "/contacto", label: "Contacto" },
  { href: "/marcas", label: "Marcas" },
  { href: "/nosotros", label: "Nosotros" },
];

export function Header() {
  const navCats = mainNav
    .map((n) => ({ ...n, cat: topCategories.find((c) => c.id === n.id)! }))
    .filter((n) => n.cat);

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
            <Link href="/preguntas-frecuentes" className="util-link font-semibold text-white">Rastrear pedido</Link>
            <Link href="/contacto" className="util-link font-semibold text-white">Mayoristas</Link>
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
          <FavoritesBadge />
          <CartBadge />
        </div>
      </div>

      {/* Barra principal de categorías */}
      <nav
        aria-label="Principal"
        className="relative hidden border-t border-white/8 bg-gradient-to-b from-[#0d0d10] to-black md:block"
      >
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent" />

        <div className="container-x flex items-stretch">
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
                <Link
                  href="/piezas"
                  className="col-span-2 mt-2 flex items-center justify-between rounded-xl bg-mist px-4 py-3 text-sm font-semibold text-ink no-underline transition-colors hover:bg-brand-soft hover:text-brand"
                >
                  Ver la nomenclatura completa de piezas
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* El medio de la barra es una sola cosa: sitios a donde ir, todos con
              el mismo peso y el mismo espaciado. Antes aquí convivían categorías,
              un índice y una acción, y por eso se leía como una lista de cosas
              sueltas en vez de una barra. Ofertas abre la fila porque es el
              enlace de más intención y el punto rojo marca dónde empieza. */}
          <div className="scroll-row flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-3 py-2">
            <Link href="/catalogo?orden=nuevos" className="nav-link font-semibold text-white">
              Ofertas
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
            </Link>
            {navCats.map(({ cat, hide }) => (
              <Link key={cat.id} href={`/catalogo/${cat.slug}`} className={clsx("nav-link", hide)}>
                {cat.name.split(" y ")[0]}
              </Link>
            ))}
          </div>

          {/* La única acción de la barra, sola en el extremo derecho. Enmarca la
              fila junto al bloque rojo de la izquierda en vez de pelearse con él,
              que es lo que pasaba cuando los dos rojos iban pegados. */}
          <div className="flex shrink-0 items-center py-2 pl-3">
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
