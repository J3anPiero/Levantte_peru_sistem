"use client";

import { useId } from "react";
import clsx from "clsx";

export const VIEW_W = 400;
export const VIEW_H = 190;

/* ------------------------------------------------------------- carrocerías */

export type ShapeId = "sedan" | "hatchback" | "suv" | "pickup";

interface Shape {
  /** Contorno de la carrocería, recorrido del frente a la cola. */
  body: string;
  /** Lunas en orden: parabrisas, laterales y luneta. */
  glass: string[];
  /** Cortes de puerta, trazados como línea. */
  doors: string;
  /** Manijas: una por puerta visible. */
  handles: [number, number][];
  /** Detalle propio de la carrocería (barras de techo, baranda del platón). */
  trim?: string;
  lampFront: string;
  lampRear: string;
  mirror: string;
  /** Las ruedas: el eje trasero se corre porque una doble cabina es más larga. */
  wheel: { r: number; rear: number };
}

/*
 * Cuatro siluetas sobre el mismo lienzo de 400 × 190. Comparten el eje
 * delantero en x = 105 y el suelo en y = 150 a propósito: los puntos del
 * despiece viven en `teardown.ts` con coordenadas fijas, así que si una
 * carrocería moviera la rueda delantera, el punto de frenos dejaría de caer
 * sobre ella. El eje trasero sí se mueve, porque ningún punto lo usa de
 * referencia.
 */
const shapes: Record<ShapeId, Shape> = {
  sedan: {
    body: "M16 142 L19 117 Q23 107 39 105 L120 99 L152 65 Q157 59 168 59 L249 59 Q260 59 265 65 L295 99 L371 105 Q384 107 384 119 L384 142 Z",
    glass: ["M157 67 L194 67 L194 95 L133 95 Z", "M206 67 L245 67 L268 95 L206 95 Z"],
    doors: "M200 96 L200 138 M272 96 L272 138",
    handles: [
      [214, 107],
      [284, 107],
    ],
    lampFront: "M20 112 L38 109 L38 120 L21 122 Z",
    lampRear: "M372 110 L384 112 L384 123 L371 122 Z",
    mirror: "M152 92 L145 91 L144 98 L152 98 Z",
    wheel: { r: 27, rear: 300 },
  },
  /*
   * El hatchback se define por lo que NO tiene: cola. El techo corre hasta
   * casi encima de la rueda trasera y el portón baja de golpe. Si se le deja
   * el voladizo largo del sedán, queda un sedán con la luneta inclinada, que
   * es exactamente lo que no es.
   */
  hatchback: {
    body: "M30 142 L33 117 Q37 107 53 105 L124 99 L152 63 Q157 57 168 57 L284 57 Q294 57 298 63 L330 100 Q342 103 342 117 L342 142 Z",
    glass: ["M157 65 L193 65 L193 95 L134 95 Z", "M206 65 L250 65 L250 95 L206 95 Z", "M261 65 L287 65 L307 95 L261 95 Z"],
    doors: "M200 96 L200 138 M256 96 L256 138",
    handles: [
      [212, 107],
      [268, 107],
    ],
    lampFront: "M34 112 L52 109 L52 120 L35 122 Z",
    lampRear: "M321 99 L335 104 L335 120 L320 119 Z",
    mirror: "M151 92 L144 91 L143 98 L151 98 Z",
    wheel: { r: 27, rear: 292 },
  },
  suv: {
    body: "M15 138 L18 108 Q22 97 38 95 L114 89 L143 51 Q149 45 161 45 L281 45 Q291 45 296 51 L326 89 L374 95 Q387 97 387 111 L387 138 Z",
    glass: [
      "M148 53 L193 53 L193 87 L126 87 Z",
      "M206 53 L252 53 L252 87 L206 87 Z",
      "M264 53 L278 53 L300 87 L264 87 Z",
    ],
    doors: "M199 88 L199 134 M258 88 L258 134",
    handles: [
      [212, 99],
      [270, 99],
    ],
    trim: "M154 43 L278 43",
    lampFront: "M19 102 L39 99 L39 111 L20 113 Z",
    lampRear: "M374 96 L387 98 L387 114 L373 113 Z",
    mirror: "M143 84 L136 83 L135 90 L143 90 Z",
    wheel: { r: 30, rear: 302 },
  },
  pickup: {
    body: "M15 138 L18 110 Q22 99 38 97 L112 91 L142 51 Q148 45 160 45 L249 45 Q259 45 264 51 L286 89 L286 83 L389 83 L389 138 Z",
    glass: ["M147 53 L192 53 L192 88 L125 88 Z", "M205 53 L245 53 L262 88 L205 88 Z"],
    doors: "M198 89 L198 134",
    handles: [[211, 100]],
    trim: "M288 89 L387 89 M332 92 L332 134",
    lampFront: "M19 104 L39 101 L39 113 L20 115 Z",
    lampRear: "M377 99 L389 101 L389 116 L376 115 Z",
    mirror: "M142 85 L135 84 L134 91 L142 91 Z",
    wheel: { r: 31, rear: 318 },
  },
};

