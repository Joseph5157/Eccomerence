import Link from "next/link";
import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/types";

export default async function HomePage() {
  const products = await getProducts();
  const popular = products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-offwhite">
        {/* perforation strip echoing the blister motif */}
        <div className="blister-perf h-3 w-full bg-primary-600" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-offwhite/10 px-3 py-1 text-xs font-medium text-accent-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Trusted everyday wellness
            </span>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Feel your best,
              <br />
              one dose at a time.
            </h1>
            <p className="mt-4 max-w-md text-offwhite/80">
              Vitamins, syrups and supplements you can trust — clean labels, fair
              prices, and delivery to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Shop all products
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-offwhite/25 px-6 py-3 text-sm font-semibold text-offwhite transition-colors hover:bg-offwhite/10"
              >
                Browse categories
              </Link>
            </div>
          </div>

          {/* Decorative blister card cluster */}
          <div className="relative hidden md:block">
            <div className="mx-auto grid max-w-sm grid-cols-2 gap-4">
              {CATEGORIES.map((cat, i) => (
                <div
                  key={cat}
                  className={`rounded-2xl bg-offwhite/10 p-5 backdrop-blur ${
                    i === 2 ? "col-span-2" : ""
                  }`}
                >
                  <div className="blister-perf mb-3 h-2.5 w-full rounded bg-offwhite/20" />
                  <p className="font-heading text-lg font-bold">{cat}</p>
                  <p className="text-sm text-offwhite/70">
                    {cat === "Vitamins"
                      ? "Daily essentials"
                      : cat === "Syrups"
                      ? "Soothing relief"
                      : "Targeted support"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category shortcuts */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/shop?category=${cat}`}
              className="group flex items-center justify-between rounded-2xl border border-primary/10 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <span className="font-heading text-lg font-semibold text-ink">
                {cat}
              </span>
              <span className="text-primary transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular products */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold text-ink">
              Popular right now
            </h2>
            <p className="text-sm text-ink-soft">Everyday favourites, in stock.</p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {popular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
