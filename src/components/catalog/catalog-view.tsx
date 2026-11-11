import Link from "next/link";
import clsx from "clsx";
import { Car, LayoutGrid, List, SearchX, X } from "lucide-react";
import { getCategory, getChildren, topCategories } from "@/data/categories";
import { categoryPath, facets, searchProducts } from "@/lib/catalog";
import { buildQuery, parseCatalogParams, withoutValue, type SearchParams } from "@/lib/catalog-params";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { VehicleSelector } from "@/components/home/vehicle-selector";
import { AutoSubmitForm } from "./auto-submit-form";
import { SortSelect } from "./sort-select";

interface Props {
  sp: SearchParams;
  categorySlug?: string;
}

function FilterBlock({ title, children, dark }: { title: string; children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={clsx("flex flex-col gap-2.5 rounded-card border p-[18px]", dark ? "border-ink bg-ink text-white" : "border-line bg-white")}>
      <div className="font-display text-sm font-bold">{title}</div>
      {children}
    </div>
  );
}

function Check({ name, value, label, count, checked }: { name: string; value: string; label: string; count?: number; checked: boolean }) {
  return (
    <label className="flex min-h-7 cursor-pointer items-center gap-2.5 text-sm">
      <input type="checkbox" name={name} value={value} defaultChecked={checked} className="size-[18px] accent-brand-deep" />
      {label}
      {count !== undefined && <span className="ml-auto text-xs text-muted">{count}</span>}
    </label>
  );
}

