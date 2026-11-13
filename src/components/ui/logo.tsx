import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { site } from "@/lib/site";
import logoFull from "../../../public/marca/gaudi-logo.jpg";
import logoMark from "../../../public/marca/gaudi-isotipo.jpg";

/** `free` deja el tamaño al `className` que se pase. */
type Size = "sm" | "md" | "lg" | "xl" | "free";

const markHeights: Record<Size, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-12",
  xl: "h-16",
  free: "",
};

const wordSizes: Record<Size, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
  free: "text-xl",
};

/**
 * Isotipo de GAUDI: la "G" formada por la silueta del vehículo.
 * El archivo tiene fondo negro, por eso se mezcla en modo `screen`: sobre un
 * fondo negro el recuadro desaparece y solo queda el trazo rojo. El modo de
 * mezcla solo actúa dentro de su contexto de apilamiento, así que cualquier
 * resplandor que deba verse a través debe pintarse en ese mismo contenedor.
 */
export function LogoMark({ size = "md", className, priority = true }: { size?: Size; className?: string; priority?: boolean }) {
  return (
    <Image
      src={logoMark}
      alt=""
      priority={priority}
      aria-hidden="true"
      className={clsx("logo-img w-auto mix-blend-screen", markHeights[size], className)}
      sizes="(max-width: 640px) 90vw, 520px"
    />
  );
}

/** Logotipo completo original (G + GAUDI), pensado para fondos negros y tamaños grandes. */
export function LogoArtwork({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src={logoFull}
      alt={`${site.name}, repuestos automotrices`}
      priority={priority}
      className={clsx("logo-img w-auto mix-blend-screen", className)}
      sizes="420px"
    />
  );
}

interface LogoProps {
  size?: Size;
  href?: string | null;
  className?: string;
  /** Texto bajo la marca; `null` lo oculta. */
  subtitle?: string | null;
  priority?: boolean;
}

/**
 * Marca de cabecera: isotipo + logotipo tipográfico. Se usa en tamaños
 * pequeños porque mantiene legible el nombre, cosa que el archivo original
 * no logra a esa escala.
 */
export function Logo({ size = "md", href = "/", className, subtitle = "REPUESTOS", priority = true }: LogoProps) {
  const content = (
    <>
      <LogoMark size={size} priority={priority} />
      <span className="flex flex-col leading-none">
        <span className={clsx("font-display font-extrabold tracking-[0.12em] text-white", wordSizes[size])}>GAUDI</span>
        {subtitle && <span className="mt-0.5 font-display text-[9px] font-semibold tracking-[0.3em] text-brand">{subtitle}</span>}
      </span>
    </>
  );

  if (href === null) return <span className={clsx("inline-flex items-center gap-2", className)}>{content}</span>;

  return (
    <Link href={href} aria-label={`${site.name}, inicio`} className={clsx("group inline-flex items-center gap-2 no-underline", className)}>
      {content}
    </Link>
  );
}
