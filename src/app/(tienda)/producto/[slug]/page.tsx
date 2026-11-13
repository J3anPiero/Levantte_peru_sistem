import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, CreditCard, RefreshCw, ShieldCheck, Star, Truck } from "lucide-react";
import { products } from "@/data/products";
import { categoryPath, describeFit, getProduct, productBrand, relatedProducts, stockState } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Gallery } from "@/components/product/gallery";
import { BuyBox } from "@/components/product/buy-box";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: `${p.name} · ${productBrand(p).name}`, description: p.description.slice(0, 160) };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const brand = productBrand(product);
  const path = categoryPath(product.categoryId);
  const stock = stockState(product);
  const discount = product.compareAtPrice ? product.compareAtPrice - product.price : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    mpn: product.oem ?? product.ref,
    brand: { "@type": "Brand", name: brand.name },
    description: product.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "PEN",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/BackOrder",
      seller: { "@type": "Organization", name: site.name },
    },
    ...(product.rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating.avg, reviewCount: product.rating.count } } : {}),
  };

  return (
    <div className="container-x flex flex-col gap-6 py-5 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[...path.map((c) => ({ href: `/catalogo/${c.slug}`, label: c.name })), { label: product.shortName ?? product.name }]} />

      <div className="grid items-start gap-8 lg:grid-cols-[7fr_5fr] lg:gap-10">
        <div className="animate-fade-up">
          <Gallery product={product} />
        </div>

        <section aria-label="Información del producto" className="flex animate-fade-up flex-col gap-4 [animation-delay:120ms]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold tracking-[0.12em] text-brand-deep uppercase">{brand.name}</span>
            <span className="text-xs text-muted">SKU {product.sku}</span>
          </div>
          <h1 className="text-2xl leading-tight font-bold tracking-tight sm:text-[30px]">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-[13px] text-muted">
            {product.rating && (
              <>
                <span className="flex gap-0.5" role="img" aria-label={`${product.rating.avg} de 5 estrellas`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={i < Math.round(product.rating!.avg) ? "size-4 fill-brand text-brand" : "size-4 fill-line text-line"} />
                  ))}
                </span>
                <span className="font-semibold text-brand-deep">
                  {product.rating.avg} · {product.rating.count} reseñas
                </span>
                <span>·</span>
              </>
            )}
            {product.oem && (
              <span>
                Código OEM <strong className="text-ink">{product.oem}</strong>
              </span>
            )}
            {!product.oem && product.ref && (
              <span>
                Referencia <strong className="text-ink">{product.ref}</strong>
              </span>
            )}
          </div>

          <div className="card flex flex-col gap-4 p-5">
            <div className="flex flex-wrap items-end gap-3">
              <span className="font-display text-[38px] leading-none font-extrabold">{formatPrice(product.price)}</span>
              {product.compareAtPrice && <span className="pb-1 text-base text-muted line-through">{formatPrice(product.compareAtPrice)}</span>}
              {discount > 0 && <span className="mb-1.5 rounded-md bg-brand-soft px-2 py-1 text-xs font-bold text-brand-deep">Ahorras {formatPrice(discount)}</span>}
            </div>
            <div className="text-[13px] text-muted">Precio incluye IGV · Se emite boleta o factura electrónica</div>
            <div className="flex items-center gap-2.5 text-sm">
              <span className={`size-2.5 rounded-full ${stock.tone === "ok" ? "bg-ok" : stock.tone === "warn" ? "bg-warn" : "bg-muted-2"}`} />
              <strong className={stock.tone === "ok" ? "text-ok" : stock.tone === "warn" ? "text-warn" : "text-muted"}>{stock.label}</strong>
              {product.stock > 0 && <span className="text-muted">· {product.stock} unidades en almacén Lima · Despacho hoy si compras antes de las 3 p. m.</span>}
            </div>
            {product.fits.length > 0 && (
              <div className="flex flex-wrap items-center gap-2.5 rounded-[10px] bg-ok-soft px-3.5 py-3 text-sm">
                <Check className="size-5 text-ok" strokeWidth={2.4} />
                <span>
                  <strong>Compatible con {product.fits.length} aplicaciones</strong>, incluido {describeFit(product.fits[0]).replace(/ ·.*$/, "")}
                </span>
                <a href="#compatibilidad" className="ml-auto text-[13px] font-semibold text-brand-deep no-underline">Ver todos los vehículos</a>
              </div>
            )}
            <BuyBox product={product} />
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-[13px] leading-snug text-muted">
            {[
              { Icon: ShieldCheck, t: `Garantía de ${product.warrantyMonths} meses`, d: "Por defectos de fabricación." },
              { Icon: Truck, t: "Envío a todo el Perú", d: "Lima 24 h · Provincias 2–5 días." },
              { Icon: RefreshCw, t: "Devolución en 7 días", d: "Si la pieza no corresponde a tu vehículo." },
              { Icon: CreditCard, t: "Pago seguro", d: "Tarjetas, Yape, Plin y transferencia." },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="flex items-start gap-3">
                <Icon className="size-[22px] shrink-0 text-brand-deep" strokeWidth={2} />
                <span>
                  <strong className="block text-ink">{t}</strong>
                  {d}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div id="compatibilidad">
        <ProductTabs
          tabs={[
            {
              id: "descripcion",
              label: "Descripción",
              content: (
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h2 className="mb-2.5 text-lg font-bold">Descripción</h2>
                    <p className="m-0 text-[15px] leading-relaxed">{product.description}</p>
                  </div>
                  <div>
                    <h2 className="mb-2.5 text-lg font-bold">Características técnicas</h2>
                    <table className="w-full border-collapse text-sm">
                      <tbody>
                        {[
                          { label: "Código interno", value: product.sku },
                          ...(product.oem ? [{ label: "Número de pieza OEM", value: product.oem }] : []),
                          ...(product.ref ? [{ label: "Referencia del fabricante", value: product.ref }] : []),
                          { label: "Marca", value: brand.name },
                          { label: "Tipo de repuesto", value: product.type === "original" ? "Original (OEM)" : "Alternativo homologado" },
                          ...product.specs,
                          { label: "Garantía", value: `${product.warrantyMonths} meses` },
                        ].map((s, i) => (
                          <tr key={`${s.label}-${i}`} className="border-b border-line">
                            <td className="w-[38%] py-2.5 pr-3 text-muted">{s.label}</td>
                            <td className="py-2.5 font-medium">{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ),
            },
            {
              id: "compat",
              label: `Compatibilidad (${product.fits.length})`,
              content:
                product.fits.length === 0 ? (
                  <p className="m-0 text-sm text-muted">Producto de aplicación universal. Consulta a un asesor si tienes dudas sobre tu vehículo.</p>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-line">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#FAFBFC] text-left text-xs font-semibold tracking-[0.08em] text-muted uppercase">
                          <th className="px-3.5 py-3">Marca</th>
                          <th className="px-3.5 py-3">Modelo</th>
                          <th className="px-3.5 py-3">Años</th>
                          <th className="px-3.5 py-3">Motor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.fits.map((f, i) => (
                          <tr key={i} className="border-t border-line">
                            <td className="px-3.5 py-2.5">{f.make}</td>
                            <td className="px-3.5 py-2.5 font-semibold">{f.model}</td>
                            <td className="px-3.5 py-2.5">
                              {f.yearFrom} – {f.yearTo}
                            </td>
                            <td className="px-3.5 py-2.5">{f.engine ?? "Todos"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ),
            },
            {
              id: "garantia",
              label: "Garantía y devoluciones",
              content: (
                <div className="flex max-w-[720px] flex-col gap-3 text-[15px] leading-relaxed">
                  <p className="m-0">
                    <strong>{product.warrantyMonths} meses de garantía</strong> contra defectos de fabricación, con presentación del comprobante electrónico. La garantía no cubre desgaste normal ni daños por instalación incorrecta.
                  </p>
                  <p className="m-0">Cambio o devolución dentro de los 7 días si la pieza no corresponde al vehículo y conserva el empaque original sin uso.</p>
                  <Link href="/garantias-y-devoluciones" className="font-semibold">Leer la política completa</Link>
                </div>
              ),
            },
          ]}
        />
      </div>

      <section className="flex flex-col gap-5 pt-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight">También te puede interesar</h2>
          <Link href={`/catalogo/${path[0]?.slug ?? ""}`} className="text-sm font-semibold text-brand-deep no-underline">Ver más de {path[0]?.name}</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts(product).map((p, i) => (
            <Reveal key={p.id} delay={i * 90} className="h-full">
              <ProductCard product={p} compact />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
