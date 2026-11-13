import type { PartKind } from "@/lib/types";

interface Props {
  kind: PartKind;
  size?: number | string;
  label?: string;
  className?: string;
}

const INK = "#121215";
const FILL = "#e6e6eb";
const WHITE = "#fff";

const shapes: Record<PartKind, React.ReactNode> = {
  pads: (
    <>
      <path d="M12 32 Q40 14 68 32 L62 50 Q40 36 18 50 Z" fill={FILL} stroke={INK} strokeWidth="2" />
      <path d="M15 40 Q40 24 65 40" fill="none" stroke={INK} strokeWidth="2" />
      <path d="M20 58 Q40 46 60 58 L58 66 Q40 56 22 66 Z" fill={WHITE} stroke={INK} strokeWidth="2" />
    </>
  ),
  disc: (
    <>
      <circle cx="40" cy="40" r="34" fill={FILL} stroke={INK} strokeWidth="2" />
      <circle cx="40" cy="40" r="26" fill="none" stroke={WHITE} strokeWidth="1.5" strokeDasharray="3 4" />
      <circle cx="40" cy="40" r="15" fill={WHITE} stroke={INK} strokeWidth="2" />
      <circle cx="40" cy="40" r="5" fill={INK} />
      <circle cx="40" cy="20" r="2.5" fill={INK} />
      <circle cx="59" cy="33.8" r="2.5" fill={INK} />
      <circle cx="51.8" cy="56.2" r="2.5" fill={INK} />
      <circle cx="28.2" cy="56.2" r="2.5" fill={INK} />
      <circle cx="21" cy="33.8" r="2.5" fill={INK} />
    </>
  ),
  filter: (
    <>
      <rect x="24" y="22" width="32" height="46" rx="6" fill={FILL} stroke={INK} strokeWidth="2" />
      <rect x="20" y="12" width="40" height="12" rx="3" fill={WHITE} stroke={INK} strokeWidth="2" />
      <path d="M30 34v26M40 34v26M50 34v26" stroke={WHITE} strokeWidth="2" />
      <circle cx="40" cy="18" r="3" fill={INK} />
    </>
  ),
  airfilter: (
    <>
      <rect x="10" y="24" width="60" height="32" rx="4" fill={FILL} stroke={INK} strokeWidth="2" />
      <path d="M16 28v24M24 28v24M32 28v24M40 28v24M48 28v24M56 28v24M64 28v24" stroke={WHITE} strokeWidth="2.5" />
      <rect x="10" y="24" width="60" height="6" fill={INK} opacity="0.15" />
    </>
  ),
  plug: (
    <>
      <rect x="34" y="6" width="12" height="8" rx="2" fill={INK} />
      <rect x="36" y="14" width="8" height="8" fill={WHITE} stroke={INK} strokeWidth="2" />
      <rect x="28" y="22" width="24" height="18" rx="3" fill={FILL} stroke={INK} strokeWidth="2" />
      <path d="M32 29h16M32 34h16" stroke={INK} strokeWidth="1.5" />
      <rect x="31" y="40" width="18" height="14" fill={WHITE} stroke={INK} strokeWidth="2" />
      <rect x="36" y="54" width="8" height="16" fill={FILL} stroke={INK} strokeWidth="2" />
      <path d="M36 70h8l4 4H32z" fill={INK} />
    </>
  ),
  battery: (
    <>
      <rect x="10" y="28" width="60" height="40" rx="4" fill={FILL} stroke={INK} strokeWidth="2" />
      <rect x="18" y="20" width="10" height="8" rx="1" fill={INK} />
      <rect x="52" y="20" width="10" height="8" rx="1" fill={INK} />
      <path d="M19 40h8M23 36v8M53 40h8" stroke={INK} strokeWidth="2" />
      <rect x="16" y="50" width="48" height="10" rx="2" fill={WHITE} stroke={INK} strokeWidth="1.5" />
    </>
  ),
  shock: (
    <>
      <circle cx="40" cy="9" r="5" fill={WHITE} stroke={INK} strokeWidth="2" />
      <rect x="35" y="14" width="10" height="22" rx="2" fill={FILL} stroke={INK} strokeWidth="2" />
      <rect x="28" y="36" width="24" height="30" rx="4" fill={WHITE} stroke={INK} strokeWidth="2" />
      <path d="M28 42h24M28 50h24M28 58h24" stroke={INK} strokeWidth="1.5" />
      <circle cx="40" cy="71" r="5" fill={WHITE} stroke={INK} strokeWidth="2" />
    </>
  ),
  lamp: (
    <>
      <path d="M22 22h26a18 18 0 0 1 0 36H22a6 6 0 0 1-6-6V28a6 6 0 0 1 6-6z" fill={FILL} stroke={INK} strokeWidth="2" />
      <path d="M48 26a14 14 0 0 1 0 28" fill="none" stroke={WHITE} strokeWidth="3" />
      <path d="M22 30h20M22 40h20M22 50h20" stroke={INK} strokeWidth="1.5" />
    </>
  ),
  belt: (
    <>
      <ellipse cx="40" cy="40" rx="32" ry="20" fill={FILL} stroke={INK} strokeWidth="2" />
      <ellipse cx="40" cy="40" rx="24" ry="12" fill={WHITE} stroke={INK} strokeWidth="2" />
      <circle cx="20" cy="40" r="4" fill={INK} />
      <circle cx="60" cy="40" r="4" fill={INK} />
    </>
  ),
  fluid: (
    <>
      <path d="M30 10h20v10l6 8v38a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6V28l6-8z" fill={FILL} stroke={INK} strokeWidth="2" />
      <rect x="30" y="38" width="20" height="20" rx="2" fill={WHITE} stroke={INK} strokeWidth="2" />
    </>
  ),
  sensor: (
    <>
      <path d="M14 40h30" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <rect x="44" y="30" width="22" height="20" rx="4" fill={FILL} stroke={INK} strokeWidth="2" />
      <circle cx="14" cy="40" r="5" fill={WHITE} stroke={INK} strokeWidth="2" />
    </>
  ),
  kit: (
    <>
      <rect x="16" y="24" width="48" height="32" rx="4" fill={FILL} stroke={INK} strokeWidth="2" />
      <path d="M24 32h32M24 40h32M24 48h20" stroke={WHITE} strokeWidth="3" />
    </>
  ),
  clutch: (
    <>
      <circle cx="40" cy="40" r="32" fill={FILL} stroke={INK} strokeWidth="2" />
      <circle cx="40" cy="40" r="20" fill={WHITE} stroke={INK} strokeWidth="2" />
      <circle cx="40" cy="40" r="7" fill={INK} />
      <path d="M40 8v12M40 60v12M8 40h12M60 40h12M17 17l8 8M55 55l8 8M63 17l-8 8M17 63l8-8" stroke={INK} strokeWidth="2" />
    </>
  ),
  engine: (
    <>
      <rect x="14" y="26" width="52" height="34" rx="6" fill={FILL} stroke={INK} strokeWidth="2.5" />
      <path d="M24 26v-8h8v8M48 26v-8h8v8M14 40h-6M66 40h6" stroke={INK} strokeWidth="2.5" fill="none" />
      <rect x="24" y="36" width="32" height="14" rx="2" fill={WHITE} stroke={INK} strokeWidth="1.5" />
    </>
  ),
  transmission: (
    <>
      <circle cx="40" cy="40" r="30" fill={FILL} stroke={INK} strokeWidth="2.5" />
      <circle cx="40" cy="40" r="10" fill={WHITE} stroke={INK} strokeWidth="2.5" />
      <path d="M40 10v12M40 58v12M10 40h12M58 40h12" stroke={INK} strokeWidth="2.5" />
    </>
  ),
  body: (
    <>
      <path d="M10 48l10-18h40l10 18v12H10z" fill={FILL} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="24" cy="60" r="6" fill={WHITE} stroke={INK} strokeWidth="2.5" />
      <circle cx="56" cy="60" r="6" fill={WHITE} stroke={INK} strokeWidth="2.5" />
    </>
  ),
};

/**
 * Ilustración lineal del tipo de repuesto. Sustituye a la fotografía del producto
 * hasta que se cargue el catálogo real de imágenes.
 */
export function PartIllustration({ kind, size = 120, label, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {shapes[kind]}
    </svg>
  );
}
