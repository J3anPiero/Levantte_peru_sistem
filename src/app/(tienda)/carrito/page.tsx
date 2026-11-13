"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, MessageCircle, ShieldCheck, ShoppingCart, Trash2, Truck, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { PartIllustration } from "@/components/product/part-illustration";
import { QuantityInput } from "@/components/product/quantity-input";
import { StockLabel } from "@/components/product/product-card";
import { productBrand } from "@/lib/catalog";
import { formatPrice, igvIncluded } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

const payments = ["Visa", "Mastercard", "Yape", "Plin", "Transferencia"];

export default function CartPage() {
  const cart = useCart();
  const [code, setCode] = useState("");

  if (!cart.hydrated) {
    return <div className="container-x py-16 text-sm text-muted">Cargando tu carrito…</div>;
  }

  if (cart.lines.length === 0) {
    return (
      <div className="container-x flex flex-col items-center gap-4 py-24 text-center">
        <span className="flex size-20 items-center justify-center rounded-full bg-white shadow-card">
          <ShoppingCart className="size-9 text-muted" strokeWidth={1.6} />
        </span>
        <h1 className="text-3xl font-bold tracking-tight">Tu carrito está vacío</h1>
        <p className="m-0 max-w-[420px] text-muted">Explora el catálogo o busca por tu vehículo para encontrar el repuesto correcto.</p>
        <Link href="/catalogo" className="btn-primary mt-2">Explorar catálogo</Link>
      </div>
    );
  }

  const units = cart.lines.reduce((s, l) => s + l.qty, 0);
  const freeShippingGap = site.freeShippingFrom - (cart.subtotal - cart.discount);

  return (
    <div className="container-x flex flex-col gap-6 py-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-[34px]">Tu carrito</h1>
          <p className="mt-1.5 text-[15px] text-muted">
            {cart.lines.length} {cart.lines.length === 1 ? "producto" : "productos"} · Los precios incluyen IGV
          </p>
        </div>
        <CheckoutSteps current={1} />
      </div>

      <div className="flex flex-wrap items-start gap-6">
        <section aria-label="Productos en el carrito" className="card min-w-0 flex-[999_1_560px] px-4 sm:px-6">
          <div className="hidden grid-cols-[96px_1fr_150px_120px_40px] gap-5 py-3.5 text-xs font-semibold tracking-[0.08em] text-muted uppercase md:grid">
            <span />
            <span>Producto</span>
            <span>Cantidad</span>
            <span className="text-right">Subtotal</span>
            <span />
          </div>
          {cart.lines.map((l) => (
            <div key={l.productId} className="grid grid-cols-[72px_1fr] items-center gap-4 border-t border-line py-5 md:grid-cols-[96px_1fr_150px_120px_40px] md:gap-5">
              <Link href={`/producto/${l.product.slug}`} className="flex size-[72px] items-center justify-center rounded-xl border border-line bg-mist md:size-24">
                <PartIllustration kind={l.product.kind} size={56} label={l.product.name} />
              </Link>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[11px] font-bold tracking-[0.1em] text-muted uppercase">{productBrand(l.product).name}</span>
                <Link href={`/producto/${l.product.slug}`} className="text-[15px] leading-snug font-semibold text-ink no-underline hover:text-brand-deep">
                  {l.product.shortName ?? l.product.name}
                </Link>
                <span className="text-xs text-muted">
                  Cód. {l.product.sku}
                  {l.product.oem ? ` · OEM ${l.product.oem}` : ""}
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-2.5 text-[13px]">
                  <span className="font-semibold">{formatPrice(l.product.price)}</span>
                  {l.product.compareAtPrice && <span className="text-muted line-through">{formatPrice(l.product.compareAtPrice)}</span>}
                  <StockLabel product={l.product} />
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-3 md:contents">
                <QuantityInput id={`qty-${l.productId}`} value={l.qty} onChange={(q) => cart.update(l.productId, q)} />
                <span className="font-display text-[17px] font-bold md:text-right">{formatPrice(l.lineTotal)}</span>
                <button type="button" onClick={() => cart.remove(l.productId)} aria-label={`Eliminar ${l.product.shortName ?? l.product.name} del carrito`} className="flex size-10 cursor-pointer items-center justify-center rounded-[10px] border border-line text-muted hover:border-danger hover:text-danger">
                  <Trash2 className="size-[18px]" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-4">
            <Link href="/catalogo" className="btn-outline h-10">
              <ArrowLeft className="size-4" />
              Seguir comprando
            </Link>
            <div className="flex items-center gap-2.5 text-[13px] text-muted">
              <Truck className="size-[18px] text-ok" />
              {freeShippingGap <= 0 ? (
                <span>
                  Tu pedido califica para <strong className="text-ok">envío gratis en {site.metroArea}</strong>
                </span>
              ) : (
                <span>
                  Agrega <strong className="text-ink">{formatPrice(freeShippingGap)}</strong> más para envío gratis en {site.city}
                </span>
              )}
            </div>
          </div>
        </section>

        <aside aria-label="Resumen del pedido" className="flex w-full flex-col gap-4 lg:w-[380px] lg:shrink-0">
          <div className="card flex flex-col gap-3.5 p-6">
            <h2 className="text-lg font-bold">Resumen del pedido</h2>
            {cart.coupon ? (
              <div className="flex items-center gap-2 rounded-lg bg-ok-soft px-2.5 py-2 text-[13px] text-ok">
                <Check className="size-4" strokeWidth={2.5} />
                <span>
                  Cupón <strong>{cart.coupon.code}</strong>: {cart.coupon.description}
                </span>
                <button type="button" aria-label="Quitar cupón" onClick={cart.removeCoupon} className="ml-auto cursor-pointer text-ok">
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (cart.applyCoupon(code)) setCode("");
                }}
              >
                <div className="flex gap-2">
                  <label htmlFor="cupon" className="sr-only">Cupón de descuento</label>
                  <input id="cupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Cupón de descuento" className="input h-11 min-w-0 flex-1 uppercase" />
                  <button type="submit" className="btn-dark h-11 px-4 text-[13px]">Aplicar</button>
                </div>
                {cart.couponError && <span className="text-xs text-danger">{cart.couponError}</span>}
              </form>
            )}
            <div className="flex flex-col gap-2.5 border-t border-line pt-3 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal ({units} unidades)</span><span>{formatPrice(cart.subtotal)}</span></div>
              {cart.discount > 0 && <div className="flex justify-between"><span className="text-muted">Descuento por cupón</span><span className="text-ok">− {formatPrice(cart.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted">Envío estimado · {site.city}</span><span className={cart.shippingEstimate === 0 ? "text-ok" : ""}>{cart.shippingEstimate === 0 ? "Gratis" : formatPrice(cart.shippingEstimate)}</span></div>
              <div className="flex justify-between text-xs text-muted"><span>Incluye IGV (18%)</span><span>{formatPrice(igvIncluded(cart.total))}</span></div>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <span className="text-[15px] font-bold">Total</span>
              <span className="font-display text-[28px] font-extrabold">{formatPrice(cart.total)}</span>
            </div>
            <Link href="/checkout" className="btn-primary h-[52px] text-[15px] font-bold">
              Proceder al pago
              <ArrowRight className="size-[18px]" strokeWidth={2.2} />
            </Link>
            <div className="flex flex-wrap justify-center gap-1.5">
              {payments.map((p) => <span key={p} className="rounded-md border border-line px-2 py-1 text-[11px] font-semibold text-muted">{p}</span>)}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-card bg-ink p-5 text-[13px] leading-snug text-muted-2">
            <div className="flex items-start gap-3"><ShieldCheck className="size-5 shrink-0 text-brand" /><span><strong className="text-white">Garantía en todos los repuestos</strong><br />Cambio o devolución dentro de 7 días si la pieza no corresponde.</span></div>
            <div className="flex items-start gap-3"><MessageCircle className="size-5 shrink-0 text-brand" /><span><strong className="text-white">¿Dudas con la compatibilidad?</strong><br /><a href={whatsappLink("Hola, quisiera confirmar la compatibilidad de los productos de mi carrito.")} target="_blank" rel="noopener noreferrer" className="text-brand">Un asesor la confirma por WhatsApp</a> antes de pagar.</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
