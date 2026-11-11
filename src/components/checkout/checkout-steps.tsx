import clsx from "clsx";
import { Check } from "lucide-react";

const steps = ["Carrito", "Datos y envío", "Pago", "Confirmación"];

export function CheckoutSteps({ current }: { current: number }) {
  return (
    <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 text-[13px] text-muted">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span className={clsx("flex items-center gap-2", active && "font-bold text-ink")}>
              <span
                className={clsx(
                  "flex size-7 items-center justify-center rounded-full text-xs font-bold",
                  done ? "bg-ok text-white" : active ? "bg-ink text-white" : "border-2 border-line-2 text-muted",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} /> : n}
              </span>
              <span className={clsx(!active && "hidden sm:inline")}>{label}</span>
            </span>
            {n < steps.length && <span className={clsx("h-0.5 w-6 sm:w-8", done ? "bg-ok" : "bg-line-2")} />}
          </li>
        );
      })}
    </ol>
  );
}
