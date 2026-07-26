"use client";

import Link from "next/link";
import { useCart, selectSubtotal } from "@/store/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { formatINR } from "@/lib/format";
import { QuantityStepper } from "@/components/QuantityStepper";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart(selectSubtotal);
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-16" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-ink">
          Your cart is empty
        </h1>
        <p className="mt-2 text-ink-soft">
          Browse our vitamins, syrups and supplements to get started.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-offwhite transition-colors hover:bg-primary-600"
        >
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 font-heading text-3xl font-bold text-ink">
        Your cart
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border border-primary/10 bg-white p-4"
            >
              <Link
                href={`/product/${item.handle}`}
                className="min-w-0 flex-1"
              >
                <p className="truncate font-heading font-semibold text-ink">
                  {item.title}
                </p>
                <p className="text-xs text-ink-soft">{item.unit}</p>
                <p className="mt-1 text-sm font-bold text-primary">
                  {formatINR(item.price)}
                </p>
              </Link>

              <QuantityStepper
                qty={item.qty}
                onChange={(qty) => setQty(item.id, qty)}
              />

              <p className="w-20 text-right text-sm font-semibold text-ink">
                {formatINR(item.price * item.qty)}
              </p>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.title}`}
                className="text-ink-soft transition-colors hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-primary/10 bg-white p-6">
          <h2 className="mb-4 font-heading text-lg font-bold text-ink">
            Order summary
          </h2>
          <div className="flex justify-between text-sm text-ink-soft">
            <span>Subtotal</span>
            <span className="font-semibold text-ink">
              {formatINR(subtotal)}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-ink-soft">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="my-4 border-t border-primary/10" />
          <div className="flex justify-between font-heading text-lg font-bold text-ink">
            <span>Total</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-offwhite transition-colors hover:bg-primary-600"
          >
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
