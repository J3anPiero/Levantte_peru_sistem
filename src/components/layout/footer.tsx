import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { site } from "@/lib/site";

type IconProps = { className?: string };
const Facebook = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3c-2.8 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8.5c0-.3.2-.5.5-.5z" /></svg>
);
const Instagram = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
);
const Music2 = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M14 4v11a3.5 3.5 0 1 1-3.5-3.5" /><path d="M14 4c.5 2.5 2.3 4.2 5 4.5" /></svg>
);
const Youtube = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="3" /><path d="M10 9.5v5l4.5-2.5z" fill="currentColor" /></svg>
);

const cols = [
  {
    title: "Tienda",
    links: [
      { href: "/catalogo", label: "Catálogo completo" },
      { href: "/catalogo?orden=nuevos", label: "Ofertas y promociones" },
      { href: "/marcas", label: "Marcas que comercializamos" },
      { href: "/#vehiculo", label: "Buscar por vehículo" },
      { href: "/contacto", label: "Ventas a mayoristas" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/nosotros#empresa", label: "Nuestra empresa" },
      { href: "/contacto", label: "Contacto" },
      { href: "/contacto", label: "Trabaja con nosotros" },
      { href: "/contacto#reclamaciones", label: "Libro de reclamaciones" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
      { href: "/garantias-y-devoluciones", label: "Garantías y devoluciones" },
      { href: "/preguntas-frecuentes#envios", label: "Envíos y entregas" },
      { href: "/politica-de-privacidad", label: "Políticas de privacidad" },
      { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
    ],
  },
];

const payments = ["Visa", "Mastercard", "Yape", "Plin", "Transferencia"];

export function Footer({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="mt-auto bg-ink text-muted-2">
      {!compact && (
        <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div className="flex flex-col gap-4">
            <Logo size="md" />
            <p className="m-0 max-w-[340px] text-sm leading-relaxed">{site.description}</p>
            <div className="text-sm leading-[1.9]">
              <div>{site.address}</div>
              <div>
                {site.phone} · WhatsApp +{site.whatsapp}
              </div>
              <div>{site.email}</div>
            </div>
            <div className="flex gap-2.5">
              {[
                { href: site.social.facebook, label: "Facebook", Icon: Facebook },
                { href: site.social.instagram, label: "Instagram", Icon: Instagram },
                { href: site.social.tiktok, label: "TikTok", Icon: Music2 },
                { href: site.social.youtube, label: "YouTube", Icon: Youtube },
              ].map(({ href, label, Icon }) => (
                <a key={label} href={href} aria-label={label} className="flex size-[38px] items-center justify-center rounded-[10px] border border-steel-2 text-white hover:border-brand">
                  <Icon className="size-[18px]" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <div className="mb-3 font-display text-sm font-bold text-white">{col.title}</div>
              <div className="flex flex-col">
                {col.links.map((l) => (
                  <Link key={l.label} href={l.href} className="text-sm leading-8 text-muted-2 no-underline hover:text-white">
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={compact ? "" : "border-t border-steel"}>
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-[18px] text-[13px]">
          <span>
            © {new Date().getFullYear()} {site.legalName} · RUC {site.ruc} · Todos los derechos reservados
          </span>
          {compact ? (
            <div className="flex flex-wrap gap-5">
              <Link href="/garantias-y-devoluciones" className="text-muted-2 no-underline hover:text-white">Garantías y devoluciones</Link>
              <Link href="/politica-de-privacidad" className="text-muted-2 no-underline hover:text-white">Privacidad</Link>
              <Link href="/terminos-y-condiciones" className="text-muted-2 no-underline hover:text-white">Términos</Link>
              <Link href="/contacto" className="text-muted-2 no-underline hover:text-white">Contacto</Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {payments.map((p) => (
                <span key={p} className="rounded-md border border-steel-2 px-2.5 py-1 text-xs font-semibold text-white">
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
