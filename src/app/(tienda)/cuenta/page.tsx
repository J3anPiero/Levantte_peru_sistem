"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowDownLeft, ArrowUpRight, Check, Info, LogOut, Package, ShieldCheck, Wallet, Wrench } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { formatDateTime, formatPrice } from "@/lib/format";
import { formatRate, tiers, type CustomerType } from "@/lib/wallet";
import { site } from "@/lib/site";

function DemoNotice() {
  return (
    <p className="flex items-start gap-2.5 rounded-xl bg-warn-soft p-3.5 text-[13px] leading-relaxed text-warn">
      <Info className="mt-0.5 size-4 shrink-0" />
      <span>
        Cuentas y billetera de demostración: todo se guarda en este navegador, no en un servidor. No uses una contraseña
        real. Al conectar la API, el saldo pasará a calcularse y validarse en el servidor.
      </span>
    </p>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="label">{label}</label>
      {children}
    </div>
  );
}

function LoginForm() {
  const { login, busy } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        const res = await login(email, password);
        if (!res.ok) setError(res.error ?? "No se pudo iniciar sesión.");
      }}
    >
      <Field id="l-email" label="Correo electrónico">
        <input id="l-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
      </Field>
      <Field id="l-pass" label="Contraseña">
        <input id="l-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
      </Field>
      {error && <p className="m-0 text-[13px] text-danger">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary">
        {busy ? "Verificando…" : "Ingresar"}
      </button>
    </form>
  );
}

function RegisterForm() {
  const { register, busy } = useAuth();
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    documento: "",
    password: "",
    confirm: "",
    customerType: "persona" as CustomerType,
    terminos: false,
  });
  const [error, setError] = useState("");
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        if (form.password !== form.confirm) return setError("Las contraseñas no coinciden.");
        if (!form.terminos) return setError("Debes aceptar los términos para crear la cuenta.");
        const res = await register(form);
        if (!res.ok) setError(res.error ?? "No se pudo crear la cuenta.");
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="r-nombres" label="Nombres">
          <input id="r-nombres" autoComplete="given-name" value={form.nombres} onChange={(e) => set("nombres", e.target.value)} className="input" required />
        </Field>
        <Field id="r-apellidos" label="Apellidos">
          <input id="r-apellidos" autoComplete="family-name" value={form.apellidos} onChange={(e) => set("apellidos", e.target.value)} className="input" required />
        </Field>
      </div>
      <Field id="r-email" label="Correo electrónico">
        <input id="r-email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="input" required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="r-tel" label="Celular">
          <input id="r-tel" type="tel" autoComplete="tel" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} className="input" placeholder="9•• ••• •••" />
        </Field>
        <Field id="r-doc" label="DNI o RUC">
          <input id="r-doc" inputMode="numeric" value={form.documento} onChange={(e) => set("documento", e.target.value)} className="input" />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-2.5">
        <legend className="label mb-1.5">Tipo de cuenta</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {([
            { id: "persona" as const, title: "Cliente particular", detail: `Cashback desde ${formatRate(tiers.regular.rate)} por compra.` },
            { id: "mecanico" as const, title: "Taller o mecánico", detail: `Cashback de ${formatRate(tiers.frecuente.rate)}, el más alto del programa.` },
          ]).map((opt) => (
            <label
              key={opt.id}
              className={clsx(
                "flex cursor-pointer items-start gap-3 rounded-xl border-[1.5px] px-4 py-3.5 transition-colors",
                form.customerType === opt.id ? "border-brand-deep bg-[#fff7f2]" : "border-line-2 bg-white",
              )}
            >
              <input type="radio" name="tipo" checked={form.customerType === opt.id} onChange={() => set("customerType", opt.id)} className="mt-0.5 size-5 accent-brand-deep" />
              <span className="flex flex-col gap-0.5">
                <strong className="text-sm">{opt.title}</strong>
                <span className="text-xs text-muted">{opt.detail}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="r-pass" label="Contraseña">
          <input id="r-pass" type="password" autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} className="input" minLength={8} required />
        </Field>
        <Field id="r-confirm" label="Repetir contraseña">
          <input id="r-confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} className="input" minLength={8} required />
        </Field>
      </div>
      <p className="m-0 text-xs text-muted">Mínimo 8 caracteres.</p>

      <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
        <input type="checkbox" checked={form.terminos} onChange={(e) => set("terminos", e.target.checked)} className="mt-0.5 size-[18px] accent-brand-deep" />
        <span>
          Acepto los <Link href="/terminos-y-condiciones">términos y condiciones</Link> y la{" "}
          <Link href="/politica-de-privacidad">política de privacidad</Link> de {site.name}.
        </span>
      </label>

      {error && <p className="m-0 text-[13px] text-danger">{error}</p>}
      <button type="submit" disabled={busy} className="btn-primary">
        {busy ? "Creando cuenta…" : "Crear cuenta y activar mi billetera"}
      </button>
    </form>
  );
}