export function CatalogView({ sp, categorySlug }: Props) {
  const category = categorySlug ? getCategory(categorySlug) : undefined;
  const query = parseCatalogParams(sp, category?.slug);
  const result = searchProducts(query);
  const f = facets(category?.slug);
  const basePath = category ? `/catalogo/${category.slug}` : "/catalogo";
  const vehicle = query.vehicle?.make ? query.vehicle : undefined;
  const vehicleLabel = vehicle ? [vehicle.make, vehicle.model, vehicle.year].filter(Boolean).join(" ") : undefined;

  const parent = category?.parentId ? getCategory(category.parentId) : category;
  const siblings = parent ? getChildren(parent.id) : [];
  const crumbs = category ? [{ href: "/catalogo", label: "Catálogo" }, ...categoryPath(category.id).map((c) => ({ href: `/catalogo/${c.slug}`, label: c.name }))] : [{ label: "Catálogo" }];

  const chips: { label: string; href: string }[] = [];
  if (vehicleLabel) chips.push({ label: vehicleLabel, href: basePath + buildQuery(sp, { vmarca: null, vmodelo: null, vanio: null, pagina: null }) });
  for (const b of query.brands ?? []) chips.push({ label: f.brands.find((x) => x.id === b)?.name ?? b, href: basePath + withoutValue(sp, "marca", b) });
  if (query.priceMin != null || query.priceMax != null) chips.push({ label: `S/ ${query.priceMin ?? f.priceMin} – S/ ${query.priceMax ?? f.priceMax}`, href: basePath + buildQuery(sp, { pmin: null, pmax: null, pagina: null }) });
  for (const d of query.availability ?? []) chips.push({ label: d === "en-stock" ? "En stock" : "Bajo pedido", href: basePath + withoutValue(sp, "disp", d) });
  for (const t of query.type ?? []) chips.push({ label: t === "original" ? "Original (OEM)" : "Alternativo", href: basePath + withoutValue(sp, "tipo", t) });
  for (const p of query.position ?? []) chips.push({ label: p === "delantero" ? "Eje delantero" : "Eje posterior", href: basePath + withoutValue(sp, "pos", p) });
  if (query.q) chips.push({ label: `“${query.q}”`, href: basePath + buildQuery(sp, { q: null, pagina: null }) });

  const pageHref = (n: number) => basePath + buildQuery(sp, { pagina: n === 1 ? null : String(n) });
  const hidden = ["q", "vmarca", "vmodelo", "vanio", "orden"].filter((k) => sp[k]);

  return (
    <div className="container-x flex flex-col gap-5 py-5 pb-12">
      <Breadcrumbs items={crumbs} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-[34px]">{category?.name ?? (query.q ? `Resultados para “${query.q}”` : "Catálogo de repuestos")}</h1>
          {category?.description && <p className="mt-1.5 text-[15px] text-muted">{category.description}</p>}
        </div>
        {vehicleLabel && (
          <div className="flex items-center gap-2.5 rounded-xl bg-ink px-3.5 py-2.5 text-[13px] text-white">
            <Car className="size-[18px] text-brand" />
            <span>
              Mi vehículo: <strong>{vehicleLabel}</strong>
            </span>
            <Link href={basePath + buildQuery(sp, { vmarca: null, vmodelo: null, vanio: null, pagina: null })} className="ml-1.5 font-semibold text-brand no-underline">Quitar</Link>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <aside aria-label="Filtros" className="flex w-full flex-col gap-3.5 lg:w-[280px] lg:shrink-0">
          <FilterBlock title="Buscar por vehículo" dark>
            <VehicleSelector variant="panel" initial={query.vehicle} categorySlug={category?.slug} />
          </FilterBlock>

          <AutoSubmitForm action={basePath} className="flex flex-col gap-3.5">
            {hidden.map((k) => (Array.isArray(sp[k]) ? (sp[k] as string[]) : [sp[k] as string]).map((v) => <input key={k + v} type="hidden" name={k} value={v} />))}

            <FilterBlock title="Categorías">
              <ul className="m-0 flex list-none flex-col gap-0.5 p-0 text-sm">
                {parent ? (
                  <>
                    <li className="py-1 font-bold">
                      <Link href={`/catalogo/${parent.slug}`} className="text-ink no-underline">{parent.name}</Link>
                    </li>
                    {siblings.map((s) => {
                      const count = f.categories.find((c) => c.id === s.id)?.count ?? 0;
                      const active = s.id === category?.id;
                      return (
                        <li key={s.id} className={clsx("flex border-l-[3px] py-1.5 pl-3.5", active ? "border-brand font-semibold" : "border-transparent text-muted")}>
                          <Link href={`/catalogo/${s.slug}${buildQuery(sp, { pagina: null })}`} className="flex flex-1 text-inherit no-underline hover:text-ink">
                            {s.name}
                            <span className="ml-auto text-xs text-muted">{count}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </>
                ) : (
                  topCategories.map((c) => (
                    <li key={c.id} className="flex py-1.5 text-muted">
                      <Link href={`/catalogo/${c.slug}${buildQuery(sp, { pagina: null })}`} className="flex flex-1 text-inherit no-underline hover:text-ink">
                        {c.name}
                        <span className="ml-auto text-xs text-muted">{f.categories.find((x) => x.id === c.id)?.count ?? 0}</span>
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </FilterBlock>

            <FilterBlock title="Marca del repuesto">
              {f.brands.map((b) => <Check key={b.id} name="marca" value={b.id} label={b.name} count={b.count} checked={query.brands?.includes(b.id) ?? false} />)}
            </FilterBlock>

            <FilterBlock title="Precio">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <label htmlFor="pmin" className="sr-only">Precio mínimo</label>
                <input id="pmin" name="pmin" type="number" min={0} placeholder={String(f.priceMin)} defaultValue={query.priceMin ?? ""} className="input h-10 text-[13px]" />
                <span className="text-muted">–</span>
                <label htmlFor="pmax" className="sr-only">Precio máximo</label>
                <input id="pmax" name="pmax" type="number" min={0} placeholder={String(f.priceMax)} defaultValue={query.priceMax ?? ""} className="input h-10 text-[13px]" />
              </div>
              <button type="submit" className="btn-outline h-10 text-[13px]">Aplicar precio</button>
            </FilterBlock>

            <FilterBlock title="Disponibilidad">
              <Check name="disp" value="en-stock" label="En stock" count={f.inStock} checked={query.availability?.includes("en-stock") ?? false} />
              <Check name="disp" value="bajo-pedido" label="Bajo pedido (3–7 días)" count={f.backorder} checked={query.availability?.includes("bajo-pedido") ?? false} />
            </FilterBlock>

            <FilterBlock title="Tipo de repuesto">
              <Check name="tipo" value="original" label="Original (OEM)" count={f.original} checked={query.type?.includes("original") ?? false} />
              <Check name="tipo" value="alternativo" label="Alternativo homologado" count={f.alternativo} checked={query.type?.includes("alternativo") ?? false} />
            </FilterBlock>

            {f.delantero + f.posterior > 0 && (
              <FilterBlock title="Posición">
                <Check name="pos" value="delantero" label="Eje delantero" count={f.delantero} checked={query.position?.includes("delantero") ?? false} />
                <Check name="pos" value="posterior" label="Eje posterior" count={f.posterior} checked={query.position?.includes("posterior") ?? false} />
              </FilterBlock>
            )}
          </AutoSubmitForm>
        </aside>

        <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <div className="card flex flex-wrap items-center gap-3.5 px-4 py-3">
            <span className="text-sm text-muted">
              <strong className="text-ink">{result.total} resultados</strong>
              {vehicleLabel ? ` para tu ${vehicleLabel}` : ""}
            </span>
            <span className="flex-1" />
            <SortSelect value={query.sort ?? "popular"} />
            <div className="hidden overflow-hidden rounded-[10px] border-[1.5px] border-line-2 sm:flex">
              <button type="button" aria-label="Vista en cuadrícula" aria-pressed="true" className="flex size-10 items-center justify-center bg-ink text-white"><LayoutGrid className="size-[18px]" /></button>
              <button type="button" aria-label="Vista en lista" aria-pressed="false" className="flex size-10 cursor-pointer items-center justify-center bg-white text-muted"><List className="size-[18px]" /></button>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <Link key={c.label + c.href} href={c.href} className="chip text-ink no-underline hover:border-ink">
                  {c.label}
                  <X className="size-3.5 text-muted" aria-label={`Quitar filtro ${c.label}`} />
                </Link>
              ))}
              <Link href={basePath} className="ml-1.5 text-[13px] font-semibold text-brand-deep no-underline">Limpiar filtros</Link>
            </div>
          )}

          {result.items.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
              <SearchX className="size-10 text-muted" strokeWidth={1.5} />
              <h2 className="text-lg font-bold">No encontramos repuestos con esos filtros</h2>
              <p className="m-0 max-w-[420px] text-sm text-muted">Prueba quitando algún filtro o escríbenos por WhatsApp: un asesor ubica la pieza por el número de parte.</p>
              <Link href={basePath} className="btn-outline mt-2">Limpiar filtros</Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.map((p) => <ProductCard key={p.id} product={p} vehicle={vehicle} />)}
            </div>
          )}

          {result.pages > 1 && (
            <nav aria-label="Paginación" className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-[13px] text-muted">
                Mostrando {(result.page - 1) * 9 + 1}–{Math.min(result.page * 9, result.total)} de {result.total} productos
              </span>
              <div className="flex gap-1.5">
                {result.page > 1 && <Link href={pageHref(result.page - 1)} aria-label="Página anterior" className="btn-outline h-10 min-w-10 px-2">‹</Link>}
                {Array.from({ length: result.pages }, (_, i) => i + 1).map((n) => (
                  <Link key={n} href={pageHref(n)} aria-current={n === result.page ? "page" : undefined} className={clsx("btn h-10 min-w-10 px-2", n === result.page ? "bg-ink text-white" : "border-[1.5px] border-line-2 bg-white text-ink")}>
                    {n}
                  </Link>
                ))}
                {result.page < result.pages && <Link href={pageHref(result.page + 1)} aria-label="Página siguiente" className="btn-outline h-10 min-w-10 px-2">›</Link>}
              </div>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
