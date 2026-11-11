import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle, ArrowUp } from "lucide-react";
import { dailySales, orders, salesByCategory } from "@/data/orders";
import { products } from "@/data/products";
import { productBrand } from "@/lib/catalog";
import { formatDate, formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/admin/status-pill";

export default function AdminDashboard() {
  const today = dailySales[dailySales.length - 1];
  const yesterday = dailySales[dailySales.length - 2];
  const change = Math.round(((today.total - yesterday.total) / yesterday.total) * 100);
  const total14 = dailySales.reduce((s, d) => s + d.total, 0);
  const orders14 = dailySales.reduce((s, d) => s + d.orders, 0);
  const max = Math.max(...dailySales.map((d) => d.total));
  const peak = dailySales.reduce((a, b) => (b.total > a.total ? b : a));
  const pending = orders.filter((o) => !["entregado", "cancelado"].includes(o.status));
  const lowStock = products.filter((p) => p.stock < p.stockMin).sort((a, b) => a.stock / a.stockMin - b.stock / b.stockMin);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-[26px]">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">{formatDate(new Date().toISOString(), { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · Resumen de operación</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <label htmlFor="rango" className="sr-only">Rango de fechas</label>
          <select id="rango" className="input h-10 w-auto text-[13px] font-semibold"><option>Últimos 14 días</option><option>Hoy</option><option>Este mes</option></select>
          <button type="button" className="btn-outline h-10 text-[13px]">Exportar reporte</button>
          <Link href="/admin/productos" className="btn-primary h-10 text-[13px]">+ Nuevo producto</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card p-5"><div className="text-xs font-semibold tracking-[0.04em] text-muted uppercase">Ventas de hoy</div><div className="mt-1.5 font-display text-[28px] font-bold">{formatPrice(today.total)}</div><div className={clsx("mt-1.5 flex items-center gap-1.5 text-xs", change >= 0 ? "text-ok" : "text-danger")}><ArrowUp className={clsx("size-3.5", change < 0 && "rotate-180")} strokeWidth={2.5} />{change >= 0 ? "+" : ""}{change}% vs. ayer</div></div>
        <div className="card p-5"><div className="text-xs font-semibold tracking-[0.04em] text-muted uppercase">Pedidos pendientes</div><div className="mt-1.5 font-display text-[28px] font-bold">{pending.length}</div><div className="mt-1.5 text-xs text-muted">{orders.filter((o) => o.status === "preparando" || o.status === "pagado").length} por preparar · {orders.filter((o) => o.status === "en_camino").length} en camino · {orders.filter((o) => o.status === "por_validar").length} por validar pago</div></div>
        <div className="card p-5"><div className="text-xs font-semibold tracking-[0.04em] text-muted uppercase">Ticket promedio</div><div className="mt-1.5 font-display text-[28px] font-bold">{formatPrice(Math.round(total14 / orders14))}</div><div className="mt-1.5 text-xs text-muted">{orders14} pedidos en 14 días</div></div>
        <div className="card border-[#F5C7A1] bg-[#FFF9F5] p-5"><div className="text-xs font-semibold tracking-[0.04em] text-muted uppercase">Stock crítico</div><div className="mt-1.5 font-display text-[28px] font-bold text-warn">{lowStock.length} productos</div><div className="mt-1.5 flex items-center gap-1.5 text-xs text-warn"><AlertTriangle className="size-3.5" strokeWidth={2.5} />Por debajo del mínimo</div></div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="card flex flex-col gap-4 p-5 xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-base font-bold">Ventas diarias · últimos 14 días</h2><p className="mt-1 text-[13px] text-muted">Total {formatPrice(total14)} · Soles, IGV incluido</p></div>
            <Link href="/admin/ventas" className="text-[13px] font-semibold no-underline">Ver tabla</Link>
          </div>
          <div className="flex h-[200px] items-end gap-0.5 border-b border-line pt-8">
            {dailySales.map((d) => (
              <div key={d.label} className="group relative flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 text-xs leading-snug whitespace-nowrap text-white group-hover:block group-focus-within:block">
                  <strong>{d.label}</strong><br />{formatPrice(d.total)} · {d.orders} pedidos
                </div>
                <button type="button" aria-label={`${d.label}: ${formatPrice(d.total)}, ${d.orders} pedidos`} className={clsx("w-full max-w-7 cursor-pointer rounded-t-[4px]", d === peak ? "bg-brand-deep" : "bg-ink hover:bg-steel-2")} style={{ height: `${(d.total / max) * 100}%` }} />
                <span className="text-[11px] text-muted">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-muted"><span>Días de octubre y noviembre</span><span>Pasa el cursor sobre una barra para ver el detalle</span></div>
        </section>

        <section className="card flex flex-col gap-3.5 p-5">
          <div><h2 className="text-base font-bold">Ventas por categoría</h2><p className="mt-1 text-[13px] text-muted">Últimos 14 días · participación</p></div>
          <div className="flex flex-col gap-2.5">
            {salesByCategory.map((c) => (
              <div key={c.name} className="grid grid-cols-[110px_1fr_48px] items-center gap-2.5 text-[13px]">
                <span className={c.name === "Otros" ? "text-muted" : ""}>{c.name}</span>
                <span className="h-2.5 overflow-hidden rounded-r-[4px] bg-line"><span className={clsx("block h-full rounded-r-[4px]", c.name === "Otros" ? "bg-line-2" : "bg-ink")} style={{ width: `${(c.share / salesByCategory[0].share) * 100}%` }} /></span>
                <span className="text-right font-semibold">{c.share}%</span>
              </div>
            ))}
          </div>
          <Link href="/admin/reportes" className="mt-auto text-[13px] font-semibold no-underline">Reporte por categoría y marca</Link>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <section className="card overflow-hidden xl:col-span-3">
          <div className="flex items-center justify-between border-b border-line px-5 py-4"><h2 className="text-base font-bold">Pedidos recientes</h2><Link href="/admin/pedidos" className="text-[13px] font-semibold no-underline">Ver todos los pedidos</Link></div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px] whitespace-nowrap">
              <thead><tr className="text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{["Pedido", "Cliente", "Comprobante", "Total", "Pago", "Estado", ""].map((h) => <th key={h} className="px-3 py-2.5 font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.number} className="border-t border-line">
                    <td className="px-3 py-2.5 font-bold">{o.number}</td>
                    <td className="px-3 py-2.5">{o.customer}</td>
                    <td className="px-3 py-2.5 capitalize">{o.invoiceType}</td>
                    <td className="px-3 py-2.5">{formatPrice(o.total)}</td>
                    <td className="px-3 py-2.5">{o.paymentMethod}</td>
                    <td className="px-3 py-2.5"><StatusPill status={o.status} /></td>
                    <td className="px-3 py-2.5"><Link href="/admin/pedidos" className="font-semibold no-underline">{o.status === "por_validar" ? "Validar" : o.status === "pagado" ? "Preparar" : o.status === "preparando" ? "Despachar" : "Ver"}</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card flex flex-col overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-line px-5 py-4"><h2 className="text-base font-bold">Stock crítico</h2><Link href="/admin/inventario" className="text-[13px] font-semibold no-underline">Ir a inventario</Link></div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead><tr className="text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase"><th className="px-3 py-2.5">Producto</th><th className="px-3 py-2.5">Stock</th><th className="px-3 py-2.5">Mínimo</th><th className="px-3 py-2.5" /></tr></thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id} className="border-t border-line">
                    <td className="px-3 py-2.5"><strong>{p.shortName ?? p.name}</strong><br /><span className="text-muted">{p.sku} · {productBrand(p).name}</span></td>
                    <td className={clsx("px-3 py-2.5 font-bold", p.stock <= p.stockMin / 3 ? "text-danger" : "text-warn")}>{p.stock}</td>
                    <td className="px-3 py-2.5">{p.stockMin}</td>
                    <td className="px-3 py-2.5"><Link href="/admin/inventario" className="font-semibold no-underline">Reponer</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-auto border-t border-line px-5 py-3.5 text-[13px] text-muted">Las alertas se generan automáticamente cuando el stock disponible cae por debajo del mínimo configurado por producto.</div>
        </section>
      </div>
    </>
  );
}
