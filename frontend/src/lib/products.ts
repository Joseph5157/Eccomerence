import type { Category, Product } from "./types";
import { FALLBACK_PRODUCTS } from "./fallback-products";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

/* --------------------------- Medusa Store API --------------------------- */
/* Best-effort integration. Any failure falls back to the hardcoded list so
 * the storefront always renders. Requires the backend running and a
 * publishable key in NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY.                     */

type MedusaVariant = {
  id: string;
  calculated_price?: { calculated_amount?: number } | null;
};

type MedusaProduct = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  metadata?: Record<string, unknown> | null;
  categories?: { name: string }[] | null;
  variants?: MedusaVariant[] | null;
};

function coerceCategory(value: unknown): Category {
  if (value === "Vitamins" || value === "Syrups" || value === "Supplements") {
    return value;
  }
  return "Supplements";
}

function mapMedusaProduct(p: MedusaProduct): Product {
  const variant = p.variants?.[0];
  const meta = p.metadata ?? {};
  const price = variant?.calculated_price?.calculated_amount ?? 0;
  const mrp = Number(meta.mrp) || price;
  const category = coerceCategory(meta.category ?? p.categories?.[0]?.name);

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    category,
    price,
    mrp,
    unit: typeof meta.unit === "string" ? meta.unit : "",
    description: p.description ?? "",
    variantId: variant?.id,
  };
}

async function medusaFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
    // Re-fetch at most once a minute in production; instant in dev.
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Medusa ${path} -> ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function fetchFromMedusa(): Promise<Product[] | null> {
  if (!PUBLISHABLE_KEY) return null;
  try {
    const { regions } = await medusaFetch<{ regions: { id: string }[] }>(
      "/store/regions"
    );
    const regionId = regions?.[0]?.id;
    if (!regionId) return null;

    const fields =
      "id,handle,title,description,metadata,*categories,variants.id,variants.calculated_price";
    const { products } = await medusaFetch<{ products: MedusaProduct[] }>(
      `/store/products?limit=100&region_id=${regionId}&fields=${encodeURIComponent(
        fields
      )}`
    );
    if (!products?.length) return null;
    return products.map(mapMedusaProduct);
  } catch {
    // Backend down / not seeded / bad key — fall back silently.
    return null;
  }
}

/* ------------------------------- Public API ----------------------------- */

export async function getProducts(): Promise<Product[]> {
  const live = await fetchFromMedusa();
  return live ?? FALLBACK_PRODUCTS;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.handle === handle);
}

export async function getPopularProducts(count = 4): Promise<Product[]> {
  const products = await getProducts();
  return products.slice(0, count);
}
