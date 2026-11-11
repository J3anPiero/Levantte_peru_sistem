import type { Metadata } from "next";
import { ContentPage, Section } from "@/components/ui/content-page";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Términos y condiciones" };

export default function TermsPage() {
  return (
    <ContentPage kicker="Legal" title="Términos y condiciones" intro={`Condiciones generales de compra en la tienda virtual de ${site.legalName}.`}>
      <Section title="Precios y disponibilidad">
        <p>Los precios están expresados en soles e incluyen IGV. El stock mostrado es referencial; si un producto no estuviera disponible tras confirmar el pedido, te contactaremos para ofrecerte una alternativa o el reembolso total.</p>
      </Section>
      <Section title="Pedidos y pagos">
        <p>El pedido se confirma una vez validado el pago. Los pagos por transferencia deben acreditarse dentro de las 24 horas; de lo contrario el pedido se cancela automáticamente.</p>
      </Section>
      <Section title="Envíos">
        <p>Los plazos de entrega son estimados y se cuentan en días hábiles desde la confirmación del pago. Las entregas en provincias se realizan a través de couriers aliados.</p>
      </Section>
      <Section title="Garantías y devoluciones">
        <p>Se rigen por nuestra política de garantías y devoluciones publicada en este sitio.</p>
      </Section>
      <Section title="Propiedad intelectual">
        <p>Las marcas de vehículos y fabricantes mencionadas pertenecen a sus respectivos titulares y se usan únicamente con fines de identificación de compatibilidad.</p>
      </Section>
      <p className="text-sm text-muted">[Revisar y completar este texto con asesoría legal antes de la publicación.]</p>
    </ContentPage>
  );
}
