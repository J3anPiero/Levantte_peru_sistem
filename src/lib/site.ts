/**
 * Datos corporativos del sitio. Reemplazar los valores entre corchetes
 * con la información real de LEVANTE PERÚ antes de publicar.
 */
export const site = {
  name: "LEVANTE PERÚ",
  legalName: "LEVANTE PERÚ S.A.C.",
  ruc: "[RUC]",
  tagline: "Repuestos automotrices originales y alternativos",
  description:
    "Comercialización de repuestos automotrices originales y alternativos para el mercado peruano, con asesoría técnica y despacho a nivel nacional.",
  address: "[Dirección del local y almacén], Lima",
  phone: "[Teléfono]",
  /** Número en formato internacional sin "+" para los enlaces wa.me, por ejemplo 51987654321. */
  whatsapp: "51999999999",
  email: "ventas@levanteperu.pe",
  hours: "Lun–Sáb 8:00–18:00",
  social: {
    facebook: "#",
    instagram: "#",
    tiktok: "#",
    youtube: "#",
  },
  freeShippingFrom: 250,
  limaShippingCost: 15,
  provinceShippingCost: 25,
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
