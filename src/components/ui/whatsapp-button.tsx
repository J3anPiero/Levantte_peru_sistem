import { MessageCircle } from "lucide-react";
import { site, whatsappLink } from "@/lib/site";

export function WhatsAppButton({ message = `Hola ${site.name}, quisiera hacer una consulta sobre un repuesto.` }: { message?: string }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="group fixed right-5 bottom-5 z-40 flex size-[60px] items-center justify-center rounded-full bg-whatsapp text-black shadow-[0_10px_24px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-110"
    >
      <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-25 [animation-duration:2.8s]" />
      <MessageCircle className="relative size-[30px]" strokeWidth={1.9} />
    </a>
  );
}
