"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { vehicleMakes, vehicleModels, vehicleYears } from "@/data/brands";

interface Props {
  variant?: "bar" | "panel";
  initial?: { make?: string; model?: string; year?: number };
  categorySlug?: string;
}

export function VehicleSelector({ variant = "bar", initial, categorySlug }: Props) {
  const router = useRouter();
  const [make, setMake] = useState(initial?.make ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [year, setYear] = useState(initial?.year ? String(initial.year) : "");
  const models = make ? vehicleModels[make] ?? [] : [];
  const panel = variant === "panel";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (make) params.set("vmarca", make);
    if (model) params.set("vmodelo", model);
    if (year) params.set("vanio", year);
    router.push(`/catalogo${categorySlug ? `/${categorySlug}` : ""}?${params.toString()}`);
  }

  const selectCls = clsx("input h-11", panel && "h-10 text-[13px]");
  const labelCls = clsx("text-xs font-semibold tracking-[0.04em]", panel ? "sr-only" : "text-muted");

  return (
    <form
      onSubmit={submit}
      id="vehiculo"
      className={clsx(
        panel
          ? "flex flex-col gap-2.5"
          : "flex flex-wrap items-end gap-4 rounded-2xl bg-white p-5 shadow-float sm:p-6",
      )}
    >
      {!panel && (
        <div className="flex basis-[200px] flex-col gap-1">
          <span className="font-display text-base font-bold">Busca por tu vehículo</span>
          <span className="text-[13px] text-muted">Solo verás piezas compatibles</span>
        </div>
      )}
      <div className={clsx("flex flex-col gap-1.5", !panel && "min-w-[150px] flex-1")}>
        <label htmlFor="vs-make" className={labelCls}>Marca</label>
        <select id="vs-make" className={selectCls} value={make} onChange={(e) => { setMake(e.target.value); setModel(""); }}>
          <option value="">Marca</option>
          {vehicleMakes.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div className={clsx("flex flex-col gap-1.5", !panel && "min-w-[150px] flex-1")}>
        <label htmlFor="vs-model" className={labelCls}>Modelo</label>
        <select id="vs-model" className={selectCls} value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
          <option value="">Modelo</option>
          {models.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div className={clsx("flex flex-col gap-1.5", !panel && "min-w-[120px] flex-1")}>
        <label htmlFor="vs-year" className={labelCls}>Año</label>
        <select id="vs-year" className={selectCls} value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Año</option>
          {vehicleYears.map((y) => <option key={y}>{y}</option>)}
        </select>
      </div>
      <button type="submit" className={clsx(panel ? "btn-accent h-10 text-[13px]" : "btn-dark h-11")} disabled={!make}>
        {panel ? "Aplicar" : "Ver repuestos"}
      </button>
    </form>
  );
}
