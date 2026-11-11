import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { CatalogView } from "@/components/catalog/catalog-view";
import type { SearchParams } from "@/lib/catalog-params";

interface Props {
  params: Promise<{ categoria: string }>;
  searchParams: Promise<SearchParams>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const cat = getCategory(categoria);
  if (!cat) return {};
  return { title: cat.name, description: cat.description || `Repuestos de ${cat.name.toLowerCase()} originales y alternativos.` };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categoria } = await params;
  if (!getCategory(categoria)) notFound();
  const sp = await searchParams;
  return <CatalogView sp={sp} categorySlug={categoria} />;
}
