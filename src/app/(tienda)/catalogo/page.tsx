import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import type { SearchParams } from "@/lib/catalog-params";

export const metadata: Metadata = {
  title: "Catálogo de repuestos",
  description: "Explora repuestos originales y alternativos por categoría, marca, vehículo, precio y disponibilidad.",
};

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  return <CatalogView sp={sp} />;
}
