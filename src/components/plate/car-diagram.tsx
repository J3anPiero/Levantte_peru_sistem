"use client";

import clsx from "clsx";
import type { ZoneResult } from "@/lib/teardown";

const VIEW_W = 400;
const VIEW_H = 190;

interface Props {
  zones: ZoneResult[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  label: string;
}

/**
 * Vista lateral del vehículo con un punto por sistema. Los puntos son botones
 * HTML colocados sobre el dibujo, no elementos del SVG, para que funcionen con
 * teclado y lector de pantalla como cualquier otro control.
 */
export function CarDiagram({ zones, selected, onSelect, label }: Props) {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="absolute inset-0 size-full" role="img" aria-label={`Vista lateral de ${label}`}>
        <ellipse cx="200" cy="178" rx="186" ry="7" fill="rgba(225,6,0,0.16)" />

        {/* Carrocería */}
        <path
          d="M16 142 L20 116 Q24 106 40 104 L120 98 L152 64 Q157 58 168 58 L250 58 Q261 58 266 64 L296 98 L372 104 Q384 106 384 118 L384 142 Z"
          fill="#17171b"
          stroke="#e10600"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Lunas */}
        <path d="M156 66 L193 66 L193 94 L131 94 Z" fill="#26262d" />
        <path d="M207 66 L246 66 L270 94 L207 94 Z" fill="#26262d" />

        {/* Líneas de puertas y manijas */}
        <path d="M200 96 L200 138 M272 96 L272 138" stroke="#32323b" strokeWidth="1.5" />
        <rect x="214" y="106" width="15" height="3" rx="1.5" fill="#32323b" />
        <rect x="284" y="106" width="15" height="3" rx="1.5" fill="#32323b" />

        {/* Faro y luz posterior */}
        <path d="M22 112 L38 109 L38 119 L22 121 Z" fill="#e10600" opacity="0.85" />
        <path d="M378 110 L384 110 L384 122 L376 122 Z" fill="#8c0300" />

        {/* Ruedas */}
        {[105, 300].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="150" r="27" fill="#0a0a0b" stroke="#32323b" strokeWidth="3" />
            <circle cx={cx} cy="150" r="12" fill="#1c1c21" stroke="#4a4a55" strokeWidth="2" />
          </g>
        ))}
      </svg>

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
