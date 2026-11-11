import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";

export function WhatsAppButton({ message = "Hola LEVANTE PERÚ, quisiera hacer una consulta sobre un repuesto." }: { message?: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex size-[60px] items-center justify-center rounded-full bg-whatsapp text-ink shadow-[0_10px_24px_rgba(0,0,0,0.3)] transition-transform hover:scale-105"
    >
      <MessageCircle className="size-[30px]" strokeWidth={1.9} />
    </a>
  );
}
