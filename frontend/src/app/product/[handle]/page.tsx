import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/products";
import { formatINR, discountPct } from "@/lib/format";
import { ProductThumb } from "@/components/ProductThumb";
import { CategoryPill } from "@/components/CategoryPill";
import { ProductBuyBox } from "@/components/ProductBuyBox";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) notFound();

  const off = discountPct(product.price, product.mrp);
  const related = (await getProducts())
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-soft">
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>{" "}
        / <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white">
          <div className="blister-perf h-3 w-full bg-sage" />
          <ProductThumb
            category={product.category}
            handle={product.handle}
            label={product.title}
            className="aspect-square w-full"
          />
        </div>

        <div className="flex flex-col gap-4">
          <CategoryPill category={product.category} size="md" />
          <h1 className="font-heading text-3xl font-bold text-ink">
            {product.title}
          </h1>
          <p className="text-sm text-ink-soft">{product.unit}</p>

          <div className="flex items-baseline gap-3">
            <span className="font-heading text-3xl font-bold text-primary">
              {formatINR(product.price)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-ink-soft line-through">
                  {formatINR(product.mrp)}
                </span>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {off}% off
                </span>
              </>
            )}
          </div>

          <p className="leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-2">
            <ProductBuyBox product={product} />
          </div>

          <ul className="mt-4 space-y-1 text-sm text-ink-soft">
            <li>✓ Free delivery on orders above ₹499</li>
            <li>✓ Sealed &amp; tamper-evident packaging</li>
            <li>✓ Easy 7-day returns</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-4 font-heading text-xl font-bold text-ink">
            You might also like
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/product/${p.handle}`}
                className="overflow-hidden rounded-2xl border border-primary/10 bg-white transition-shadow hover:shadow-md"
              >
                <ProductThumb
                  category={p.category}
                  handle={p.handle}
                  label={p.title}
                  className="aspect-square w-full"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold text-ink">{p.title}</p>
                  <p className="text-sm font-bold text-primary">
                    {formatINR(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
