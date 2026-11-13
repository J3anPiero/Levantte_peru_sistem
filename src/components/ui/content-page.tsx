import { Breadcrumbs } from "./breadcrumbs";

interface Props {
  title: string;
  intro?: string;
  kicker?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}

/** Plantilla para páginas corporativas y legales. */
export function ContentPage({ title, intro, kicker, children, aside }: Props) {
  return (
    <div className="container-x flex flex-col gap-6 py-6 pb-20">
      <Breadcrumbs items={[{ label: title }]} />
      <header className="flex max-w-[820px] flex-col gap-3">
        {kicker && <span className="kicker">{kicker}</span>}
        <h1 className="text-3xl font-bold tracking-tight sm:text-[40px]">{title}</h1>
        {intro && <p className="m-0 text-[17px] leading-relaxed text-muted">{intro}</p>}
      </header>
      <div className={aside ? "grid items-start gap-8 lg:grid-cols-[1fr_340px]" : ""}>
        <div className="flex max-w-[820px] flex-col gap-8">{children}</div>
        {aside}
      </div>
    </div>
  );
}

export function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-3 scroll-mt-6">
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}
