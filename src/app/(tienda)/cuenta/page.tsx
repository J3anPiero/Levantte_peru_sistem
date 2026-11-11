import type { Metadata } from "next";
import Link from "next/link";
import { Heart, MapPin, Package, UserRound } from "lucide-react";
import { ContentPage } from "@/components/ui/content-page";

export const metadata: Metadata = { title: "Mi cuenta" };

export default function AccountPage() {
  return (
    <ContentPage kicker="Mi cuenta" title="Ingresa a tu cuenta" intro="Sigue tus pedidos, guarda direcciones y vehículos, y compra más rápido.">
      <div className="grid items-start gap-6 md:grid-cols-2">
        <form className="card flex flex-col gap-4 p-6" action="#" method="post">
          <h2 className="text-lg font-bold">Iniciar sesión</h2>
          <div className="flex flex-col gap-1.5"><label htmlFor="l-email" className="label">Correo electrónico</label><input id="l-email" type="email" autoComplete="email" className="input" /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="l-pass" className="label">Contraseña</label><input id="l-pass" type="password" autoComplete="current-password" className="input" /></div>
          <button type="submit" className="btn-primary">Ingresar</button>
          <Link href="/cuenta" className="text-[13px] font-semibold">¿Olvidaste tu contraseña?</Link>
          <p className="m-0 text-xs text-muted">La autenticación se activará al conectar con la API (fase 2).</p>
        </form>
        <div className="flex flex-col gap-4">
          <div className="card flex flex-col gap-3 p-6">
            <h2 className="text-lg font-bold">¿Nuevo en LEVANTE PERÚ?</h2>
            <p className="m-0 text-sm text-muted">Crea tu cuenta para acceder a:</p>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm">
              <li className="flex items-center gap-2.5"><Package className="size-[18px] text-brand-deep" />Historial y seguimiento de pedidos</li>
              <li className="flex items-center gap-2.5"><MapPin className="size-[18px] text-brand-deep" />Direcciones y datos de facturación guardados</li>
              <li className="flex items-center gap-2.5"><UserRound className="size-[18px] text-brand-deep" />Vehículos guardados para filtrar el catálogo</li>
              <li className="flex items-center gap-2.5"><Heart className="size-[18px] text-brand-deep" />Favoritos y recompras rápidas</li>
            </ul>
            <button type="button" className="btn-dark self-start">Crear cuenta</button>
          </div>
        </div>
      </div>
    </ContentPage>
  );
}
