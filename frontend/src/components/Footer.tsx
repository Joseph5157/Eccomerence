import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-primary/10 bg-sage/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-lg font-bold text-ink">
            medi<span className="text-primary">store</span>
          </p>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">
            Everyday vitamins, syrups and supplements — delivered to your door.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/shop" className="hover:text-primary">
            Shop
          </Link>
          <Link href="/cart" className="hover:text-primary">
            Cart
          </Link>
          <Link href="/checkout" className="hover:text-primary">
            Checkout
          </Link>
        </nav>
      </div>
      <div className="border-t border-primary/10 py-4 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} medistore · Demo store for evaluation only.
        Not real medical advice.
      </div>
    </footer>
  );
}
