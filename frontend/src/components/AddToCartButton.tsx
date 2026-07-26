"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";

export function AddToCartButton({
  product,
  qty = 1,
  full = false,
}: {
  product: Product;
  qty?: number;
  full?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-offwhite transition-colors hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
        full ? "w-full" : ""
      }`}
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
