"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { adminModules } from "./admin-modules";

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Módulos" className="flex flex-col">
      {adminModules.map((g) => (
        <div key={g.group || "main"} className="flex flex-col">
          {g.group && <div className="px-3.5 pt-[18px] pb-1.5 text-[11px] font-bold tracking-[0.12em] text-muted uppercase">{g.group}</div>}
          {g.items.map(({ href, label, Icon, badge }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={clsx(
                  "flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-sm font-medium no-underline",
                  active ? "bg-steel text-white shadow-[inset_3px_0_0_#F0702A]" : "text-muted-2 hover:bg-steel hover:text-white",
                )}
              >
                <Icon className="size-[18px] shrink-0" strokeWidth={2} />
                <span className="truncate">{label}</span>
                {badge ? <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-ink">{badge}</span> : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
