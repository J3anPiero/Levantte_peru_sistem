"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Check, Download, MessageCircle } from "lucide-react";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { PartIllustration } from "@/components/product/part-illustration";
import { getProduct } from "@/lib/catalog";
import { formatDateTime, formatPrice } from "@/lib/format";
import { getPlacedOrder, type PlacedOrder } from "@/lib/orders";
import { whatsappLink } from "@/lib/site";

const timeline = [
  { title: "Pago confirmado", detail: "Recibimos tu pago y registramos el pedido." },
  { title: "En preparación", detail: "Verificamos los códigos de pieza y empacamos tu pedido." },
  { title: "En camino", detail: "Te enviaremos el contacto del transportista por WhatsApp." },
  { title: "Entregado", detail: "Podrás calificar tu compra y registrar la garantía." },
];

export default function OrderConfirmedPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = use(params);
  const [order, setOrder] = useState<PlacedOrder | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getPlacedOrder(numero) ?? null);
  }, [numero]);

  if (order === undefined) return <div className="container-x py-16 text-sm text-muted">Cargando…</div>;

  if (order === null) {
    return (
      <div className="container-x flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pedido {numero}</h1>
        <p className="m-0 max-w-[460px] text-muted">No encontramos el detalle de este pedido en este dispositivo. Revisa el correo de confirmación o consulta el estado desde tu cuenta.</p>
        <div className="flex gap-3"><Link href="/cuenta" className="btn-dark">Ir a mi cuenta</Link><Link href="/" className="btn-outline">Volver a la tienda</Link></div>
      </div>
    );
  }

  const pending = order.status === "por_validar";
  const currentStep = pending ? 0 : 1;

  return (
    <div className="container-x flex flex-col gap-7 py-10 pb-16">
      <div className="flex justify-center"><CheckoutSteps current={4} /></div>
      <div className="flex flex-col items-center gap-3.5 text-center">
        <span className={clsx("flex size-[84px] items-center justify-center rounded-full", pending ? "bg-warn-soft" : "bg-ok-soft")}>
          <Check className={clsx("size-11", pending ? "text-warn" : "text-ok")} strokeWidth={2.6} />
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-[38px]">{pending ? "¡Pedido registrado!" : "¡Gracias por tu compra!"}</h1>
        <p className="m-0 max-w-[560px] text-base leading-relaxed text-muted">
          Tu pedido <strong className="text-ink">{order.number}</strong> fue registrado{pending ? ". Validaremos el pago y te avisaremos por correo y WhatsApp." : " y el pago está confirmado."} Enviamos la confirmación{pending ? "" : ` y la ${order.invoiceType} electrónica`} a <strong className="text-ink">{order.email}</strong>.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1.5">
          <button type="button" className="btn-dark"><Download className="size-[18px]" />Descargar {order.invoiceType}</button>
          <a href={whatsappLink(`Hola, quiero hacer seguimiento a mi pedido ${order.number}.`)} target="_blank" rel="noopener noreferrer" className="btn border-[1.5px] border-whatsapp bg-white text-ink"><MessageCircle className="size-[18px] text-whatsapp" />Seguir mi pedido por WhatsApp</a>
          <Link href="/" className="btn-outline">Volver a la tienda</Link>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[7fr_5fr]">
        <div className="flex flex-col gap-4">
          <section className="card grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Número de pedido", order.number],
              ["Fecha", formatDateTime(order.date)],
              ["Método de pago", order.paymentMethod],
              ["Comprobante", `${order.invoiceType === "factura" ? "Factura" : "Boleta"} electrónica ${order.invoiceNumber}`],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-1 text-sm"><span className="text-xs font-semibold tracking-[0.06em] text-muted uppercase">{k}</span><span className={k === "Número de pedido" ? "font-display font-bold" : ""}>{v}</span></div>
            ))}
            <div className="flex flex-col gap-1 text-sm sm:col-span-2"><span className="text-xs font-semibold tracking-[0.06em] text-muted uppercase">Entrega</span><span>{order.shippingMethod} · {order.shippingAddress}</span></div>
            <div className="flex flex-col gap-1 text-sm sm:col-span-2"><span className="text-xs font-semibold tracking-[0.06em] text-muted uppercase">Llegada estimada</span><span className="font-semibold text-ok">{order.estimatedDelivery}</span></div>
          </section>

          <section className="card flex flex-col gap-4 p-6">
            <h2 className="text-lg font-bold">Seguimiento del pedido</h2>
            <ol className="m-0 flex list-none flex-col p-0">
              {timeline.map((t, i) => {
                const done = i < currentStep;
                const active = i === currentStep;
                return (
                  <li key={t.title} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      <span className={clsx("flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", done ? "bg-ok text-white" : active ? "bg-ink text-white" : "border-2 border-line-2 text-muted")}>
                        {done ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
                      </span>
                      {i < timeline.length - 1 && <span className={clsx("w-0.5 flex-1", done ? "bg-ok" : "bg-line-2")} />}
                    </div>
                    <div className="pb-5">
                      <div className={clsx("text-sm font-semibold", !done && !active && "text-muted")}>{i === 0 && pending ? "Pago por validar" : t.title}</div>
                      <div className="text-[13px] text-muted">{i === 0 && pending ? "Confirmaremos tu pago en menos de 1 hora hábil." : i === 0 ? formatDateTime(order.date) : t.detail}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <aside className="card flex flex-col gap-4 p-6">
          <h2 className="text-lg font-bold">Resumen</h2>
          <div className="flex flex-col gap-3">
            {order.items.map((it) => {
              const p = getProduct(it.productId);
              return (
                <div key={it.productId} className="flex items-center gap-3">
                  <span className="flex size-[52px] shrink-0 items-center justify-center rounded-[10px] border border-line bg-mist">{p && <PartIllustration kind={p.kind} size={34} />}</span>
                  <span className="min-w-0 flex-1 text-[13px] leading-snug"><strong>{it.name}</strong><br /><span className="text-muted">{it.qty} × {formatPrice(it.unitPrice)}</span></span>
                  <span className="text-sm font-semibold">{formatPrice(it.qty * it.unitPrice)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col gap-2.5 border-t border-line pt-3.5 text-sm">
            <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-muted">Descuento</span><span className="text-ok">− {formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted">Envío</span><span className={order.shipping === 0 ? "text-ok" : ""}>{order.shipping === 0 ? "Gratis" : formatPrice(order.shipping)}</span></div>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-3"><span className="text-[15px] font-bold">{pending ? "Total a pagar" : "Total pagado"}</span><span className="font-display text-[26px] font-extrabold">{formatPrice(order.total)}</span></div>
          <div className="rounded-xl bg-brand-soft p-3.5 text-[13px] leading-relaxed"><strong>Garantía registrada.</strong> Guarda tu comprobante: es el documento para cualquier reclamo de garantía dentro de los próximos 12 meses.</div>
        </aside>
      </div>
    </div>
  );
}
