"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowLeft, Building2, CreditCard, Landmark, Lock, MessageCircle, Smartphone, Store, Truck, Wallet } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { PartIllustration } from "@/components/product/part-illustration";
import { formatPrice, igvIncluded, round2 } from "@/lib/format";
import { nextOrderNumber, savePlacedOrder } from "@/lib/orders";
import { site, whatsappLink } from "@/lib/site";

const departments = ["Lima", "Arequipa", "La Libertad", "Piura", "Lambayeque", "Cusco", "Junín", "Ica"];
const districts = ["San Borja", "Miraflores", "San Isidro", "Surco", "La Victoria", "Ate", "Los Olivos", "Callao"];

type Shipping = "lima" | "provincia" | "tienda";
type Payment = "tarjeta" | "yape" | "transferencia" | "contraentrega";

const shippingOptions: { id: Shipping; Icon: typeof Truck; title: string; detail: string; cost: number; eta: string }[] = [
  { id: "lima", Icon: Truck, title: "Envío express Lima Metropolitana", detail: "Entrega en 24 horas hábiles · Motorizado con seguimiento", cost: site.limaShippingCost, eta: "Mañana, entre 9:00 y 18:00" },
  { id: "provincia", Icon: Building2, title: "Envío a provincias", detail: "Olva Courier o Shalom · 2 a 5 días hábiles · Pago en destino disponible", cost: site.provinceShippingCost, eta: "Entre 2 y 5 días hábiles" },
  { id: "tienda", Icon: Store, title: "Recojo en tienda", detail: `Listo en 2 horas · ${site.address} · ${site.hours}`, cost: 0, eta: "Hoy, en 2 horas" },
];

const paymentOptions: { id: Payment; Icon: typeof CreditCard; title: string; detail: string }[] = [
  { id: "tarjeta", Icon: CreditCard, title: "Tarjeta de crédito o débito", detail: "Visa, Mastercard, Amex · Hasta 6 cuotas sin interés" },
  { id: "yape", Icon: Smartphone, title: "Yape o Plin", detail: "Escanea el QR y confirma en segundos" },
  { id: "transferencia", Icon: Landmark, title: "Transferencia bancaria", detail: "BCP, BBVA, Interbank, Scotiabank · Validación en 1 hora" },
  { id: "contraentrega", Icon: Wallet, title: "Pago contra entrega", detail: "Solo Lima Metropolitana · Efectivo o POS" },
];

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="label">{label}</label>
      {children}
    </div>
  );
}

function Section({ n, title, children, action }: { n: number; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="card flex flex-col gap-4 p-5 sm:p-6">
      <div className="flex items-center gap-3 font-display text-[17px] font-bold">
        <span className="flex size-[30px] items-center justify-center rounded-full bg-ink text-[13px] text-white">{n}</span>
        {title}
        {action && <span className="ml-auto text-[13px] font-semibold">{action}</span>}
      </div>
      {children}
    </section>
  );
}

