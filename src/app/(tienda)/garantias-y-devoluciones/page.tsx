import type { Metadata } from "next";
import { ContentPage, Section } from "@/components/ui/content-page";

export const metadata: Metadata = { title: "Garantías y devoluciones" };

export default function WarrantyPage() {
  return (
    <ContentPage kicker="Políticas" title="Garantías y devoluciones" intro="Todos nuestros repuestos tienen garantía por defectos de fabricación. Aquí explicamos cómo aplicarla y cuándo procede un cambio o devolución.">
      <Section title="Garantía">
        <p>La garantía cubre defectos de fabricación durante el plazo indicado en cada ficha de producto (por lo general 6, 12 o 18 meses) contado desde la fecha del comprobante. No cubre desgaste normal, daños por instalación incorrecta, uso indebido o modificaciones.</p>
        <p>Para aplicarla, escríbenos por WhatsApp o al correo de ventas con el número de pedido, fotos de la pieza y una descripción del problema. Un asesor técnico evaluará el caso en un máximo de 3 días hábiles.</p>
      </Section>
      <Section title="Cambios y devoluciones">
        <ul className="m-0 list-disc pl-5">
          <li>Puedes solicitar el cambio o devolución dentro de los 7 días calendario posteriores a la entrega.</li>
          <li>La pieza debe estar sin uso, sin instalar y en su empaque original con todos sus accesorios.</li>
          <li>Si el error de compatibilidad fue nuestro, asumimos el costo del envío de retorno.</li>
          <li>Los reembolsos se procesan por el mismo medio de pago en un plazo de hasta 10 días hábiles.</li>
        </ul>
      </Section>
      <Section title="Excepciones">
        <p>No admiten devolución los componentes eléctricos y electrónicos que hayan sido instalados, los líquidos abiertos y los pedidos especiales traídos bajo pedido, salvo defecto de fábrica.</p>
      </Section>
    </ContentPage>
  );
}
