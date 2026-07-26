import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatINR, discountPct } from "@/lib/format";
import { ProductThumb } from "./ProductThumb";
import { CategoryPill } from "./CategoryPill";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const off = discountPct(product.price, product.mrp);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* blister-pack perforation strip along the top edge */}
      <div className="blister-perf h-3 w-full bg-sage" />

      <Link
        href={`/product/${product.handle}`}
        className="block focus:outline-none"
      >
        <ProductThumb
          category={product.category}
          label={product.title}
          className="aspect-square w-full"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <CategoryPill category={product.category} />
          {off > 0 && (
            <span className="text-xs font-semibold text-accent">{off}% off</span>
          )}
        </div>

        <Link href={`/product/${product.handle}`}>
          <h3 className="font-heading text-base font-semibold leading-tight text-ink transition-colors group-hover:text-primary">
            {product.title}
          </h3>
        </Link>
        <p className="text-xs text-ink-soft">{product.unit}</p>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg font-bold text-primary">
              {formatINR(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-sm text-ink-soft line-through">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>
        </div>

        <AddToCartButton product={product} full />
      </div>
    </article>
  );
}
