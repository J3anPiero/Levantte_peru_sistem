import Link from "next/link";
import { SearchX } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container-x flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
        <SearchX className="size-12 text-muted" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold tracking-tight">Página no encontrada</h1>
        <p className="m-0 max-w-[420px] text-muted">La página que buscas no existe o fue movida. Prueba con el buscador o vuelve al inicio.</p>
        <div className="flex gap-3"><Link href="/" className="btn-primary">Ir al inicio</Link><Link href="/catalogo" className="btn-outline">Ver catálogo</Link></div>
      </main>
      <Footer compact />
    </div>
  );
}
