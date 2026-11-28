"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { AlertTriangle, Car, Check, Info, Loader2, Search, Wrench } from "lucide-react";
import { lookupPlate, samplePlates } from "@/data/plates";
import { explainVin, formatPlate, isValidPlate, type VehicleRecord } from "@/lib/plate";
import { teardown, teardownTotals, type ZoneResult } from "@/lib/teardown";
import { ProductCard } from "@/components/product/product-card";
import { CarDiagram } from "./car-diagram";
import { VehicleArt } from "./vehicle-art";

type Status = "idle" | "loading" | "found" | "notfound";

/** "1 pieza" / "4 piezas": evita los textos con el plural forzado. */
function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

const vinLegend = [
  { key: "wmi", label: "Fabricante", detail: "Identifica al constructor y el país (posiciones 1 a 3)." },
  { key: "vds", label: "Descriptor", detail: "Modelo, carrocería y motor (posiciones 4 a 8)." },
  { key: "check", label: "Verificador", detail: "Dígito calculado que valida el resto del número." },
  { key: "yearCode", label: "Año modelo", detail: "Código del año de fabricación." },
  { key: "plant", label: "Planta", detail: "Fábrica donde se ensambló." },
  { key: "serial", label: "Serie", detail: "Número correlativo de la unidad." },
] as const;

