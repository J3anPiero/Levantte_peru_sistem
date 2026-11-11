"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/data/products";
import { categoryTree } from "@/data/categories";
import { site } from "@/lib/site";
import { round2 } from "@/lib/format";
import type { CartItem, Product } from "@/lib/types";

const STORAGE_KEY = "levante-cart-v1";

export interface Coupon {
  code: string;
  description: string;
  /** Returns the discount for a line (gross) or 0. */
  apply: (product: Product, lineTotal: number) => number;
}

const FRENOS_IDS = new Set(categoryTree("frenos"));

export const coupons: Coupon[] = [
  {
    code: "FRENOS20",
    description: "20% en pastillas y discos de freno",
    apply: (p, line) => (FRENOS_IDS.has(p.categoryId) ? line * 0.2 : 0),
  },
  {
    code: "BIENVENIDO10",
    description: "10% en tu primera compra",
    apply: (_p, line) => line * 0.1,
  },
];

export interface CartLine extends CartItem {
  product: Product;
  lineTotal: number;
}

export interface ToastState {
  title: string;
  detail?: string;
  id: number;
}

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  subtotal: number;
  discount: number;
  shippingEstimate: number;
  total: number;
  coupon?: Coupon;
  couponError?: string;
  hydrated: boolean;
  add: (productId: string, qty?: number) => void;
  update: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  toast?: ToastState;
  notify: (title: string, detail?: string) => void;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const [couponError, setCouponError] = useState<string | undefined>();
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<ToastState | undefined>();
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { items?: CartItem[]; coupon?: string };
        if (Array.isArray(parsed.items)) setItems(parsed.items.filter((i) => products.some((p) => p.id === i.productId)));
        if (parsed.coupon) setCouponCode(parsed.coupon);
      }
    } catch {
      /* almacenamiento no disponible */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, coupon: couponCode }));
    } catch {
      /* ignorar */
    }
  }, [items, couponCode, hydrated]);

  const notify = useCallback((title: string, detail?: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ title, detail, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(undefined), 3800);
  }, []);

  const dismissToast = useCallback(() => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(undefined);
  }, []);

  const add = useCallback(
    (productId: string, qty = 1) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (existing) return prev.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i));
        return [...prev, { productId, qty }];
      });
      notify("Producto agregado al carrito", `${product.shortName ?? product.name} · ${qty} und.`);
    },
    [notify],
  );

  const update = useCallback((productId: string, qty: number) => {
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.productId !== productId) : prev.map((i) => (i.productId === productId ? { ...i, qty } : i))));
  }, []);

  const remove = useCallback((productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId)), []);
  const clear = useCallback(() => {
    setItems([]);
    setCouponCode(undefined);
  }, []);

  const coupon = useMemo(() => coupons.find((c) => c.code === couponCode), [couponCode]);

  const applyCoupon = useCallback((code: string) => {
    const found = coupons.find((c) => c.code === code.trim().toUpperCase());
    if (!found) {
      setCouponError("El cupón no existe o ha vencido.");
      return false;
    }
    setCouponCode(found.code);
    setCouponError(undefined);
    return true;
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode(undefined);
    setCouponError(undefined);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = items
      .map((i) => {
        const product = products.find((p) => p.id === i.productId)!;
        return { ...i, product, lineTotal: round2(product.price * i.qty) };
      })
      .filter((l) => l.product);
    const subtotal = round2(lines.reduce((s, l) => s + l.lineTotal, 0));
    const discount = coupon ? round2(lines.reduce((s, l) => s + coupon.apply(l.product, l.lineTotal), 0)) : 0;
    const afterDiscount = subtotal - discount;
    const shippingEstimate = lines.length === 0 || afterDiscount >= site.freeShippingFrom ? 0 : site.limaShippingCost;
    return {
      items,
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      discount,
      shippingEstimate,
      total: round2(afterDiscount + shippingEstimate),
      coupon,
      couponError,
      hydrated,
      add,
      update,
      remove,
      clear,
      applyCoupon,
      removeCoupon,
      toast,
      notify,
      dismissToast,
    };
  }, [items, coupon, couponError, hydrated, add, update, remove, clear, applyCoupon, removeCoupon, toast, notify, dismissToast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
