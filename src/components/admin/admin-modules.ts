import {
  BarChart3, Boxes, Car, ClipboardList, CreditCard, FileBarChart, LayoutDashboard, Package, Percent, Settings, Tag, Tags, Truck, Users, UserCog,
  type LucideIcon,
} from "lucide-react";
import { orders } from "@/data/orders";

export interface AdminModule {
  href: string;
  label: string;
  Icon: LucideIcon;
  badge?: number;
}

export const adminModules: { group: string; items: AdminModule[] }[] = [
  { group: "", items: [{ href: "/admin", label: "Dashboard", Icon: LayoutDashboard }] },
  {
    group: "Catálogo",
    items: [
      { href: "/admin/productos", label: "Productos", Icon: Package },
      { href: "/admin/categorias", label: "Categorías", Icon: Tags },
      { href: "/admin/marcas", label: "Marcas", Icon: Tag },
      { href: "/admin/vehiculos", label: "Vehículos y compatibilidad", Icon: Car },
    ],
  },
  {
    group: "Inventario y precios",
    items: [
      { href: "/admin/inventario", label: "Inventario y stock", Icon: Boxes },
      { href: "/admin/precios", label: "Precios", Icon: BarChart3 },
      { href: "/admin/promociones", label: "Promociones y cupones", Icon: Percent },
    ],
  },
  {
    group: "Operación",
    items: [
      { href: "/admin/pedidos", label: "Pedidos", Icon: ClipboardList, badge: orders.filter((o) => o.status !== "entregado" && o.status !== "cancelado").length },
      { href: "/admin/clientes", label: "Clientes", Icon: Users },
      { href: "/admin/pagos", label: "Pagos y facturación", Icon: CreditCard },
      { href: "/admin/envios", label: "Envíos", Icon: Truck },
    ],
  },
  {
    group: "Análisis",
    items: [
      { href: "/admin/ventas", label: "Ventas", Icon: BarChart3 },
      { href: "/admin/reportes", label: "Reportes", Icon: FileBarChart },
    ],
  },
  {
    group: "Sistema",
    items: [
      { href: "/admin/configuracion", label: "Configuración", Icon: Settings },
      { href: "/admin/usuarios", label: "Usuarios y roles", Icon: UserCog },
    ],
  },
];
