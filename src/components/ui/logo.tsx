import Link from "next/link";
import clsx from "clsx";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  subtitle?: string;
  href?: string;
  className?: string;
}

const sizes = {
  sm: { mark: 30, word: "text-[16px]", sub: "text-[8px]" },
  md: { mark: 40, word: "text-[21px]", sub: "text-[11px]" },
  lg: { mark: 56, word: "text-[30px]", sub: "text-[14px]" },
};

/** Isotipo de doble chevrón ascendente + wordmark. */
export function LogoMark({ size = 40, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill={inverted ? "#0E131A" : "#F0702A"} />
      <path
        d="M11 25 L20 13 L29 25 M15 29 L20 22 L25 29"
        fill="none"
        stroke={inverted ? "#F0702A" : "#0E131A"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ variant = "dark", size = "md", subtitle = "PERÚ", href = "/", className }: LogoProps) {
  const s = sizes[size];
  const onDark = variant === "dark";
  return (
    <Link href={href} aria-label="LEVANTE PERÚ, inicio" className={clsx("inline-flex items-center gap-3 no-underline", className)}>
      <LogoMark size={s.mark} inverted={!onDark} />
      <span className="flex flex-col leading-none">
        <span className={clsx("font-display font-extrabold tracking-[0.08em]", s.word, onDark ? "text-white" : "text-ink")}>LEVANTE</span>
        <span className={clsx("font-display font-semibold tracking-[0.34em]", s.sub, onDark ? "text-brand" : "text-brand-deep")}>{subtitle}</span>
      </span>
    </Link>
  );
}
