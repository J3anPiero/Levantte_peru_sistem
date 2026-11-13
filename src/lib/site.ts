/**
 * Datos corporativos del sitio. Reemplazar los valores entre corchetes
 * con la información real de GAUDI antes de publicar.
 */
export const site = {
  name: "GAUDI",
  legalName: "GAUDI S.A.C.",
  ruc: "[RUC]",
  tagline: "Repuestos automotrices originales y alternativos",
  description:
    "Comercialización de repuestos automotrices originales y alternativos para el mercado peruano, con asesoría técnica y despacho a nivel nacional.",

  /** Ciudad donde están la tienda y el almacén. Define la zona de reparto local. */
  city: "Arequipa",
  /** Nombre de la zona de reparto propio, con entrega el mismo día o en 24 h. */
  metroArea: "Arequipa Metropolitana",
  address: "[Dirección del local y almacén], Arequipa",

  phone: "[Teléfono]",
  /** Número en formato internacional sin "+" para los enlaces wa.me, por ejemplo 51987654321. */
  whatsapp: "51999999999",
  email: "ventas@gaudi.pe",
  hours: "Lun–Sáb 8:00–18:00",
  social: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
    youtube: "#",
  },
  freeShippingFrom: 250,
  /** Costo de reparto dentro de la ciudad sede. */
  localShippingCost: 15,
  /** Costo referencial de envío al resto del país. */
  provinceShippingCost: 25,
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
