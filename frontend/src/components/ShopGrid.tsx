"use client";

import { useState } from "react";
import type { Product, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { ProductCard } from "./ProductCard";

type Filter = "All" | Category;
const TABS: Filter[] = ["All", ...CATEGORIES];

export function ShopGrid({
  products,
  initialCategory = "All",
}: {
  products: Product[];
  initialCategory?: Filter;
}) {
  const [active, setActive] = useState<Filter>(initialCategory);

  const visible =
    active === "All"
      ? products
      : products.filter((p) => p.category === active);

  return (
    <div>
      {/* Category filter tabs — capsule pills */}
      <div className="-mx-4 mb-8 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        {TABS.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                isActive
                  ? "border-primary bg-primary text-offwhite"
                  : "border-primary/15 bg-white text-ink-soft hover:bg-sage hover:text-primary"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-ink-soft">
          No products in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
