"use client";

import { useRef } from "react";

/**
 * Formulario GET que se envía solo al cambiar un control (checkbox, select),
 * manteniendo los filtros en la URL para que sean compartibles e indexables.
 */
export function AutoSubmitForm({ action, children, className }: { action: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={action}
      method="get"
      className={className}
      onChange={(e) => {
        const target = e.target as unknown as HTMLInputElement;
        if (target.tagName === "SELECT" || target.type === "checkbox") ref.current?.requestSubmit();
      }}
    >
      {children}
    </form>
  );
}
