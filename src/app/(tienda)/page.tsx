import Link from "next/link";
import { Award, CreditCard, Headset, ShieldCheck, Star, Truck } from "lucide-react";
import { topCategories } from "@/data/categories";
import { vehicleMakes } from "@/data/brands";
import { bestSellers, featuredProducts } from "@/lib/catalog";
import { site } from "@/lib/site";
import { PartIllustration } from "@/components/product/part-illustration";
import { ProductCard } from "@/components/product/product-card";
import { VehicleSelector } from "@/components/home/vehicle-selector";
import { LogoMark } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";

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

const stats = [
  { value: "+4,500", label: "Repuestos en catálogo" },
  { value: "24 h", label: "Despacho en Lima" },
  { value: "12 meses", label: "Garantía promedio" },
  { value: "+30", label: "Marcas homologadas" },
];

function SectionHeading({ title, subtitle, href, linkLabel }: { title: string; subtitle?: string; href: string; linkLabel: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h2>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
      </div>
      <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand no-underline">
        {linkLabel}
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-black pt-14 pb-28 text-white sm:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 -left-24 size-[560px] animate-glow rounded-full bg-brand/20 blur-[130px]" />
        <div aria-hidden="true" className="pointer-events-none absolute right-0 bottom-0 size-[420px] animate-glow rounded-full bg-brand/10 blur-[120px] [animation-delay:1.5s]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)", backgroundSize: "64px 64px" }}
        />

        <div className="container-x relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-5">
            <span className="animate-fade-up text-xs font-bold tracking-[0.14em] text-brand uppercase [animation-delay:60ms]">
              Repuestos para todas las marcas
            </span>
            <h1 className="animate-fade-up text-4xl leading-[1.05] font-bold tracking-tight [animation-delay:140ms] sm:text-5xl lg:text-[56px]">
              El repuesto correcto,
              <br />
              <span className="bg-gradient-to-r from-brand via-brand-light to-brand bg-clip-text text-transparent">a tiempo y con garantía.</span>
            </h1>
            <p className="m-0 max-w-[520px] animate-fade-up text-[17px] leading-relaxed text-muted-2 [animation-delay:220ms]">
              Catálogo verificado por compatibilidad de vehículo, asesoría técnica y despacho a todo el Perú. Compra con la seguridad de una empresa consolidada.
            </p>
            <div className="flex animate-fade-up flex-wrap gap-3 [animation-delay:300ms]">
              <Link href="/catalogo" className="btn-primary h-12 px-6 text-[15px]">Explorar catálogo</Link>
              <Link href="/catalogo?orden=nuevos" className="btn h-12 border-[1.5px] border-white/25 px-6 text-[15px] text-white hover:border-brand hover:text-brand">
                Ver ofertas
              </Link>
            </div>
            <div className="flex animate-fade-up flex-wrap gap-x-7 gap-y-2 pt-1 text-[13px] text-muted-2 [animation-delay:380ms]">
              <span className="flex items-center gap-2"><ShieldCheck className="size-[18px] text-brand" />Garantía en todos los repuestos</span>
              <span className="flex items-center gap-2"><Truck className="size-[18px] text-brand" />Despacho en 24 h en Lima</span>
              <span className="flex items-center gap-2"><CreditCard className="size-[18px] text-brand" />Pago seguro</span>
            </div>
          </div>

          <div className="relative flex animate-scale-in items-center justify-center [animation-delay:260ms]">
            {/* El resplandor vive dentro del mismo contenedor aislado que la imagen
                para que la mezcla `screen` lo deje ver a través del fondo del archivo. */}
            <div className="relative isolate animate-float">
              <div aria-hidden="true" className="absolute inset-[12%] animate-glow rounded-full bg-brand/40 blur-[80px]" />
              <LogoMark size="free" className="relative w-[min(520px,88vw)]" />
            </div>
          </div>
        </div>

        {/* Cifras */}
        <div className="container-x relative mt-14 grid animate-fade-up grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 [animation-delay:460ms] lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="group bg-black/60 px-5 py-6 text-center transition-colors duration-300 hover:bg-brand/10">
              <div className="font-display text-2xl font-extrabold text-white transition-colors duration-300 group-hover:text-brand sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs text-muted-2">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SELECTOR DE VEHÍCULO */}
      <section className="relative -mt-[72px]">
        <div className="container-x">
          <div className="animate-fade-up [animation-delay:520ms]">
            <VehicleSelector />
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <section className="container-x flex flex-col gap-6 pt-16 pb-6">
        <Reveal>
          <SectionHeading title="Categorías principales" href="/catalogo" linkLabel="Ver todas las categorías" />
        </Reveal>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 lg:grid-cols-8">
          {topCategories.map((c, i) => (
            <Reveal key={c.id} delay={i * 60} className="h-full">
              <Link
                href={`/catalogo/${c.slug}`}
                className="group card hover-lift flex h-full flex-col items-center gap-3 px-3 py-5 text-center text-ink no-underline"
              >
                <span className="transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                  <PartIllustration kind={c.icon} size={44} />
                </span>
                <span className="text-[13px] font-semibold transition-colors duration-300 group-hover:text-brand">{c.name.split(" y ")[0]}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="container-x flex flex-col gap-6 py-10">
        <Reveal>
          <SectionHeading title="Productos destacados" subtitle="Selección de piezas de alta rotación con stock inmediato." href="/catalogo" linkLabel="Ver todos" />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts().map((p, i) => (
            <Reveal key={p.id} delay={i * 90} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* MÁS VENDIDOS */}
      <section className="container-x flex flex-col gap-6 py-10">
        <Reveal>
          <SectionHeading title="Los más vendidos" subtitle="Lo que más confían nuestros clientes y talleres." href="/catalogo?orden=popular" linkLabel="Ver ranking completo" />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers().map((p, i) => (
            <Reveal key={p.id} delay={i * 90} className="h-full">
              <ProductCard product={p} rank={i + 1} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* OFERTAS */}
      <section className="container-x grid gap-4 py-10 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="group relative flex min-h-[220px] flex-col justify-center gap-3.5 overflow-hidden rounded-[18px] bg-black p-8 text-white lg:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -bottom-20 size-[320px] animate-glow rounded-full bg-brand/25 blur-[90px]" />
            <span className="relative text-xs font-bold tracking-[0.14em] text-brand uppercase">Oferta de temporada</span>
            <h2 className="relative max-w-[520px] text-3xl leading-[1.1] font-bold sm:text-[34px]">Semana del frenado: hasta 20% en pastillas y discos</h2>
            <p className="relative m-0 max-w-[460px] text-[15px] text-muted-2">
              Usa el cupón <strong className="text-brand">FRENOS20</strong> en tu carrito. Marcas originales y alternativas con garantía. Válido hasta agotar stock.
            </p>
            <Link href="/catalogo/frenos" className="btn-primary relative mt-1.5 self-start">Ver promociones</Link>
            <PartIllustration kind="disc" size={240} className="pointer-events-none absolute -top-6 -right-8 opacity-10 transition-transform duration-[1.2s] group-hover:rotate-45" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="flex h-full flex-col justify-center gap-3 rounded-[18px] bg-brand p-8 text-white">
            <Truck className="size-9" strokeWidth={2} />
            <h2 className="text-2xl leading-tight font-bold">Envío gratis en Lima Metropolitana</h2>
            <p className="m-0 text-sm leading-relaxed text-white/90">En compras desde S/ {site.freeShippingFrom}. Provincias con tarifa preferencial.</p>
            <Link href="/preguntas-frecuentes#envios" className="text-sm font-bold text-white underline underline-offset-4">Conocer condiciones</Link>
          </div>
        </Reveal>
      </section>

      {/* MARCAS COMPATIBLES — carrusel infinito */}
      <section className="flex flex-col gap-5 py-10">
        <div className="container-x">
          <Reveal>
            <SectionHeading title="Marcas automotrices compatibles" href="/marcas" linkLabel="Ver todas las marcas" />
          </Reveal>
        </div>
        <div className="marquee-mask overflow-hidden">
          <div className="marquee-track flex gap-3">
            {[...vehicleMakes, ...vehicleMakes].map((m, i) => (
              <Link
                key={`${m}-${i}`}
                href={`/catalogo?vmarca=${encodeURIComponent(m)}`}
                aria-hidden={i >= vehicleMakes.length}
                tabIndex={i >= vehicleMakes.length ? -1 : undefined}
                className="card flex h-[76px] w-[168px] shrink-0 items-center justify-center font-display text-[13px] font-bold tracking-[0.06em] text-muted no-underline uppercase transition-all duration-300 hover:border-brand hover:text-brand hover:shadow-card"
              >
                {m}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="container-x grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 90} className="h-full">
            <div className="group card hover-lift flex h-full flex-col gap-3 p-6">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft transition-colors duration-300 group-hover:bg-brand">
                <Icon className="size-6 text-brand transition-colors duration-300 group-hover:text-white" strokeWidth={2} />
              </span>
              <h3 className="text-base font-bold">{title}</h3>
              <p className="m-0 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* TESTIMONIOS */}
      <section className="container-x flex flex-col gap-6 py-10 pb-20">
        <Reveal>
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-[28px]">Lo que dicen nuestros clientes</h2>
            <p className="mt-1.5 text-sm text-muted">Reseñas verificadas de compras realizadas en la tienda.</p>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 110} className="h-full">
              <figure className="card hover-lift m-0 flex h-full flex-col gap-3.5 p-6">
                <div className="flex gap-0.5" role="img" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-[18px] fill-brand text-brand" />
                  ))}
                </div>
                <blockquote className="m-0 text-[15px] leading-relaxed">“{t.quote}”</blockquote>
                <figcaption className="mt-auto text-[13px] text-muted">
                  <strong className="text-ink">{t.name}</strong> · {t.meta}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
