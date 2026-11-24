import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PlateLookup } from "@/components/plate/plate-lookup";

export const metadata: Metadata = {
  title: "Buscar repuestos por placa",
  description:
    "Escribe la placa de tu vehículo y te mostramos el VIN, el despiece por sistemas y qué repuestos tenemos en stock para ese auto.",
};

export default async function PlatePage({ searchParams }: { searchParams: Promise<{ p?: string | string[] }> }) {
  const sp = await searchParams;
  const initial = Array.isArray(sp.p) ? sp.p[0] : sp.p;
  return (
    <div className="container-x flex flex-col gap-5 py-5 pb-16">
      <Breadcrumbs items={[{ label: "Buscar por placa" }]} />
      <PlateLookup initialPlate={initial ?? ""} />
    </div>
  );
}
