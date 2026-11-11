"use client";

import { useState } from "react";
import clsx from "clsx";

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  return (
    <div className="card overflow-hidden">
      <div role="tablist" aria-label="Detalle del producto" className="flex flex-wrap border-b border-line px-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            id={`tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setActive(t.id)}
            className={clsx("-mb-px cursor-pointer border-b-[3px] px-4 py-3.5 text-sm font-semibold sm:px-5", active === t.id ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink")}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={active !== t.id} className="p-5 sm:p-7">
          {t.content}
        </div>
      ))}
    </div>
  );
}
