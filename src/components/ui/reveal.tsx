"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  /** Retardo en milisegundos, para escalonar varios elementos. */
  delay?: number;
  className?: string;
}

/**
 * Revela su contenido con un desvanecido ascendente cuando entra en pantalla.
 * Respeta la preferencia de movimiento reducido del sistema.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={delay ? { transitionDelay: `${delay}ms` } : undefined} className={clsx("reveal", shown && "reveal-in", className)}>
      {children}
    </div>
  );
}
