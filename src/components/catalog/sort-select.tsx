"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { sortOptions } from "@/lib/catalog-params";

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  return (
    <>
      <label htmlFor="orden" className="text-[13px] text-muted">Ordenar por</label>
      <select
        id="orden"
        value={value}
        onChange={(e) => {
          const params = new URLSearchParams(sp.toString());
          params.set("orden", e.target.value);
          params.delete("pagina");
          router.push(`${pathname}?${params.toString()}`);
        }}
        className="h-10 rounded-[10px] border-[1.5px] border-line-2 bg-white px-3 text-[13px] font-semibold"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </>
  );
}
