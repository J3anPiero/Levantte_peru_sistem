import type { Metadata } from "next";
import { orders, orderStatusLabel } from "@/data/orders";
import { formatDateTime, formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/admin/status-pill";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Pedidos" };

const statuses = Object.keys(orderStatusLabel) as OrderStatus[];

export default function AdminOrders() {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-2xl font-bold sm:text-[26px]">Pedidos</h1><p className="mt-1 text-sm text-muted">{orders.length} pedidos · {orders.filter((o) => o.status === "por_validar").length} con pago por validar</p></div>
        <button type="button" className="btn-outline h-10 text-[13px]">Exportar</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="chip bg-ink text-white">Todos ({orders.length})</span>
        {statuses.map((s) => (
          <span key={s} className="chip">{orderStatusLabel[s]} ({orders.filter((o) => o.status === s).length})</span>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px] whitespace-nowrap">
            <thead><tr className="text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{["Pedido", "Fecha", "Cliente", "Ítems", "Comprobante", "Pago", "Total", "Estado", ""].map((h) => <th key={h} className="px-3.5 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.number} className="border-t border-line hover:bg-mist">
                  <td className="px-3.5 py-3 font-bold">{o.number}</td>
                  <td className="px-3.5 py-3 text-muted">{formatDateTime(o.date)}</td>
                  <td className="px-3.5 py-3">{o.customer}</td>
                  <td className="px-3.5 py-3">{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="px-3.5 py-3 capitalize">{o.invoiceType}</td>
                  <td className="px-3.5 py-3">{o.paymentMethod}</td>
                  <td className="px-3.5 py-3 font-semibold">{formatPrice(o.total)}</td>
                  <td className="px-3.5 py-3"><StatusPill status={o.status} /></td>
                  <td className="px-3.5 py-3"><button type="button" className="cursor-pointer font-semibold text-brand-deep">Ver detalle</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
