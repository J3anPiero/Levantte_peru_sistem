import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContentPage, Section } from "@/components/ui/content-page";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contacto" };

export default function ContactPage() {
  return (
    <ContentPage
      kicker="Contacto"
      title="Hablemos de tu vehículo"
      intro="Escríbenos para confirmar compatibilidades, cotizar por volumen o resolver cualquier duda sobre tu pedido."
      aside={
        <aside className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-card bg-ink p-6 text-sm text-muted-2">
            <div className="flex gap-3"><MapPin className="size-5 shrink-0 text-brand" /><span><strong className="block text-white">Tienda y almacén</strong>{site.address}</span></div>
            <div className="flex gap-3"><Clock className="size-5 shrink-0 text-brand" /><span><strong className="block text-white">Horario</strong>{site.hours}</span></div>
            <div className="flex gap-3"><Phone className="size-5 shrink-0 text-brand" /><span><strong className="block text-white">Teléfono</strong>{site.phone}</span></div>
            <div className="flex gap-3"><Mail className="size-5 shrink-0 text-brand" /><span><strong className="block text-white">Correo</strong>{site.email}</span></div>
            <a href={whatsappLink("Hola LEVANTE PERÚ, quisiera hacer una consulta.")} target="_blank" rel="noopener noreferrer" className="btn mt-1 bg-whatsapp text-ink hover:bg-[#1fb957]"><MessageCircle className="size-[18px]" />Escribir por WhatsApp</a>
          </div>
          <div className="card flex min-h-[220px] items-center justify-center p-6 text-center text-sm text-muted">[Mapa de ubicación: insertar iframe de Google Maps del local]</div>
        </aside>
      }
    >
      <Section title="Envíanos un mensaje">
        <form className="card flex flex-col gap-4 p-6" action="#" method="post">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5"><label htmlFor="c-nombre" className="label">Nombre</label><input id="c-nombre" name="nombre" className="input" required /></div>
            <div className="flex flex-col gap-1.5"><label htmlFor="c-tel" className="label">Celular</label><input id="c-tel" name="telefono" type="tel" className="input" /></div>
          </div>
          <div className="flex flex-col gap-1.5"><label htmlFor="c-email" className="label">Correo electrónico</label><input id="c-email" name="email" type="email" className="input" required /></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="c-tipo" className="label">Motivo</label><select id="c-tipo" name="motivo" className="input"><option>Consulta de compatibilidad</option><option>Cotización mayorista</option><option>Estado de mi pedido</option><option>Garantía o devolución</option><option>Otro</option></select></div>
          <div className="flex flex-col gap-1.5"><label htmlFor="c-msg" className="label">Mensaje</label><textarea id="c-msg" name="mensaje" rows={5} className="input h-auto py-3" placeholder="Incluye marca, modelo, año y número de parte si lo tienes" /></div>
          <button type="submit" className="btn-primary self-start">Enviar mensaje</button>
          <p className="m-0 text-xs text-muted">El envío del formulario se conectará al módulo de clientes y al correo de ventas en la integración con la API.</p>
        </form>
      </Section>
      <Section id="reclamaciones" title="Libro de reclamaciones">
        <p>Conforme a la Ley N.º 29571, ponemos a tu disposición el Libro de Reclamaciones virtual. [Enlazar al formulario oficial o al proveedor del libro de reclamaciones electrónico.]</p>
      </Section>
    </ContentPage>
  );
}
