import Link from "next/link";
import { Award, Camera, CreditCard, Headset, ShieldCheck, Star, Truck } from "lucide-react";
import { topCategories } from "@/data/categories";
import { vehicleMakes } from "@/data/brands";
import { bestSellers, featuredProducts } from "@/lib/catalog";
import { site } from "@/lib/site";
import { PartIllustration } from "@/components/product/part-illustration";
import { ProductCard } from "@/components/product/product-card";
import { VehicleSelector } from "@/components/home/vehicle-selector";

const benefits = [
  { Icon: ShieldCheck, title: "Garantía certificada", text: "Todos los repuestos cuentan con garantía por defectos de fábrica y comprobante electrónico." },
  { Icon: Award, title: "Calidad verificada", text: "Marcas originales y alternativas homologadas, con código de pieza verificado antes del despacho." },
  { Icon: Headset, title: "Atención especializada", text: "Asesores técnicos que confirman la compatibilidad con tu vehículo por WhatsApp o teléfono." },
  { Icon: Truck, title: "Envíos a todo el Perú", text: "Despacho el mismo día en Lima y couriers aliados para provincias, con seguimiento del pedido." },
];

/** Reseñas de muestra: reemplazar por reseñas reales del módulo de clientes. */
const testimonials = [
  { quote: "Pedí las pastillas para mi Hilux un lunes y llegaron al día siguiente. El código coincidía exactamente con el original.", name: "Carlos M.", meta: "Lima · Toyota Hilux 2019" },
  { quote: "Como taller necesitamos respuesta rápida. El asesor confirmó la compatibilidad por WhatsApp y emitieron factura sin problema.", name: "Taller Rodríguez", meta: "Arequipa · Cliente mayorista" },
  { quote: "Buscar por mi vehículo me evitó comprar el filtro equivocado. Precio justo y el paquete llegó bien protegido.", name: "Andrea Q.", meta: "Trujillo · Kia Sportage 2018" },
];

