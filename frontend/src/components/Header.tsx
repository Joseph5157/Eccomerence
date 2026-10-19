"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartBadge } from "./CartBadge";
import { useAuth } from "./AuthProvider";

export function Header() {
  const { customer, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      setOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const displayName = customer?.first_name || customer?.email.split("@")[0];
  const initial = displayName?.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-primary/10 bg-offwhite/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-offwhite">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-30 12 12)" fill="#E8A33D" />
              <rect x="3" y="8.5" width="9" height="7" rx="3.5" transform="rotate(-30 12 12)" fill="#F7F9F4" />
            </svg>
          </span>
          <span className="truncate font-heading text-lg font-bold tracking-tight text-ink">
            medi<span className="text-primary">store</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium md:flex" aria-label="Primary navigation">
          <Link href="/" className="rounded-full px-3 py-2 text-ink-soft transition-colors hover:bg-sage hover:text-primary">Home</Link>
          <Link href="/shop" className="rounded-full px-3 py-2 text-ink-soft transition-colors hover:bg-sage hover:text-primary">Shop</Link>
          {customer && (
            <Link href="/account" className="rounded-full px-3 py-2 text-ink-soft transition-colors hover:bg-sage hover:text-primary">Account</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <CartBadge />
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="flex h-10 items-center gap-2 rounded-full border border-primary/10 bg-white px-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:bg-sage"
              aria-expanded={open}
              aria-controls="customer-menu"
              aria-label={customer ? `Account menu for ${displayName}` : "Open menu"}
            >
              {customer ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-ink">{initial}</span>
              ) : (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                </svg>
              )}
              <span className="hidden sm:inline">{customer ? displayName : "Menu"}</span>
              <span className="sr-only sm:hidden">Menu</span>
            </button>

            {open && (
              <div id="customer-menu" className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-xl shadow-primary/10">
                <nav className="grid gap-1 border-b border-primary/10 p-2 text-sm md:hidden" aria-label="Mobile navigation">
                  <Link href="/" className="rounded-xl px-3 py-2.5 font-medium text-ink hover:bg-sage">Home</Link>
                  <Link href="/shop" className="rounded-xl px-3 py-2.5 font-medium text-ink hover:bg-sage">Shop products</Link>
                  <Link href="/cart" className="rounded-xl px-3 py-2.5 font-medium text-ink hover:bg-sage">Your cart</Link>
                </nav>

                {loading ? (
                  <div className="p-5 text-sm text-ink-soft">Checking your account…</div>
                ) : customer ? (
                  <div className="p-3">
                    <div className="mb-2 rounded-xl bg-sage/60 p-3">
                      <p className="font-heading font-semibold text-ink">Hello, {displayName}</p>
                      <p className="mt-0.5 truncate text-xs text-ink-soft">{customer.email}</p>
                    </div>
                    <Link href="/account" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-sage">Account details</Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
                    >
                      {loggingOut ? "Logging out…" : "Log out"}
                    </button>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="font-heading text-base font-bold text-ink">Your medistore account</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">Sign in to keep your customer profile connected to Medusa.</p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link href="/account/login" className="rounded-full border border-primary/15 px-4 py-2 text-center text-sm font-semibold text-primary hover:bg-sage">Sign in</Link>
                      <Link href="/account/register" className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-offwhite hover:bg-primary-600">Register</Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
