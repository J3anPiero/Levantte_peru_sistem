import type { Metadata } from "next";
import { ContentPage, Section } from "@/components/ui/content-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Política de privacidad" };

export default function PrivacyPage() {
  return (
    <ContentPage kicker="Legal" title="Política de privacidad" intro={`Cómo ${site.legalName} recopila, usa y protege tus datos personales, conforme a la Ley N.º 29733 de Protección de Datos Personales y su reglamento.`}>
      <Section title="Datos que recopilamos">
        <p>Nombres y apellidos, documento de identidad o RUC, correo electrónico, teléfono, direcciones de entrega y facturación, datos de tu vehículo e historial de pedidos. Los datos de tarjeta se procesan exclusivamente en la pasarela de pago y no son almacenados por nosotros.</p>
      </Section>
      <Section title="Finalidad">
        <p>Procesar y entregar tus pedidos, emitir comprobantes electrónicos, gestionar garantías, atender consultas y, si lo autorizas, enviarte promociones. Puedes retirar tu consentimiento en cualquier momento.</p>
      </Section>
      <Section title="Tus derechos">
        <p>Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición escribiendo a {site.email}. Responderemos dentro de los plazos establecidos por ley.</p>
      </Section>
      <Section title="Cookies">
        <p>Usamos cookies técnicas para el funcionamiento del carrito y la sesión, y cookies de medición para mejorar la experiencia. Puedes configurarlas desde tu navegador.</p>
      </Section>
      <p className="text-sm text-muted">[Revisar y completar este texto con asesoría legal antes de la publicación.]</p>
    </ContentPage>
  );
}
