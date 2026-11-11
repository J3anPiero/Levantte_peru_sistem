import clsx from "clsx";
import { Check, Clock, Package, Truck, X } from "lucide-react";
import { orderStatusLabel } from "@/data/orders";
import type { OrderStatus } from "@/lib/types";

const styles: Record<OrderStatus, { cls: string; Icon: typeof Check }> = {
  pagado: { cls: "bg-ok-soft text-ok", Icon: Check },
  entregado: { cls: "bg-ok-soft text-ok", Icon: Check },
  por_validar: { cls: "bg-warn-soft text-warn", Icon: Clock },
  preparando: { cls: "bg-[#EEF1F5] text-ink", Icon: Package },
  en_camino: { cls: "bg-info-soft text-info", Icon: Truck },
  cancelado: { cls: "bg-danger-soft text-danger", Icon: X },
};

export function StatusPill({ status }: { status: OrderStatus }) {
  const { cls, Icon } = styles[status];
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap", cls)}>
      <Icon className="size-3" strokeWidth={3} />
      {orderStatusLabel[status]}
    </span>
  );
}
