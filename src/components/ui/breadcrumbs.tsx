import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Migas de pan" className={`flex flex-wrap gap-2 text-[13px] text-muted ${className}`}>
      <Link href="/" className="text-muted no-underline hover:text-ink">Inicio</Link>
      {items.map((c, i) => (
        <Fragment key={i}>
          <span aria-hidden="true">›</span>
          {c.href && i < items.length - 1 ? (
            <Link href={c.href} className="text-muted no-underline hover:text-ink">{c.label}</Link>
          ) : (
            <span className="font-semibold text-ink">{c.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
