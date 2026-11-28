"use client";

import clsx from "clsx";
import type { ZoneResult } from "@/lib/teardown";
import { VIEW_H, VIEW_W, VehicleArt } from "./vehicle-art";

interface Props {
  zones: ZoneResult[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  label: string;
  bodyType: string;
  color: string;
}

/**
 * Vista lateral del vehículo con un punto por sistema. El dibujo es el mismo de
 * `VehicleArt`, en su variante de esquema: así una Hilux se despieza con forma
 * de pickup y no con la silueta de sedán que servía para todos.
 *
 * Los puntos son botones HTML colocados sobre el dibujo, no elementos del SVG,
 * para que funcionen con teclado y lector de pantalla como cualquier control.
 */
export function CarDiagram({ zones, selected, onSelect, label, bodyType, color }: Props) {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
      <VehicleArt
        bodyType={bodyType}
        color={color}
        variant="plano"
        className="absolute inset-0 size-full"
        label={`Vista lateral de ${label}`}
      />

      {zones.map((zone, i) => {
        const isSelected = selected === zone.id;
        const empty = zone.parts.length === 0;
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onSelect(isSelected ? null : zone.id)}
            aria-pressed={isSelected}
            title={`${zone.label}: ${zone.parts.length} ${zone.parts.length === 1 ? "pieza" : "piezas"}`}
            className={clsx(
              "absolute flex size-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 text-[11px] font-bold transition-all duration-300 hover:scale-110",
              isSelected
                ? "border-white bg-brand text-white shadow-[0_0_0_6px_rgba(225,6,0,0.25)]"
                : empty
                  ? "border-white/25 bg-black/80 text-muted-2"
                  : "border-brand bg-black/80 text-white hover:bg-brand",
            )}
            style={{ left: `${(zone.hotspot.x / VIEW_W) * 100}%`, top: `${(zone.hotspot.y / VIEW_H) * 100}%` }}
          >
            <span className="sr-only">{zone.label}, </span>
            {i + 1}
            <span className="sr-only">
              {" "}
              · {zone.parts.length} {zone.parts.length === 1 ? "pieza" : "piezas"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
