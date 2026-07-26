"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { QuantityStepper } from "./QuantityStepper";

export function ProductBuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantityStepper qty={qty} onChange={setQty} />
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-offwhite transition-colors hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {added ? "Added to cart ✓" : `Add ${qty} to cart`}
      </button>
    </div>
  );
}