function VinBreakdown({ vin }: { vin: string }) {
  const parts = explainVin(vin);
  const colors: Record<string, string> = {
    wmi: "text-brand",
    vds: "text-white",
    check: "text-ok",
    yearCode: "text-brand",
    plant: "text-white",
    serial: "text-muted-2",
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-x-1 font-display text-lg font-bold tracking-[0.18em] sm:text-2xl">
        {vinLegend.map(({ key }) => (
          <span key={key} className={colors[key]}>
            {parts[key]}
          </span>
        ))}
      </div>
      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] sm:grid-cols-3">
        {vinLegend.map(({ key, label, detail }) => (
          <div key={key} className="flex flex-col">
            <dt className={clsx("font-bold tracking-[0.06em] uppercase", colors[key])}>
              {parts[key]} · {label}
            </dt>
            <dd className="m-0 leading-snug text-muted-2">{detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function PlateLookup({ initialPlate = "" }: { initialPlate?: string }) {
  const [plate, setPlate] = useState(formatPlate(initialPlate));
  const [status, setStatus] = useState<Status>("idle");
  const [vehicle, setVehicle] = useState<VehicleRecord | null>(null);
  const [result, setResult] = useState<ZoneResult[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (value: string) => {
    if (!isValidPlate(value)) {
      setError("Ingresa una placa con el formato ABC-123 o A1B-234.");
      setStatus("idle");
      return;
    }
    setError("");
    setStatus("loading");
    setSelected(null);
    const found = await lookupPlate(value);
    if (!found) {
      setVehicle(null);
      setResult([]);
      setStatus("notfound");
      return;
    }
    setVehicle(found);
    setResult(teardown(found));
    setStatus("found");
  }, []);

  // Si llega una placa por la URL, se consulta sola al abrir la página.
  useEffect(() => {
    if (initialPlate && isValidPlate(initialPlate)) void search(initialPlate);
  }, [initialPlate, search]);

  useEffect(() => {
    if (status === "found") resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [status]);

  const totals = result.length ? teardownTotals(result) : null;
  const visibleZones = selected ? result.filter((z) => z.id === selected) : result;
  const shownParts = visibleZones.flatMap((z) => z.parts);

  return (
    <div className="flex flex-col gap-8">
      {/* Buscador */}
      <section className="relative overflow-hidden rounded-[18px] bg-black p-6 text-white sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-16 size-80 animate-glow rounded-full bg-brand/20 blur-[90px]" />
        <div className="relative flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold tracking-[0.14em] text-brand uppercase">Buscador por placa</span>
            <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-[40px]">
              Escribe tu placa y te mostramos qué piezas tenemos
            </h1>
            <p className="m-0 max-w-[640px] text-[15px] leading-relaxed text-muted-2">
              Obtenemos el VIN del vehículo, lo despiezamos por sistemas y te decimos exactamente qué repuestos de ese
              auto hay en stock ahora mismo.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void search(plate);
            }}
            className="flex flex-wrap items-start gap-3"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="placa" className="sr-only">
                Número de placa
              </label>
              {/* La placa se muestra imitando una chapa peruana para que el formato sea evidente. */}
              <div className="flex h-14 items-stretch overflow-hidden rounded-[10px] border-2 border-white bg-white">
                <span className="flex w-9 flex-col items-center justify-center bg-[#003b7a] text-[7px] font-bold tracking-wider text-white">
                  <span className="text-[10px]">PE</span>
                </span>
                <input
                  id="placa"
                  value={plate}
                  onChange={(e) => setPlate(formatPlate(e.target.value))}
                  placeholder="ABC-123"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-[190px] border-0 bg-white px-3 text-center font-display text-2xl font-extrabold tracking-[0.18em] text-ink uppercase placeholder:text-line-2 focus:outline-none"
                />
              </div>
            </div>
            <button type="submit" disabled={status === "loading"} className="btn-primary h-14 px-7 text-[15px]">
              {status === "loading" ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" strokeWidth={2.2} />}
              {status === "loading" ? "Consultando…" : "Buscar piezas"}
            </button>
          </form>

          {error && (
            <p className="m-0 flex items-center gap-2 text-[13px] text-brand">
              <AlertTriangle className="size-4" />
              {error}
            </p>
          )}

          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-2">Placas de prueba disponibles:</span>
            <div className="flex flex-wrap gap-2">
              {samplePlates.map((s) => (
                <button
                  key={s.plate}
                  type="button"
                  onClick={() => {
                    setPlate(s.plate);
                    void search(s.plate);
                  }}
                  className="group flex cursor-pointer items-center gap-2.5 rounded-full border border-white/20 py-1.5 pr-4 pl-2 text-[13px] text-muted-2 transition-colors hover:border-brand hover:text-white"
                >
                  {/* Fondo claro bajo cada silueta: sobre el panel negro, un Sportage
                      negro o un Fortuner grafito desaparecerían. */}
                  <span className="flex h-7 w-[59px] shrink-0 items-center overflow-hidden rounded-full bg-gradient-to-b from-white to-[#d9dce2]">
                    <VehicleArt
                      bodyType={s.bodyType}
                      color={s.color}
                      label=""
                      className="w-full transition-transform duration-300 group-hover:scale-110"
                    />
                  </span>
                  <span>
                    <strong className="font-display tracking-wider text-white">{s.plate}</strong> · {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {status === "notfound" && (
        <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
          <Car className="size-10 text-muted" strokeWidth={1.5} />
          <h2 className="text-xl font-bold">No encontramos esa placa</h2>
          <p className="m-0 max-w-[460px] text-sm text-muted">
            El padrón de prueba solo tiene las placas sugeridas arriba. Con el servicio oficial conectado, aquí
            aparecería cualquier vehículo registrado.
          </p>
        </div>
      )}

      {status === "found" && vehicle && totals && (
        <div ref={resultRef} className="flex flex-col gap-6 scroll-mt-6">
          {/* Ficha del vehículo y VIN */}
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <section className="card flex flex-col gap-4 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="kicker">Vehículo identificado</span>
                <span className="rounded-md border-2 border-ink px-2.5 py-1 font-display text-sm font-extrabold tracking-[0.14em]">
                  {vehicle.plate}
                </span>
              </div>

              {/* La imagen va antes que la ficha porque es lo que confirma de un
                  vistazo que la placa trajo el vehículo correcto: si alguien
                  tecleó mal un dígito, ve una pickup donde esperaba su sedán
                  antes de leer una sola línea de texto. El pie dice que es una
                  ilustración; en una tienda de repuestos, dar por foto lo que no
                  lo es termina en una pieza que no calza. */}
              <figure className="m-0 flex flex-col gap-2">
                {/* El fondo es claro y no negro: la mitad del padrón son autos
                    blancos o plata, pero el otro medio son negros y grafito, y
                    sobre negro esos no se ven. En claro se leen los ocho. */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#eaedf2] via-[#dadfe7] to-[#c3c9d4] px-4 pt-3 pb-1">
                  <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-white/70 blur-[70px]" />
                  <VehicleArt
                    key={vehicle.plate}
                    bodyType={vehicle.bodyType}
                    color={vehicle.color}
                    className="relative w-full animate-fade-up"
                  />
                </div>
                <figcaption className="m-0 text-[11px] leading-relaxed text-muted">
                  Ilustración referencial: reproduce la carrocería ({vehicle.bodyType.toLowerCase()}) y el color
                  registrado ({vehicle.color.toLowerCase()}). No es una fotografía de la unidad.
                </figcaption>
              </figure>

              <h2 className="text-2xl font-bold tracking-tight">
                {vehicle.make} {vehicle.model} {vehicle.year}
              </h2>
              <dl className="m-0 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                {[
                  ["Motor", vehicle.engine],
                  ["Combustible", vehicle.fuel],
                  ["Transmisión", vehicle.transmission],
                  ["Carrocería", vehicle.bodyType],
                  ["Color", vehicle.color],
                  ["Año modelo", String(vehicle.year)],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-0.5">
                    <dt className="text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">{k}</dt>
                    <dd className="m-0 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="flex flex-col gap-4 rounded-card bg-black p-6 text-white">
              <span className="text-xs font-bold tracking-[0.14em] text-brand uppercase">Número de serie (VIN)</span>
              <VinBreakdown vin={vehicle.vin} />
            </section>
          </div>

          {/* Desguace */}
          <section className="card flex flex-col gap-5 p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Desguace del vehículo</h2>
                <p className="mt-1.5 text-sm text-muted">
                  {plural(totals.total, "pieza", "piezas")} para este {vehicle.model}: {totals.exact} con compatibilidad
                  exacta y {totals.available} con stock disponible. Toca un punto del vehículo para ver ese sistema.
                </p>
              </div>
              {selected && (
                <button type="button" onClick={() => setSelected(null)} className="btn-outline h-10 text-[13px]">
                  Ver todos los sistemas
                </button>
              )}
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
              <div className="rounded-xl bg-mist p-4">
                <CarDiagram
                  zones={result}
                  selected={selected}
                  onSelect={setSelected}
                  label={`${vehicle.make} ${vehicle.model}`}
                  bodyType={vehicle.bodyType}
                  color={vehicle.color}
                />
              </div>

              <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                {result.map((zone, i) => {
                  const isSelected = selected === zone.id;
                  const empty = zone.parts.length === 0;
                  return (
                    <li key={zone.id}>
                      <button
                        type="button"
                        onClick={() => setSelected(isSelected ? null : zone.id)}
                        aria-pressed={isSelected}
                        className={clsx(
                          "flex w-full cursor-pointer items-center gap-3.5 rounded-xl border-[1.5px] px-4 py-3 text-left transition-all duration-300",
                          isSelected ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-brand/50",
                        )}
                      >
                        <span className={clsx("flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold", isSelected ? "bg-brand text-white" : empty ? "bg-mist text-muted" : "bg-ink text-white")}>
                          {i + 1}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="text-sm font-semibold">{zone.label}</span>
                          <span className="truncate text-xs text-muted">{zone.detail}</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className={clsx("block font-display text-lg font-bold", empty ? "text-muted-2" : "text-brand")}>{zone.parts.length}</span>
                          <span className="block text-[11px] text-muted">{empty ? "sin piezas" : plural(zone.available, "disponible", "disponibles")}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* Piezas */}
          <section className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {selected ? result.find((z) => z.id === selected)?.label : "Todas las piezas para este vehículo"}
                </h2>
                <p className="mt-1.5 text-sm text-muted">{plural(shownParts.length, "pieza", "piezas")} en el catálogo.</p>
              </div>
              <Link
                href={`/catalogo?vmarca=${encodeURIComponent(vehicle.make)}&vmodelo=${encodeURIComponent(vehicle.model)}&vanio=${vehicle.year}`}
                className="text-sm font-semibold text-brand no-underline"
              >
                Abrir en el catálogo →
              </Link>
            </div>

            {shownParts.length === 0 ? (
              <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
                <Wrench className="size-9 text-muted" strokeWidth={1.5} />
                <p className="m-0 max-w-[420px] text-sm text-muted">
                  Todavía no tenemos piezas de este sistema para el {vehicle.make} {vehicle.model}. Escríbenos y las
                  conseguimos bajo pedido.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {shownParts.map(({ product, match }) => (
                  <div key={product.id} className="relative h-full">
                    {match === "universal" && (
                      <span className="absolute top-3 right-3 z-10 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                        Universal
                      </span>
                    )}
                    <ProductCard product={product} vehicle={{ make: vehicle.make, model: vehicle.model, year: vehicle.year }} compact />
                  </div>
                ))}
              </div>
            )}
          </section>

          <p className="flex items-start gap-2.5 rounded-xl bg-warn-soft p-3.5 text-[13px] leading-relaxed text-warn">
            <Info className="mt-0.5 size-4 shrink-0" />
            <span>
              Datos de demostración. Las placas y los VIN de este buscador son sintéticos: ninguno corresponde a un
              vehículo real. En producción, la consulta debe resolverse contra el servicio oficial, que trata datos
              personales y exige convenio y base legal.
            </span>
          </p>
        </div>
      )}

      {status === "idle" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { Icon: Search, t: "1. Escribe la placa", d: "Con el formato peruano de tres letras y tres dígitos." },
            { Icon: Car, t: "2. Identificamos el vehículo", d: "Obtenemos el VIN, el motor y el año exacto de tu auto." },
            { Icon: Check, t: "3. Ves qué hay en stock", d: "Despiezamos el vehículo y te mostramos las piezas disponibles." },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="card flex flex-col gap-2.5 p-5">
              <Icon className="size-6 text-brand" strokeWidth={2} />
              <h2 className="text-base font-bold">{t}</h2>
              <p className="m-0 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
