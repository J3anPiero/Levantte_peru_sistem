import Link from "next/link";
import { notFound } from "next/navigation";
import { Construction } from "lucide-react";
import { adminModules } from "@/components/admin/admin-modules";

const descriptions: Record<string, string> = {
  categorias: "Árbol de categorías y subcategorías, orden de visualización e imágenes de portada.",
  marcas: "Marcas de repuestos (originales y alternativas) con logotipo y descripción.",
  vehiculos: "Base de marcas, modelos, años y motores, y asignación de compatibilidades por producto.",
  inventario: "Stock por almacén, stock mínimo, reservas y movimientos de entrada, salida y ajuste.",
  precios: "Listas de precios, precio de oferta, márgenes y precios mayoristas.",
  promociones: "Cupones, descuentos por categoría o marca y vigencias.",
  clientes: "Clientes persona y empresa, documentos, direcciones e historial de pedidos.",
  pagos: "Conciliación de pagos por pasarela y emisión de boletas y facturas electrónicas.",
  envios: "Guías de despacho, transportistas, tarifas por zona y seguimiento.",
  ventas: "Ventas por día, categoría, marca y canal, con comparativos.",
  reportes: "Reportes descargables de ventas, productos, inventario y clientes.",
  configuracion: "Datos de la empresa, métodos de pago y envío, correos transaccionales e integraciones.",
  usuarios: "Usuarios del panel, roles, permisos y registro de auditoría.",
};

export function generateStaticParams() {
  return Object.keys(descriptions).map((modulo) => ({ modulo }));
}

export default async function AdminModule({ params }: { params: Promise<{ modulo: string }> }) {
  const { modulo } = await params;
  const item = adminModules.flatMap((g) => g.items).find((i) => i.href === `/admin/${modulo}`);
  if (!item || !descriptions[modulo]) notFound();
  return (
    <>
      <h1 className="text-2xl font-bold sm:text-[26px]">{item.label}</h1>
      <div className="card flex max-w-[640px] flex-col items-start gap-3 p-8">
        <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft"><Construction className="size-6 text-brand-deep" /></span>
        <h2 className="text-lg font-bold">Módulo planificado para la fase 2</h2>
        <p className="m-0 text-sm leading-relaxed text-muted">{descriptions[modulo]}</p>
        <p className="m-0 text-sm leading-relaxed text-muted">Este módulo se activará al conectar el panel con la API y la base de datos. La estructura de navegación y permisos ya está prevista en la arquitectura.</p>
        <Link href="/admin" className="btn-outline mt-2 h-10 text-[13px]">Volver al dashboard</Link>
      </div>
    </>
  );
}
