import type { Metadata } from "next";
import { ContentPage, Section } from "@/components/ui/content-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Preguntas frecuentes" };

const groups = [
  {
    id: "compras",
    title: "Compras y compatibilidad",
    items: [
      ["¿Cómo sé si el repuesto es compatible con mi vehículo?", "Usa el selector “Busca por tu vehículo” en el inicio o en el catálogo. Cada ficha muestra la tabla de compatibilidad por marca, modelo, año y motor. Si tienes dudas, un asesor la confirma por WhatsApp con tu número de placa o VIN."],
      ["¿Puedo buscar por número de parte?", "Sí. El buscador acepta nombre, código interno, número OEM y referencia del fabricante."],
      ["¿Venden a talleres y mayoristas?", "Sí. Escríbenos desde la página de contacto para acceder a precios por volumen y crédito para empresas."],
    ],
  },
  {
    id: "envios",
    title: "Envíos y entregas",
    items: [
      ["¿Cuánto cuesta el envío?", `En Lima Metropolitana el envío es gratis en compras desde S/ ${site.freeShippingFrom}; de lo contrario cuesta S/ ${site.limaShippingCost}. A provincias el costo referencial es S/ ${site.provinceShippingCost} con Olva o Shalom, con opción de pago en destino.`],
      ["¿Cuánto demora la entrega?", "Lima: 24 horas hábiles. Provincias: de 2 a 5 días hábiles según destino. También puedes recoger en tienda en 2 horas."],
      ["¿Cómo hago seguimiento?", "Recibirás el número de seguimiento por correo y WhatsApp. También puedes consultarlo desde tu cuenta."],
    ],
  },
  {
    id: "pagos",
    title: "Pagos y comprobantes",
    items: [
      ["¿Qué métodos de pago aceptan?", "Tarjetas Visa, Mastercard y American Express, Yape, Plin, transferencia bancaria y pago contra entrega en Lima."],
      ["¿Emiten factura?", "Sí. Elige “Factura” en el checkout e ingresa tu RUC. Boletas y facturas se emiten electrónicamente y llegan a tu correo."],
      ["¿Es seguro pagar en la web?", "Los pagos con tarjeta se procesan en la pasarela certificada; nunca almacenamos tus datos de tarjeta."],
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) => g.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))),
  };
  return (
    <ContentPage kicker="Ayuda" title="Preguntas frecuentes" intro="Resolvemos las dudas más comunes sobre compatibilidad, envíos, pagos y garantías.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {groups.map((g) => (
        <Section key={g.id} id={g.id} title={g.title}>
          <div className="flex flex-col gap-2">
            {g.items.map(([q, a]) => (
              <details key={q} className="card group px-5 py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 font-semibold [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="shrink-0 text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="m-0 pb-4 text-[15px] leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </Section>
      ))}
    </ContentPage>
  );
}