/** Quita tildes y mayúsculas para poder comparar por palabra suelta. */
function plano(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * De la carrocería que declara el padrón a una de las cuatro siluetas. El
 * padrón escribe texto libre ("Pickup doble cabina"), así que se busca por
 * palabra y no por igualdad. Lo que no se reconoce cae en sedán, la carrocería
 * más común del parque peruano.
 */
export function bodyShape(bodyType: string): ShapeId {
  const t = plano(bodyType);
  if (/pick|camioneta|platon|cabina/.test(t)) return "pickup";
  if (/suv|todoterreno|crossover|4x4/.test(t)) return "suv";
  if (/hatch|station|wagon|van/.test(t)) return "hatchback";
  return "sedan";
}

/* ------------------------------------------------------------------ pintura */

interface Paint {
  light: string;
  base: string;
  dark: string;
}

const paints: Record<string, Paint> = {
  blanco: { light: "#ffffff", base: "#e6e8ec", dark: "#b9bdc6" },
  plata: { light: "#e8ebf0", base: "#bcc1ca", dark: "#8b9099" },
  grafito: { light: "#5a5e66", base: "#36383e", dark: "#212328" },
  gris: { light: "#949aa3", base: "#656a73", dark: "#44484f" },
  negro: { light: "#33353b", base: "#161719", dark: "#0a0a0c" },
  rojo: { light: "#f2342a", base: "#c40b05", dark: "#850604" },
  azul: { light: "#3b7ed1", base: "#1a4f95", dark: "#0e3064" },
  verde: { light: "#3f9a63", base: "#1f6b3e", dark: "#124327" },
  amarillo: { light: "#ffd34d", base: "#e9a712", dark: "#a8750a" },
  naranja: { light: "#ff9140", base: "#e2600c", dark: "#9c4108" },
  beige: { light: "#e8dcc4", base: "#c9b795", dark: "#9a8a6c" },
  marron: { light: "#8a6448", base: "#5d422f", dark: "#3c2a1e" },
};

/*
 * El orden importa: "gris grafito" tiene que resolver a grafito y no a gris, y
 * "blanco perla" a blanco. Por eso se recorre una lista y no el objeto, cuyo
 * orden no está pensado para esto.
 */
const paintOrder = [
  "grafito",
  "blanco",
  "plata",
  "negro",
  "rojo",
  "azul",
  "verde",
  "amarillo",
  "naranja",
  "beige",
  "marron",
  "gris",
];

/** Del color del padrón a la pintura. Un color desconocido se pinta plata. */
export function vehiclePaint(color: string): Paint {
  const c = plano(color);
  const found = paintOrder.find((name) => c.includes(name));
  return paints[found ?? "plata"];
}

/* ------------------------------------------------------------------- dibujo */

interface Props {
  bodyType: string;
  color: string;
  /** "pintada" usa el color real del vehículo; "plano" es el esquema del despiece. */
  variant?: "pintada" | "plano";
  className?: string;
  /** Cadena vacía = decorativa: el texto de al lado ya dice qué vehículo es. */
  label?: string;
}

/**
 * Silueta del vehículo. Es una ilustración: representa la carrocería y el color
 * que declara el padrón, no es una foto de la unidad. Eso se dice también en la
 * interfaz, porque en una tienda de repuestos confundir el vehículo es el error
 * que termina en una pieza que no calza.
 */
export function VehicleArt({ bodyType, color, variant = "pintada", className, label }: Props) {
  const uid = useId().replace(/:/g, "");
  const shape = shapes[bodyShape(bodyType)];
  const paint = vehiclePaint(color);
  const pintada = variant === "pintada";

  const cuerpo = pintada ? `url(#carroceria${uid})` : "#17171b";
  const borde = pintada ? paint.dark : "#e10600";
  const luna = pintada ? `url(#luna${uid})` : "#26262d";
  const detalle = pintada ? paint.dark : "#32323b";

  // Dentro de un botón que ya nombra el vehículo, la silueta no aporta nada al
  // lector de pantalla: repetirla solo alarga la lectura de la lista.
  const decorativa = label === "";

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className={clsx("block", className)}
      role={decorativa ? "presentation" : "img"}
      aria-hidden={decorativa || undefined}
      aria-label={
        decorativa ? undefined : (label ?? `Ilustración referencial de un ${bodyType.toLowerCase()} color ${color.toLowerCase()}`)
      }
    >
      <defs>
        {/* La luz entra por arriba: el techo recibe el tono claro y los bajos el
            oscuro. Sin esto la silueta se lee como una mancha de color plano. */}
        <linearGradient id={`carroceria${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={paint.light} />
          <stop offset="55%" stopColor={paint.base} />
          <stop offset="100%" stopColor={paint.dark} />
        </linearGradient>
        <linearGradient id={`luna${uid}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#4a5260" />
          <stop offset="100%" stopColor="#1b1f26" />
        </linearGradient>
      </defs>

      <ellipse cx="200" cy="178" rx="186" ry="7" fill={pintada ? "rgba(0,0,0,0.30)" : "rgba(225,6,0,0.16)"} />

      <path d={shape.body} fill={cuerpo} stroke={borde} strokeWidth={pintada ? 1.5 : 2} strokeLinejoin="round" />

      {/* El filo claro de las lunas existe por los autos oscuros: sin él, en un
          Sportage negro el vidrio y la chapa son el mismo tono y el auto se lee
          como una mancha. Sobre un auto blanco casi no se nota. */}
      {shape.glass.map((d) => (
        <path key={d} d={d} fill={luna} stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      ))}

      <path d={shape.doors} stroke={detalle} strokeWidth="1.5" fill="none" />
      {shape.trim && <path d={shape.trim} stroke={detalle} strokeWidth="2.5" strokeLinecap="round" fill="none" />}
      {shape.handles.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="15" height="3" rx="1.5" fill={detalle} />
      ))}
      <path d={shape.mirror} fill={detalle} />

      <path d={shape.lampFront} fill={pintada ? "#ffeab0" : "#e10600"} opacity={pintada ? 1 : 0.85} />
      <path d={shape.lampRear} fill={pintada ? "#d4211a" : "#8c0300"} />

      {[105, shape.wheel.rear].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="150" r={shape.wheel.r} fill="#0a0a0b" stroke="#32323b" strokeWidth="3" />
          <circle
            cx={cx}
            cy="150"
            r={shape.wheel.r * 0.45}
            fill={pintada ? "#9aa0ab" : "#1c1c21"}
            stroke={pintada ? "#5c626c" : "#4a4a55"}
            strokeWidth="2"
          />
        </g>
      ))}
    </svg>
  );
}
