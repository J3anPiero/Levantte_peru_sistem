"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import { site, whatsappLink } from "@/lib/site";
import { useCart } from "@/components/cart/cart-provider";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { QuantityInput } from "./quantity-input";

export function BuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const message = `Hola ${site.name}, quisiera consultar por: ${product.name} (código ${product.sku}${product.oem ? `, OEM ${product.oem}` : ""}).`;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-stretch gap-3">
        <QuantityInput value={qty} onChange={setQty} size="lg" max={Math.max(1, product.stock || 99)} />
        <AddToCartButton product={product} qty={qty} size="lg" className="flex-[1_1_200px]" />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/checkout" onClick={() => add(product.id, qty)} className="btn-dark h-[46px] flex-[1_1_160px]">
          Comprar ahora
        </Link>
        <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn h-[46px] flex-[1_1_160px] border-[1.5px] border-whatsapp bg-white text-ink hover:bg-mist">
          <MessageCircle className="size-[18px] text-whatsapp" strokeWidth={2} />
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
