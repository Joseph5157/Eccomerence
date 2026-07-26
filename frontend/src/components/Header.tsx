import Link from "next/link";
import { CartBadge } from "./CartBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-offwhite/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-offwhite">
            {/* capsule mark */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="3"
                y="8.5"
                width="18"
                height="7"
                rx="3.5"
                transform="rotate(-30 12 12)"
                fill="#E8A33D"
              />
              <rect
                x="3"
                y="8.5"
                width="9"
                height="7"
                rx="3.5"
                transform="rotate(-30 12 12)"
                fill="#F7F9F4"
              />
            </svg>
          </span>
          <span className="font-heading text-lg font-bold tracking-tight text-ink">
            medi<span className="text-primary">store</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-ink-soft transition-colors hover:bg-sage hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/shop"
            className="rounded-full px-3 py-2 text-ink-soft transition-colors hover:bg-sage hover:text-primary"
          >
            Shop
          </Link>
        </nav>

        <CartBadge />
      </div>
    </header>
  );
}
