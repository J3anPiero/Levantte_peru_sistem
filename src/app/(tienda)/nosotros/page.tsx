import type { Metadata } from "next";
import { Award, Headset, ShieldCheck, Truck } from "lucide-react";
import { ContentPage, Section } from "@/components/ui/content-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Nosotros", description: `Conoce a ${site.name}: empresa peruana especializada en repuestos automotrices.` };

const values = [
  { Icon: ShieldCheck, t: "Confianza", d: "Cada pieza sale verificada por código y con comprobante electrónico." },
  { Icon: Award, t: "Calidad", d: "Trabajamos con marcas originales y alternativas homologadas." },
  { Icon: Headset, t: "Asesoría", d: "Técnicos que confirman la compatibilidad antes de que pagues." },
  { Icon: Truck, t: "Cumplimiento", d: "Despacho el mismo día en Lima y seguimiento a provincias." },
];

export default function AboutPage() {
  return (
    <ContentPage kicker="Nosotros" title="Repuestos con respaldo, para que tu vehículo no se detenga" intro={site.description}>
      <Section title="Quiénes somos">
        <p>{site.name} es una empresa peruana dedicada a la comercialización de repuestos para vehículos livianos y camionetas. Atendemos a conductores, talleres mecánicos y flotas con un catálogo verificado por compatibilidad de vehículo.</p>
        <p>[Completar con la historia de la empresa: año de fundación, fundadores, hitos y cobertura actual.]</p>
      </Section>
      <Section id="empresa" title="Nuestra empresa">
        <p>Contamos con almacén propio en Lima, asesores técnicos y alianzas con los principales couriers del país. Emitimos boletas y facturas electrónicas y ofrecemos condiciones especiales para talleres y mayoristas.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map(({ Icon, t, d }) => (
            <div key={t} className="card flex gap-3.5 p-5"><Icon className="size-6 shrink-0 text-brand-deep" /><span><strong className="block">{t}</strong><span className="text-sm text-muted">{d}</span></span></div>
          ))}
        </div>
      </Section>
      <Section title="Datos de la empresa">
        <ul className="m-0 list-disc pl-5">
          <li>Razón social: {site.legalName} · RUC {site.ruc}</li>
          <li>Dirección: {site.address}</li>
          <li>Horario de atención: {site.hours}</li>
          <li>Correo: {site.email}</li>
        </ul>
      </Section>
    </ContentPage>
  );
}
