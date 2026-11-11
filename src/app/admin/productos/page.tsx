import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { products } from "@/data/products";
import { productBrand, productCategory } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { PartIllustration } from "@/components/product/part-illustration";

export const metadata: Metadata = { title: "Productos" };

export default function AdminProducts() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-2xl font-bold sm:text-[26px]">Productos</h1><p className="mt-1 text-sm text-muted">{products.length} productos en el catálogo</p></div>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className="btn-outline h-10 text-[13px]">Importar CSV</button>
          <button type="button" className="btn-primary h-10 text-[13px]">+ Nuevo producto</button>
        </div>
      </div>
      <div className="card flex flex-wrap items-center gap-2.5 p-3.5">
        <label htmlFor="pq" className="sr-only">Buscar producto</label>
        <input id="pq" type="search" placeholder="Buscar por nombre, SKU u OEM" className="input h-10 min-w-0 flex-[1_1_240px]" />
        <select aria-label="Categoría" className="input h-10 w-auto text-[13px]"><option>Todas las categorías</option></select>
        <select aria-label="Marca" className="input h-10 w-auto text-[13px]"><option>Todas las marcas</option></select>
        <select aria-label="Estado" className="input h-10 w-auto text-[13px]"><option>Todos los estados</option><option>Publicado</option><option>Stock crítico</option><option>Sin stock</option></select>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px] whitespace-nowrap">
            <thead><tr className="text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{["Producto", "SKU / OEM", "Categoría", "Marca", "Precio", "Stock", "Estado", ""].map((h) => <th key={h} className="px-3.5 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {products.map((p) => {
                const low = p.stock < p.stockMin;
                return (
                  <tr key={p.id} className="border-t border-line hover:bg-mist">
                    <td className="px-3.5 py-2.5"><span className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg border border-line bg-mist"><PartIllustration kind={p.kind} size={26} /></span><Link href={`/producto/${p.slug}`} className="max-w-[320px] truncate font-semibold text-ink no-underline hover:text-brand-deep">{p.shortName ?? p.name}</Link></span></td>
                    <td className="px-3.5 py-2.5 text-muted">{p.sku}{p.oem ? <><br />OEM {p.oem}</> : null}</td>
                    <td className="px-3.5 py-2.5">{productCategory(p).name}</td>
                    <td className="px-3.5 py-2.5">{productBrand(p).name}</td>
                    <td className="px-3.5 py-2.5 font-semibold">{formatPrice(p.price)}{p.compareAtPrice ? <span className="ml-1.5 text-muted line-through">{formatPrice(p.compareAtPrice)}</span> : null}</td>
                    <td className={clsx("px-3.5 py-2.5 font-bold", p.stock === 0 ? "text-danger" : low ? "text-warn" : "")}>{p.stock}<span className="ml-1 font-normal text-muted">/ mín. {p.stockMin}</span></td>
                    <td className="px-3.5 py-2.5"><span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", p.stock === 0 ? "bg-danger-soft text-danger" : low ? "bg-warn-soft text-warn" : "bg-ok-soft text-ok")}>{p.stock === 0 ? "Sin stock" : low ? "Stock crítico" : "Publicado"}</span></td>
                    <td className="px-3.5 py-2.5"><button type="button" className="cursor-pointer font-semibold text-brand-deep">Editar</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
