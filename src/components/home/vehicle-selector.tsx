"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ScanLine } from "lucide-react";
import { modelsFor, vehicleMakes, yearsFor } from "@/data/brands";
import { formatPlate, isValidPlate } from "@/lib/plate";

interface Props {
  variant?: "bar" | "panel";
  initial?: { make?: string; model?: string; year?: number };
  categorySlug?: string;
}

export function VehicleSelector({ variant = "bar", initial, categorySlug }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"vehiculo" | "placa">("vehiculo");
  const [make, setMake] = useState(initial?.make ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [year, setYear] = useState(initial?.year ? String(initial.year) : "");
  const [plate, setPlate] = useState("");
  const [plateError, setPlateError] = useState("");
  const models = make ? modelsFor(make) : [];
  // Los años dependen del modelo: no tiene sentido ofrecer un 2005 para un
  // modelo que se dejó de fabricar en 1998.
  const years = yearsFor(make, model);
  const panel = variant === "panel";

  function submitVehicle(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (make) params.set("vmarca", make);
    if (model) params.set("vmodelo", model);
    if (year) params.set("vanio", year);
    router.push(`/catalogo${categorySlug ? `/${categorySlug}` : ""}?${params.toString()}`);
  }

  function submitPlate(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPlate(plate)) {
      setPlateError("Formato ABC-123 o A1B-234.");
      return;
    }
    setPlateError("");
    router.push(`/placa?p=${encodeURIComponent(plate)}`);
  }

  const selectCls = clsx("input h-11", panel && "h-10 text-[13px]");
  const labelCls = clsx("text-xs font-semibold tracking-[0.04em]", panel ? "sr-only" : "text-muted");

  const tabs = (
    <div role="tablist" aria-label="Cómo buscar" className={clsx("flex w-fit overflow-hidden rounded-[10px] border-[1.5px]", panel ? "border-white/20" : "border-line-2")}>
      {(
        [
          ["vehiculo", "Por vehículo"],
          ["placa", "Por placa"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          role="tab"
          type="button"
          aria-selected={mode === id}
          onClick={() => setMode(id)}
          className={clsx(
            "cursor-pointer px-4 py-2 text-[13px] font-semibold transition-colors",
            mode === id ? "bg-brand text-white" : panel ? "bg-transparent text-muted-2 hover:text-white" : "bg-white text-muted hover:text-ink",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );

  if (mode === "placa") {
    return (
      <div
        id="vehiculo"
        className={clsx(panel ? "flex flex-col gap-3" : "flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-float sm:p-6")}
      >
        {tabs}
        <form onSubmit={submitPlate} className="flex flex-wrap items-end gap-3">
          {!panel && (
            <div className="flex basis-[200px] flex-col gap-1">
              <span className="font-display text-base font-bold">Busca con tu placa</span>
              <span className="text-[13px] text-muted">Vemos el VIN y qué piezas tenemos</span>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`placa-${variant}`} className={labelCls}>
              Placa
            </label>
            <div className="flex h-11 items-stretch overflow-hidden rounded-[10px] border-[1.5px] border-line-2 bg-white">
              <span className="flex w-7 items-center justify-center bg-[#003b7a] text-[9px] font-bold text-white">PE</span>
              <input
                id={`placa-${variant}`}
                value={plate}
                onChange={(e) => setPlate(formatPlate(e.target.value))}
                placeholder="ABC-123"
                autoComplete="off"
                className="w-[140px] border-0 px-2 text-center font-display text-base font-extrabold tracking-[0.14em] text-ink uppercase placeholder:font-normal placeholder:tracking-normal placeholder:text-line-2 focus:outline-none"
              />
            </div>
          </div>
          <button type="submit" className={clsx(panel ? "btn-accent h-10 text-[13px]" : "btn-dark h-11")}>
            <ScanLine className="size-4" strokeWidth={2.2} />
            Ver piezas
          </button>
          {plateError && <span className="basis-full text-xs text-danger">{plateError}</span>}
        </form>
      </div>
    );
  }

  return (
    <div
      id="vehiculo"
      className={clsx(panel ? "flex flex-col gap-3" : "flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-float sm:p-6")}
    >
      {tabs}
      <form onSubmit={submitVehicle} className={clsx(panel ? "flex flex-col gap-2.5" : "flex flex-wrap items-end gap-4")}>
        {!panel && (
          <div className="flex basis-[200px] flex-col gap-1">
            <span className="font-display text-base font-bold">Busca por tu vehículo</span>
            <span className="text-[13px] text-muted">Solo verás piezas compatibles</span>
          </div>
        )}
        <div className={clsx("flex flex-col gap-1.5", !panel && "min-w-[150px] flex-1")}>
          <label htmlFor={`vs-make-${variant}`} className={labelCls}>
            Marca
          </label>
          <select
            id={`vs-make-${variant}`}
            className={selectCls}
            value={make}
            onChange={(e) => {
              setMake(e.target.value);
              setModel("");
            }}
          >
            <option value="">Marca</option>
            {vehicleMakes.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className={clsx("flex flex-col gap-1.5", !panel && "min-w-[150px] flex-1")}>
          <label htmlFor={`vs-model-${variant}`} className={labelCls}>
            Modelo
          </label>
          <select
            id={`vs-model-${variant}`}
            className={selectCls}
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setYear("");
            }}
            disabled={!make}
          >
            <option value="">{make ? `Modelo (${models.length})` : "Modelo"}</option>
            {models.map((m) => (
              <option key={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
        <div className={clsx("flex flex-col gap-1.5", !panel && "min-w-[120px] flex-1")}>
          <label htmlFor={`vs-year-${variant}`} className={labelCls}>
            Año
          </label>
          <select id={`vs-year-${variant}`} className={selectCls} value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Año</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
        <button type="submit" className={clsx(panel ? "btn-accent h-10 text-[13px]" : "btn-dark h-11")} disabled={!make}>
          {panel ? "Aplicar" : "Ver repuestos"}
        </button>
      </form>
    </div>
  );
}
