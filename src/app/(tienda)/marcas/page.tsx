import type { Metadata } from "next";
import Link from "next/link";
import { brands, vehicleMakes } from "@/data/brands";
import { products } from "@/data/products";
import { ContentPage, Section } from "@/components/ui/content-page";

export const metadata: Metadata = { title: "Marcas que comercializamos", description: "Marcas de repuestos originales y alternativos, y marcas de vehículos compatibles." };

export default function BrandsPage() {
  return (
    <ContentPage kicker="Marcas" title="Marcas que comercializamos" intro="Trabajamos únicamente con fabricantes de equipo original y marcas alternativas homologadas, con garantía y trazabilidad por número de pieza.">
      <Section title="Marcas de repuestos">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {brands.map((b) => {
            const n = products.filter((p) => p.brandId === b.id).length;
            return (
              <Link key={b.id} href={`/catalogo?marca=${b.id}`} className="card flex flex-col items-center gap-1.5 px-3 py-6 text-center text-ink no-underline hover:border-brand">
                <span className="font-display text-sm font-bold tracking-[0.04em] uppercase">{b.name}</span>
                <span className="text-xs text-muted">{b.type === "original" ? "Original (OEM)" : "Alternativo"} · {n} {n === 1 ? "producto" : "productos"}</span>
              </Link>
            );
          })}
        </div>
      </Section>
      <Section title="Marcas de vehículos compatibles">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {vehicleMakes.map((m) => (
            <Link key={m} href={`/catalogo?vmarca=${encodeURIComponent(m)}`} className="card flex h-[72px] items-center justify-center font-display text-[13px] font-bold tracking-[0.06em] text-muted no-underline uppercase hover:border-brand hover:text-ink">
              {m}
            </Link>
          ))}
        </div>
      </Section>
    </ContentPage>
  );
}