function CashbackTable({ activeId }: { activeId?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#fafafb] text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
            <th className="px-3.5 py-3">Nivel</th>
            <th className="px-3.5 py-3">Cashback</th>
            <th className="px-3.5 py-3">Tope por compra</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(tiers).map((t) => (
            <tr key={t.id} className={clsx("border-t border-line", activeId === t.id && "bg-brand-soft")}>
              <td className="px-3.5 py-3">
                <strong>{t.label}</strong>
                {activeId === t.id && <span className="ml-2 rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">Tu nivel</span>}
                <br />
                <span className="text-xs text-muted">{t.detail}</span>
              </td>
              <td className="px-3.5 py-3 font-display font-bold text-brand">{formatRate(t.rate)}</td>
              <td className="px-3.5 py-3">{formatPrice(t.cap)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AccountPage() {
  const { user, hydrated, logout } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");

  if (!hydrated) {
    return <div className="container-x py-16 text-sm text-muted">Cargando tu cuenta…</div>;
  }

  if (!user) {
    return (
      <div className="container-x flex flex-col gap-6 py-6 pb-20">
        <Breadcrumbs items={[{ label: "Mi cuenta" }]} />
        <header className="flex max-w-[820px] flex-col gap-3">
          <span className="kicker">Mi cuenta</span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">Tu billetera {site.name}</h1>
          <p className="m-0 text-[17px] leading-relaxed text-muted">
            Crea tu cuenta y cada compra te devuelve saldo. Lo acumulas en tu billetera y lo descuentas del total en tu
            siguiente pedido.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
          <div className="card flex flex-col gap-5 p-6">
            <div role="tablist" aria-label="Acceso" className="flex w-fit overflow-hidden rounded-[10px] border-[1.5px] border-line-2">
              {([
                ["login", "Ingresar"],
                ["register", "Crear cuenta"],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={clsx("cursor-pointer px-5 py-2.5 text-[13px] font-semibold transition-colors", tab === id ? "bg-ink text-white" : "bg-white text-muted hover:text-ink")}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === "login" ? <LoginForm /> : <RegisterForm />}
            <DemoNotice />
          </div>

          <aside className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-card bg-black p-6 text-white">
              <Wallet className="size-9 text-brand" strokeWidth={1.8} />
              <h2 className="text-xl font-bold">Cómo funciona el cashback</h2>
              <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm text-muted-2">
                <li className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-brand" />Compras un repuesto y recibes un porcentaje de vuelta.</li>
                <li className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-brand" />El saldo entra a tu billetera apenas confirmas el pedido.</li>
                <li className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-brand" />Lo usas como descuento en tu próxima compra.</li>
                <li className="flex gap-2.5"><Wrench className="mt-0.5 size-4 shrink-0 text-brand" />Los talleres reciben el porcentaje más alto.</li>
              </ul>
            </div>
            <CashbackTable />
          </aside>
        </div>
      </div>
    );
  }

  const tierId = user.customerType === "mecanico" ? "frecuente" : undefined;

  return (
    <div className="container-x flex flex-col gap-6 py-6 pb-20">
      <Breadcrumbs items={[{ label: "Mi cuenta" }]} />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kicker">Mi cuenta</span>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight sm:text-[36px]">
            Hola, {user.nombres.split(" ")[0]}
          </h1>
          <p className="mt-1.5 text-[15px] text-muted">
            {user.email} · {user.customerType === "mecanico" ? "Cuenta de taller o mecánico" : "Cliente particular"}
          </p>
        </div>
        <button type="button" onClick={logout} className="btn-outline h-10">
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[380px_1fr]">
        <div className="relative flex flex-col gap-4 overflow-hidden rounded-card bg-black p-6 text-white">
          <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-10 size-56 animate-glow rounded-full bg-brand/30 blur-[70px]" />
          <div className="relative flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-muted-2">
              <Wallet className="size-[18px] text-brand" strokeWidth={2} />
              Saldo disponible
            </span>
          </div>
          <div className="relative font-display text-[44px] leading-none font-extrabold">{formatPrice(user.wallet.balance)}</div>
          <p className="relative m-0 text-[13px] leading-relaxed text-muted-2">
            Se descuenta automáticamente del total cuando lo elijas en el checkout.
          </p>
          <Link href="/catalogo" className="btn-primary relative mt-1 self-start">
            Usar mi saldo comprando
          </Link>
        </div>

        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-bold">Tu nivel de cashback</h2>
            <CashbackTable activeId={tierId} />
            {!tierId && (
              <p className="m-0 text-[13px] text-muted">
                El nivel se calcula en cada pedido: sube a <strong>Compra mayor</strong> si el pedido supera S/ 500 o si
                la mayor parte son repuestos alternativos.
              </p>
            )}
          </section>

          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-bold">Movimientos</h2>
              <span className="text-[13px] text-muted">{user.wallet.txs.length} registrados</span>
            </div>
            {user.wallet.txs.length === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <Package className="size-9 text-muted" strokeWidth={1.5} />
                <p className="m-0 max-w-[380px] text-sm text-muted">
                  Todavía no tienes movimientos. Tu primer cashback aparecerá aquí apenas confirmes un pedido.
                </p>
                <Link href="/catalogo" className="btn-outline mt-1 h-10">Ver catálogo</Link>
              </div>
            ) : (
              <ul className="m-0 flex list-none flex-col p-0">
                {user.wallet.txs.map((tx) => (
                  <li key={tx.id} className="flex items-center gap-3.5 border-b border-line px-5 py-3.5 last:border-b-0">
                    <span className={clsx("flex size-9 shrink-0 items-center justify-center rounded-full", tx.amount >= 0 ? "bg-ok-soft text-ok" : "bg-brand-soft text-brand")}>
                      {tx.amount >= 0 ? <ArrowDownLeft className="size-4" strokeWidth={2.4} /> : <ArrowUpRight className="size-4" strokeWidth={2.4} />}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm font-semibold">{tx.note}</span>
                      <span className="text-xs text-muted">
                        {formatDateTime(tx.date)}
                        {tx.orderNumber ? ` · Pedido ${tx.orderNumber}` : ""}
                      </span>
                    </span>
                    <span className={clsx("font-display text-[15px] font-bold whitespace-nowrap", tx.amount >= 0 ? "text-ok" : "text-ink")}>
                      {tx.amount >= 0 ? "+" : "−"} {formatPrice(Math.abs(tx.amount))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card flex flex-col gap-3 p-6">
            <h2 className="text-lg font-bold">Datos de la cuenta</h2>
            <dl className="m-0 grid gap-4 sm:grid-cols-2">
              {[
                ["Nombre", `${user.nombres} ${user.apellidos}`],
                ["Correo", user.email],
                ["Celular", user.telefono || "No registrado"],
                ["DNI o RUC", user.documento || "No registrado"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1">
                  <dt className="text-xs font-semibold tracking-[0.06em] text-muted uppercase">{k}</dt>
                  <dd className="m-0 text-sm">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="m-0 flex items-start gap-2 text-[13px] text-muted">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ok" />
              Tu contraseña se guarda derivada con PBKDF2, nunca en texto plano.
            </p>
            <DemoNotice />
          </section>
        </div>
      </div>
    </div>
  );
}
