"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products } from "@/data/products";

/*
 * Lista de favoritos.
 *
 * Guarda identificadores de producto, no productos: el catálogo se regenera y
 * una copia del producto quedaría desactualizada en precio y stock. Al leer se
 * descartan los identificadores que ya no existen, para que un repuesto
 * descatalogado no rompa la página.
 *
 * Vive en localStorage, igual que el carrito, y por tanto es por navegador: no
 * viaja con la cuenta. Cuando entre el backend, los favoritos deberían pasar a
 * colgar del usuario para que se vean también desde el celular.
 */

const STORAGE_KEY = "gaudi-favorites-v1";

interface FavoritesContextValue {
  ids: string[];
  count: number;
  hydrated: boolean;
  has: (productId: string) => boolean;
  /** Agrega o quita, y devuelve `true` si el producto quedó marcado. */
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          setIds(parsed.filter((id): id is string => typeof id === "string" && products.some((p) => p.id === id)));
        }
      }
    } catch {
      /* almacenamiento no disponible */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignorar */
    }
  }, [ids, hydrated]);

  const has = useCallback((productId: string) => ids.includes(productId), [ids]);

  /*
   * Devuelve el estado resultante además de aplicarlo, porque quien pulsa el
   * corazón necesita saber qué avisar ("guardado" o "quitado") y leer `ids`
   * justo después daría todavía el valor viejo.
   */
  const toggle = useCallback(
    (productId: string) => {
      const marked = !ids.includes(productId);
      // Al frente: lo último que guardas es lo primero que quieres volver a ver.
      setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev]));
      return marked;
    },
    [ids],
  );

  const remove = useCallback((productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clear = useCallback(() => setIds([]), []);

  const value = useMemo<FavoritesContextValue>(
    () => ({ ids, count: ids.length, hydrated, has, toggle, remove, clear }),
    [ids, hydrated, has, toggle, remove, clear],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  return ctx;
}