function SectionHeading({ title, subtitle, href, linkLabel }: { title: string; subtitle?: string; href: string; linkLabel: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      </div>
      <Link href={href} className="text-sm font-semibold text-brand-deep no-underline hover:underline">{linkLabel}</Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative bg-ink pt-12 pb-28 text-white sm:pt-14">
        <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-5">
            <span className="text-xs font-bold tracking-[0.14em] text-brand uppercase">Repuestos para todas las marcas</span>
            <h1 className="text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-[54px]">El repuesto correcto, a tiempo y con garantía.</h1>
            <p className="m-0 max-w-[520px] text-[17px] leading-relaxed text-muted-2">
              Catálogo verificado por compatibilidad de vehículo, asesoría técnica y despacho a todo el Perú. Compra con la seguridad de una empresa consolidada.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn-accent h-12 px-6 text-[15px]">Explorar catálogo</Link>
              <Link href="/catalogo?orden=nuevos" className="btn h-12 border-[1.5px] border-steel-2 px-6 text-[15px] text-white hover:border-white">Ver ofertas</Link>
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-2 pt-1 text-[13px] text-muted-2">
              <span className="flex items-center gap-2"><ShieldCheck className="size-[18px] text-brand" />Garantía en todos los repuestos</span>
              <span className="flex items-center gap-2"><Truck className="size-[18px] text-brand" />Despacho en 24 h en Lima</span>
              <span className="flex items-center gap-2"><CreditCard className="size-[18px] text-brand" />Pago seguro</span>
            </div>
          </div>
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-[18px] border-[1.5px] border-dashed border-steel-2 bg-steel p-6 text-center text-muted-2 lg:min-h-[420px]">
            <Camera className="size-12" strokeWidth={1.5} />
            <span className="font-semibold text-white">Fotografía automotriz profesional</span>
            <span className="max-w-[320px] text-[13px] leading-relaxed">Reemplazar por una imagen de vehículo o taller en tono oscuro desaturado (1200×900, WebP).</span>
          </div>
        </div>
      </section>

      <section className="relative -mt-[72px]">
        <div className="container-x">
          <VehicleSelector />
        </div>
      </section>

      <section className="container-x flex flex-col gap-6 pt-16 pb-6">
        <SectionHeading title="Categorías principales" href="/catalogo" linkLabel="Ver todas las categorías" />
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-8">
          {topCategories.map((c) => (
            <Link key={c.id} href={`/catalogo/${c.slug}`} className="card flex flex-col items-center gap-3 px-3 py-5 text-center text-ink no-underline transition-colors hover:border-brand">
              <PartIllustration kind={c.icon} size={44} />
              <span className="text-[13px] font-semibold">{c.name.split(" y ")[0]}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x flex flex-col gap-6 py-10">
        <SectionHeading title="Productos destacados" subtitle="Selección de piezas de alta rotación con stock inmediato." href="/catalogo" linkLabel="Ver todos" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts().map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="container-x flex flex-col gap-6 py-10">
        <SectionHeading title="Los más vendidos" subtitle="Lo que más confían nuestros clientes y talleres." href="/catalogo?orden=popular" linkLabel="Ver ranking completo" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers().map((p, i) => <ProductCard key={p.id} product={p} rank={i + 1} />)}
        </div>
      </section>

      <section className="container-x grid gap-4 py-10 lg:grid-cols-3">
        <div className="relative flex min-h-[220px] flex-col justify-center gap-3.5 overflow-hidden rounded-[18px] bg-ink p-8 text-white lg:col-span-2 lg:p-10">
          <span className="text-xs font-bold tracking-[0.14em] text-brand uppercase">Oferta de temporada</span>
          <h2 className="max-w-[520px] text-3xl leading-[1.1] font-bold sm:text-[34px]">Semana del frenado: hasta 20% en pastillas y discos</h2>
          <p className="m-0 max-w-[460px] text-[15px] text-muted-2">Usa el cupón <strong className="text-white">FRENOS20</strong> en tu carrito. Marcas originales y alternativas con garantía. Válido hasta agotar stock.</p>
          <Link href="/catalogo/frenos" className="btn-accent mt-1.5 self-start">Ver promociones</Link>
          <PartIllustration kind="disc" size={220} className="absolute -top-2 -right-6 opacity-15" />
        </div>
        <div className="flex flex-col justify-center gap-3 rounded-[18px] bg-brand p-8 text-ink">
          <Truck className="size-9" strokeWidth={2} />
          <h2 className="text-2xl leading-tight font-bold">Envío gratis en Lima Metropolitana</h2>
          <p className="m-0 text-sm leading-relaxed">En compras desde S/ {site.freeShippingFrom}. Provincias con tarifa preferencial.</p>
          <Link href="/preguntas-frecuentes#envios" className="text-sm font-bold text-ink underline">Conocer condiciones</Link>
        </div>
      </section>

      <section className="container-x flex flex-col gap-5 py-10">
        <SectionHeading title="Marcas automotrices compatibles" href="/marcas" linkLabel="Ver todas las marcas" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:grid-cols-10">
          {vehicleMakes.map((m) => (
            <Link key={m} href={`/catalogo?vmarca=${encodeURIComponent(m)}`} className="card flex h-[72px] items-center justify-center font-display text-[13px] font-bold tracking-[0.06em] text-muted no-underline uppercase hover:border-brand hover:text-ink">
              {m}
            </Link>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ Icon, title, text }) => (
          <div key={title} className="card flex flex-col gap-3 p-6">
            <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft"><Icon className="size-6 text-brand-deep" strokeWidth={2} /></span>
            <h3 className="text-base font-bold">{title}</h3>
            <p className="m-0 text-sm leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </section>

      <section className="container-x flex flex-col gap-6 py-10 pb-20">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-[28px]">Lo que dicen nuestros clientes</h2>
          <p className="mt-1.5 text-sm text-muted">Reseñas verificadas de compras realizadas en la tienda.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="card m-0 flex flex-col gap-3.5 p-6">
              <div className="flex gap-0.5" role="img" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-[18px] fill-brand text-brand" />)}
              </div>
              <blockquote className="m-0 text-[15px] leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="text-[13px] text-muted"><strong className="text-ink">{t.name}</strong> · {t.meta}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
