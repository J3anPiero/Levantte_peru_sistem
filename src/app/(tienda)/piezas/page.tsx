import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { Check, MessageCircle, Package, Search, SearchX } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PART_PAGE_SIZE, partTypeLetters, partsIndexTotals, searchPartTypes } from "@/lib/parts-index";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Catálogo de piezas",
  description:
    "Nomenclatura completa de piezas automotrices en español, con el detalle de cuáles tenemos en stock y cuáles conseguimos bajo pedido.",
};

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

function buildHref(sp: SP, changes: Record<string, string | null>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (k in changes) continue;
    const value = one(v);
    if (value) params.set(k, value);
  }
  for (const [k, v] of Object.entries(changes)) if (v) params.set(k, v);
  const s = params.toString();
  return `/piezas${s ? `?${s}` : ""}`;
}

export default async function PartsIndexPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const q = one(sp.q) ?? "";
  const letter = one(sp.letra);
  const onlyStocked = one(sp.stock) === "1";
  const page = Number(one(sp.pagina) ?? 1) || 1;

  const result = searchPartTypes({ q, letter, onlyStocked, page });

  return (
    <div className="container-x flex flex-col gap-6 py-5 pb-16">
      <Breadcrumbs items={[{ label: "Catálogo de piezas" }]} />

      <header className="flex max-w-[820px] flex-col gap-3">
        <span className="kicker">Nomenclatura</span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Catálogo de piezas</h1>
        <p className="m-0 text-[17px] leading-relaxed text-muted">
          {partsIndexTotals.types.toLocaleString("es-PE")} tipos de pieza con su nombre técnico en español.{" "}
          {partsIndexTotals.stocked} están en nuestro catálogo con precio y stock; el resto los conseguimos bajo pedido.
        </p>
      </header>

      {/* Buscador y filtros */}
      <form action="/piezas" method="get" className="card flex flex-wrap items-center gap-3 p-4">
        <div className="flex h-11 min-w-0 flex-[1_1_280px] items-center gap-2.5 rounded-[10px] border-[1.5px] border-line-2 px-3.5 transition-colors focus-within:border-brand">
          <Search className="size-[18px] shrink-0 text-muted" />
          <label htmlFor="pq" className="sr-only">Buscar tipo de pieza</label>
          <input
            id="pq"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Busca por nombre: amortiguador, bujía, sensor…"
            className="min-w-0 flex-1 border-0 bg-transparent text-sm focus:outline-none"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input type="checkbox" name="stock" value="1" defaultChecked={onlyStocked} className="size-[18px] accent-brand-deep" />
          Solo con stock
        </label>
        {letter && <input type="hidden" name="letra" value={letter} />}
        <button type="submit" className="btn-primary h-11">Buscar</button>
        {(q || letter || onlyStocked) && (
          <Link href="/piezas" className="text-[13px] font-semibold text-brand no-underline">Limpiar</Link>
        )}
      </form>

      {/* Índice alfabético */}
      <nav aria-label="Índice alfabético" className="flex flex-wrap gap-1.5">
        <Link
          href={buildHref(sp, { letra: null, pagina: null })}
          className={clsx("flex size-9 items-center justify-center rounded-lg border text-[13px] font-bold no-underline transition-colors", !letter ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand hover:text-brand")}
        >
          Todo
        </Link>
        {partTypeLetters.map((l) => (
          <Link
            key={l}
            href={buildHref(sp, { letra: l, pagina: null })}
            className={clsx("flex size-9 items-center justify-center rounded-lg border text-[13px] font-bold no-underline transition-colors", letter === l ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand hover:text-brand")}
          >
            {l}
          </Link>
        ))}
      </nav>

      <p className="m-0 text-sm text-muted">
        {result.total.toLocaleString("es-PE")} {result.total === 1 ? "tipo de pieza" : "tipos de pieza"}
        {q ? ` para “${q}”` : ""}
        {letter ? ` con la letra ${letter}` : ""}.
      </p>

      {result.items.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <SearchX className="size-10 text-muted" strokeWidth={1.5} />
          <h2 className="text-xl font-bold">No encontramos ese tipo de pieza</h2>
          <p className="m-0 max-w-[460px] text-sm text-muted">
            Prueba con otra palabra, o escríbenos: si existe para tu vehículo, la conseguimos.
          </p>
          <a
            href={whatsappLink(`Hola ${site.name}, busco una pieza que no encontré en el catálogo: ${q}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn border-[1.5px] border-whatsapp bg-white text-ink"
          >
            <MessageCircle className="size-[18px] text-whatsapp" />
            Consultar por WhatsApp
          </a>
        </div>
      ) : (
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((t) => (
            <li key={t.slug}>
              {t.count > 0 ? (
                <Link
                  href={`/catalogo?pieza=${encodeURIComponent(t.slug)}`}
                  className="card hover-lift flex h-full flex-col gap-2 p-4 no-underline"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="text-[15px] leading-snug font-semibold text-ink">{t.name}</span>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-ok-soft px-2 py-0.5 text-[11px] font-bold text-ok">
                      <Check className="size-3" strokeWidth={3} />
                      {t.available > 0 ? `${t.available} en stock` : "Bajo pedido"}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-muted-2">{t.slug}</span>
                  <span className="mt-auto pt-1 text-[13px] font-semibold text-brand">
                    Ver {t.count} {t.count === 1 ? "producto" : "productos"} →
                  </span>
                </Link>
              ) : (
                <div className="card flex h-full flex-col gap-2 p-4">
                  <span className="text-[15px] leading-snug font-semibold text-ink">{t.name}</span>
                  <span className="font-mono text-[11px] text-muted-2">{t.slug}</span>
                  <a
                    href={whatsappLink(`Hola ${site.name}, necesito cotizar: ${t.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 pt-1 text-[13px] font-semibold text-muted no-underline hover:text-whatsapp"
                  >
                    <MessageCircle className="size-3.5" />
                    Cotizar esta pieza
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {result.pages > 1 && (
        <nav aria-label="Paginación" className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <span className="text-[13px] text-muted">
            Mostrando {(result.page - 1) * PART_PAGE_SIZE + 1}–{Math.min(result.page * PART_PAGE_SIZE, result.total)} de{" "}
            {result.total.toLocaleString("es-PE")}
          </span>
          <div className="flex gap-1.5">
            {result.page > 1 && (
              <Link href={buildHref(sp, { pagina: String(result.page - 1) })} className="btn-outline h-10 min-w-10 px-3">
                ‹ Anterior
              </Link>
            )}
            <span className="flex h-10 items-center px-3 text-[13px] text-muted">
              Página {result.page} de {result.pages}
            </span>
            {result.page < result.pages && (
              <Link href={buildHref(sp, { pagina: String(result.page + 1) })} className="btn-outline h-10 min-w-10 px-3">
                Siguiente ›
              </Link>
            )}
          </div>
        </nav>
      )}

      <div className="card flex items-start gap-3 p-5 text-sm leading-relaxed text-muted">
        <Package className="mt-0.5 size-5 shrink-0 text-brand" />
        <span>
          La nomenclatura proviene de una base automotriz abierta con licencia MIT y nos sirve para nombrar las piezas
          igual que los catálogos técnicos. Tener el nombre no significa tener la pieza en almacén: solo las marcadas
          con stock están disponibles para compra inmediata.
        </span>
      </div>
    </div>
  );
}
