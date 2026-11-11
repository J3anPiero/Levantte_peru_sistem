"use client";

import clsx from "clsx";

interface Props {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "lg";
  id?: string;
  label?: string;
}

export function QuantityInput({ value, onChange, min = 1, max = 99, size = "sm", id = "qty", label = "Cantidad" }: Props) {
  const set = (n: number) => onChange(Math.min(max, Math.max(min, Math.floor(n) || min)));
  const lg = size === "lg";
  return (
    <div className={clsx("flex overflow-hidden rounded-[10px] border-[1.5px] border-line-2 bg-white", lg ? "h-[50px]" : "h-[42px]")}>
      <button type="button" aria-label="Disminuir cantidad" onClick={() => set(value - 1)} className={clsx("cursor-pointer text-xl text-ink hover:bg-mist", lg ? "w-[46px]" : "w-10")}>
        −
      </button>
      <label htmlFor={id} className="sr-only">{label}</label>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className={clsx("border-x-[1.5px] border-line-2 text-center font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none", lg ? "w-14 text-base" : "w-12 text-[15px]")}
      />
      <button type="button" aria-label="Aumentar cantidad" onClick={() => set(value + 1)} className={clsx("cursor-pointer text-xl text-ink hover:bg-mist", lg ? "w-[46px]" : "w-10")}>
        +
      </button>
    </div>
  );
}