export default function CheckoutPage() {
  const cart = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    nombres: "", apellidos: "", tipoDoc: "DNI", numDoc: "", telefono: "", email: "", crearCuenta: false,
    comprobante: "boleta" as "boleta" | "factura", ruc: "", razonSocial: "", direccionFiscal: "",
    departamento: "Lima", provincia: "Lima", distrito: "San Borja", direccion: "", referencia: "", guardarDireccion: false,
    envio: "lima" as Shipping, pago: "tarjeta" as Payment, cuotas: "Pago único", terminos: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const shipping = shippingOptions.find((s) => s.id === form.envio)!;
  const afterDiscount = cart.subtotal - cart.discount;
  const shippingCost = form.envio === "lima" && afterDiscount >= site.freeShippingFrom ? 0 : shipping.cost;
  const total = round2(afterDiscount + shippingCost);

  if (!cart.hydrated) return <div className="container-x py-16 text-sm text-muted">Cargando…</div>;
  if (cart.lines.length === 0) {
    return (
      <div className="container-x flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight">No hay productos para pagar</h1>
        <p className="m-0 text-muted">Agrega repuestos a tu carrito para continuar con la compra.</p>
        <Link href="/catalogo" className="btn-primary mt-2">Explorar catálogo</Link>
      </div>
    );
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.nombres.trim()) e.nombres = "Ingresa tus nombres";
    if (!form.apellidos.trim()) e.apellidos = "Ingresa tus apellidos";
    if (!/^\d{8,12}$/.test(form.numDoc)) e.numDoc = "Documento inválido";
    if (!/^9\d{8}$/.test(form.telefono.replace(/\s/g, ""))) e.telefono = "Celular de 9 dígitos";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido";
    if (form.comprobante === "factura") {
      if (!/^\d{11}$/.test(form.ruc)) e.ruc = "RUC de 11 dígitos";
      if (!form.razonSocial.trim()) e.razonSocial = "Ingresa la razón social";
    }
    if (form.envio !== "tienda" && !form.direccion.trim()) e.direccion = "Ingresa la dirección de entrega";
    if (form.envio === "provincia" && form.departamento === "Lima") e.departamento = "Selecciona un departamento fuera de Lima";
    if (form.pago === "contraentrega" && form.envio !== "lima") e.pago = "Pago contra entrega solo disponible con envío en Lima";
    if (!form.terminos) e.terminos = "Debes aceptar los términos para continuar";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    const number = nextOrderNumber();
    const payment = paymentOptions.find((p) => p.id === form.pago)!;
    savePlacedOrder({
      number,
      date: new Date().toISOString(),
      customer: form.comprobante === "factura" ? form.razonSocial : `${form.nombres} ${form.apellidos}`,
      email: form.email,
      phone: form.telefono,
      invoiceType: form.comprobante,
      invoiceNumber: `${form.comprobante === "factura" ? "F001" : "B001"}-${String(Math.floor(2000 + Math.random() * 900)).padStart(8, "0")}`,
      paymentMethod: payment.title,
      status: form.pago === "transferencia" || form.pago === "contraentrega" ? "por_validar" : "pagado",
      items: cart.lines.map((l) => ({ productId: l.productId, name: l.product.shortName ?? l.product.name, sku: l.product.sku, qty: l.qty, unitPrice: l.product.price })),
      subtotal: cart.subtotal,
      discount: cart.discount,
      shipping: shippingCost,
      total,
      shippingMethod: shipping.title,
      shippingAddress: form.envio === "tienda" ? site.address : `${form.direccion}, ${form.distrito}, ${form.departamento}${form.referencia ? ` · Ref. ${form.referencia}` : ""}`,
      estimatedDelivery: shipping.eta,
    });
    cart.clear();
    router.push(`/pedido/${number}/confirmado`);
  }

  const err = (k: string) => (errors[k] ? <span data-error className="text-xs text-danger">{errors[k]}</span> : null);
  const inputCls = (k: string) => clsx("input", errors[k] && "border-danger");

  return (
    <div className="container-x flex flex-col gap-6 py-8 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-[34px]">Finalizar compra</h1>
        <CheckoutSteps current={2} />
      </div>

      <form onSubmit={submit} noValidate className="flex flex-wrap items-start gap-6">
        <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
          <Section n={1} title="Datos del comprador" action={<Link href="/cuenta" className="no-underline">¿Ya tienes cuenta? Ingresa</Link>}>
            <div className="grid gap-3.5 sm:grid-cols-2">
              <Field id="nombres" label="Nombres"><input id="nombres" autoComplete="given-name" value={form.nombres} onChange={(e) => set("nombres", e.target.value)} className={inputCls("nombres")} placeholder="Como figura en tu documento" />{err("nombres")}</Field>
              <Field id="apellidos" label="Apellidos"><input id="apellidos" autoComplete="family-name" value={form.apellidos} onChange={(e) => set("apellidos", e.target.value)} className={inputCls("apellidos")} />{err("apellidos")}</Field>
            </div>
            <div className="grid gap-3.5 sm:grid-cols-3">
              <Field id="tipoDoc" label="Tipo de documento"><select id="tipoDoc" value={form.tipoDoc} onChange={(e) => set("tipoDoc", e.target.value)} className="input"><option>DNI</option><option>Carné de extranjería</option><option>Pasaporte</option></select></Field>
              <Field id="numDoc" label="Número de documento"><input id="numDoc" inputMode="numeric" value={form.numDoc} onChange={(e) => set("numDoc", e.target.value)} className={inputCls("numDoc")} placeholder="8 dígitos" />{err("numDoc")}</Field>
              <Field id="telefono" label="Celular"><input id="telefono" type="tel" autoComplete="tel" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} className={inputCls("telefono")} placeholder="9•• ••• •••" />{err("telefono")}</Field>
            </div>
            <Field id="email" label="Correo electrónico"><input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls("email")} placeholder="Para enviarte la confirmación y el comprobante" />{err("email")}</Field>
            <label className="flex items-center gap-2.5 text-[13px] text-muted"><input type="checkbox" checked={form.crearCuenta} onChange={(e) => set("crearCuenta", e.target.checked)} className="size-[18px] accent-brand-deep" />Crear una cuenta para seguir mis pedidos y comprar más rápido</label>
          </Section>

          <Section n={2} title="Comprobante de pago">
            <div role="group" aria-label="Tipo de comprobante" className="flex w-fit overflow-hidden rounded-[10px] border-[1.5px] border-line-2">
              {(["boleta", "factura"] as const).map((t) => (
                <button key={t} type="button" aria-pressed={form.comprobante === t} onClick={() => set("comprobante", t)} className={clsx("cursor-pointer px-[18px] py-2.5 text-[13px] font-semibold capitalize", form.comprobante === t ? "bg-ink text-white" : "bg-white text-muted")}>
                  {t}
                </button>
              ))}
            </div>
            {form.comprobante === "factura" && (
              <>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <Field id="ruc" label="RUC"><input id="ruc" inputMode="numeric" value={form.ruc} onChange={(e) => set("ruc", e.target.value)} className={inputCls("ruc")} placeholder="11 dígitos" />{err("ruc")}</Field>
                  <Field id="razonSocial" label="Razón social"><input id="razonSocial" value={form.razonSocial} onChange={(e) => set("razonSocial", e.target.value)} className={inputCls("razonSocial")} placeholder="Se completará automáticamente desde SUNAT" />{err("razonSocial")}</Field>
                </div>
                <Field id="direccionFiscal" label="Dirección fiscal"><input id="direccionFiscal" value={form.direccionFiscal} onChange={(e) => set("direccionFiscal", e.target.value)} className="input" placeholder="Dirección registrada en SUNAT" /></Field>
              </>
            )}
          </Section>

          <Section n={3} title="Método de envío">
            <div className="flex flex-col gap-2.5">
              {shippingOptions.map(({ id, Icon, title, detail, cost }) => {
                const free = id === "tienda" || (id === "lima" && afterDiscount >= site.freeShippingFrom);
                return (
                  <label key={id} className={clsx("flex cursor-pointer items-center gap-3.5 rounded-xl border-[1.5px] px-4 py-3.5", form.envio === id ? "border-brand-deep bg-[#FFF7F2]" : "border-line-2 bg-white")}>
                    <input type="radio" name="envio" checked={form.envio === id} onChange={() => set("envio", id)} className="size-5 accent-brand-deep" />
                    <Icon className="size-6 shrink-0 text-ink" strokeWidth={1.8} />
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5"><strong className="text-sm">{title}</strong><span className="text-xs text-muted">{detail}</span></span>
                    <strong className={clsx("text-sm", free && "text-ok")}>{free ? "Gratis" : formatPrice(cost)}</strong>
                  </label>
                );
              })}
            </div>
          </Section>

          {form.envio !== "tienda" && (
            <Section n={4} title="Dirección de entrega">
              <div className="grid gap-3.5 sm:grid-cols-3">
                <Field id="departamento" label="Departamento"><select id="departamento" value={form.departamento} onChange={(e) => set("departamento", e.target.value)} className={inputCls("departamento")}>{departments.map((d) => <option key={d}>{d}</option>)}</select>{err("departamento")}</Field>
                <Field id="provincia" label="Provincia"><input id="provincia" value={form.provincia} onChange={(e) => set("provincia", e.target.value)} className="input" /></Field>
                <Field id="distrito" label="Distrito"><select id="distrito" value={form.distrito} onChange={(e) => set("distrito", e.target.value)} className="input">{districts.map((d) => <option key={d}>{d}</option>)}</select></Field>
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field id="direccion" label="Dirección"><input id="direccion" autoComplete="street-address" value={form.direccion} onChange={(e) => set("direccion", e.target.value)} className={inputCls("direccion")} placeholder="Calle, número, urbanización" />{err("direccion")}</Field>
                <Field id="referencia" label="Referencia"><input id="referencia" value={form.referencia} onChange={(e) => set("referencia", e.target.value)} className="input" placeholder="Ej. frente al parque, portón negro" /></Field>
              </div>
              <label className="flex items-center gap-2.5 text-[13px] text-muted"><input type="checkbox" checked={form.guardarDireccion} onChange={(e) => set("guardarDireccion", e.target.checked)} className="size-[18px] accent-brand-deep" />Guardar esta dirección para próximas compras</label>
            </Section>
          )}

          <Section n={form.envio !== "tienda" ? 5 : 4} title="Método de pago">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {paymentOptions.map(({ id, Icon, title, detail }) => (
                <label key={id} className={clsx("flex cursor-pointer items-center gap-3.5 rounded-xl border-[1.5px] px-4 py-3.5", form.pago === id ? "border-brand-deep bg-[#FFF7F2]" : "border-line-2 bg-white")}>
                  <input type="radio" name="pago" checked={form.pago === id} onChange={() => set("pago", id)} className="size-5 accent-brand-deep" />
                  <Icon className="size-6 shrink-0 text-ink" strokeWidth={1.8} />
                  <span className="flex min-w-0 flex-col gap-0.5"><strong className="text-sm">{title}</strong><span className="text-xs text-muted">{detail}</span></span>
                </label>
              ))}
            </div>
            {err("pago")}
            {form.pago === "tarjeta" && (
              <div className="flex flex-col gap-3.5 rounded-xl bg-mist p-4 sm:p-[18px]">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-muted">
                  <span className="flex items-center gap-1.5"><Lock className="size-3.5" />Los datos de tarjeta se ingresan en el formulario seguro de la pasarela. Nunca se almacenan en LEVANTE PERÚ.</span>
                </div>
                <div className="rounded-[10px] border-[1.5px] border-dashed border-line-2 bg-white p-4 text-center text-[13px] text-muted">
                  Aquí se insertará el formulario de la pasarela de pago (Culqi, Niubiz o Mercado Pago) en la integración.
                </div>
                <Field id="cuotas" label="Cuotas"><select id="cuotas" value={form.cuotas} onChange={(e) => set("cuotas", e.target.value)} className="input max-w-[280px]"><option>Pago único</option><option>3 cuotas sin interés</option><option>6 cuotas sin interés</option></select></Field>
              </div>
            )}
            {form.pago === "yape" && <p className="m-0 rounded-xl bg-mist p-4 text-[13px] text-muted">Al confirmar verás el código QR y el número para yapear. El pedido se procesa apenas validemos el pago.</p>}
            {form.pago === "transferencia" && <p className="m-0 rounded-xl bg-mist p-4 text-[13px] text-muted">Al confirmar te mostraremos las cuentas bancarias. Envía el comprobante por WhatsApp para validar el pago en menos de 1 hora.</p>}
          </Section>

          <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
            <input type="checkbox" checked={form.terminos} onChange={(e) => set("terminos", e.target.checked)} className="mt-0.5 size-[18px] accent-brand-deep" />
            <span>
              Acepto los <Link href="/terminos-y-condiciones">términos y condiciones</Link>, la <Link href="/politica-de-privacidad">política de privacidad</Link> y la <Link href="/garantias-y-devoluciones">política de garantías y devoluciones</Link> de {site.name}.
              {err("terminos")}
            </span>
          </label>
        </div>

        <aside aria-label="Resumen del pedido" className="flex w-full flex-col gap-4 lg:sticky lg:top-4 lg:w-[400px] lg:shrink-0">
          <div className="card flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Tu pedido</h2><Link href="/carrito" className="text-[13px] font-semibold no-underline">Editar</Link></div>
            <div className="flex flex-col gap-3">
              {cart.lines.map((l) => (
                <div key={l.productId} className="flex items-center gap-3">
                  <span className="relative flex size-14 shrink-0 items-center justify-center rounded-[10px] border border-line bg-mist">
                    <PartIllustration kind={l.product.kind} size={36} />
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">{l.qty}</span>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5"><span className="text-[13px] leading-snug font-semibold">{l.product.shortName ?? l.product.name}</span><span className="text-xs text-muted">{l.product.sku}</span></span>
                  <span className="text-sm font-semibold">{formatPrice(l.lineTotal)}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5 border-t border-line pt-3.5 text-sm">
              <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
              {cart.coupon && <div className="flex justify-between"><span className="text-muted">Cupón {cart.coupon.code}</span><span className="text-ok">− {formatPrice(cart.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-muted">{shipping.title.split(" ").slice(0, 3).join(" ")}</span><span className={shippingCost === 0 ? "text-ok" : ""}>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span></div>
              <div className="flex justify-between text-xs text-muted"><span>Incluye IGV (18%)</span><span>{formatPrice(igvIncluded(total))}</span></div>
            </div>
            <div className="flex items-baseline justify-between border-t border-line pt-3"><span className="text-[15px] font-bold">Total a pagar</span><span className="font-display text-[28px] font-extrabold">{formatPrice(total)}</span></div>
            <button type="submit" disabled={submitting} className="btn-primary h-[54px] text-[15px] font-bold">
              <Lock className="size-[18px]" strokeWidth={2.2} />
              {submitting ? "Procesando…" : `Confirmar y pagar ${formatPrice(total)}`}
            </button>
            <p className="m-0 text-center text-xs leading-relaxed text-muted">Recibirás la confirmación y el comprobante electrónico en tu correo. El pago se procesa de forma segura por la pasarela certificada.</p>
          </div>
          <div className="card flex items-center gap-3 p-[18px] text-[13px] text-muted">
            <MessageCircle className="size-[22px] shrink-0 text-whatsapp" strokeWidth={2} />
            <span><strong className="text-ink">¿Necesitas ayuda para pagar?</strong><br /><a href={whatsappLink("Hola, necesito ayuda para completar mi compra.")} target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp</a> y te acompañamos.</span>
          </div>
          <Link href="/carrito" className="flex items-center gap-2 self-start text-sm font-semibold text-muted no-underline hover:text-ink"><ArrowLeft className="size-4" />Volver al carrito</Link>
        </aside>
      </form>
    </div>
  );
}
