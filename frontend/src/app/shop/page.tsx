import { getProducts } from "@/lib/products";
import { ShopGrid } from "@/components/ShopGrid";
import { CATEGORIES, type Category } from "@/lib/types";

export const metadata = {
  title: "Shop — medistore",
};

type Filter = "All" | Category;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const products = await getProducts();
  const { category } = await searchParams;

  const initial: Filter =
    category && (CATEGORIES as string[]).includes(category)
      ? (category as Category)
      : "All";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-6">
        <h1 className="font-heading text-3xl font-bold text-ink">Shop</h1>
        <p className="text-ink-soft">
          {products.length} products across vitamins, syrups and supplements.
        </p>
      </header>
      <ShopGrid products={products} initialCategory={initial} />
    </div>
  );
}
