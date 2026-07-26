"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart, selectSubtotal } from "@/store/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { formatINR } from "@/lib/format";
import { payWithRazorpayStub, type ShippingDetails } from "@/lib/payments";

const DELIVERY_FEE = 40;

const emptyShipping: ShippingDetails = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart(selectSubtotal);
  const hydrated = useHydrated();

  const [shipping, setShipping] = useState<ShippingDetails>(emptyShipping);
  const [paying, setPaying] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);
  const formValid = Object.values(shipping).every((v) => v.trim().length > 0);

  function updateField<K extends keyof ShippingDetails>(
    key: K,
    value: string
  ) {
    setShipping((s) => ({ ...s, [key]: value }));
  }

  async function handlePay() {
    setPaying(true);
    try {
      const result = await payWithRazorpayStub(shipping, total);
      if (result.success) {
        setOrderId(result.orderId);
        clear();
      }
    } finally {
      setPaying(false);
    }
  }

  if (!hydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-16" />;
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-offwhite">
          ✓
        </div>
        <h1 className="font-heading text-2xl font-bold text-ink">
          Order placed!
        </h1>
        <p className="mt-2 text-ink-soft">
          Order <span className="font-semibold text-ink">{orderId}</span> has
          been confirmed. This was a stubbed payment — no real charge was
          made.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-offwhite transition-colors hover:bg-primary-600"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-ink">
          Your cart is empty
        </h1>
        <p className="mt-2 text-ink-soft">Add products before checking out.</p>
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
        Checkout
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Shipping form */}
        <form
          className="space-y-4 md:col-span-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="font-heading text-lg font-bold text-ink">
            Shipping details
          </h2>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Full name
            </label>
            <input
              required
              value={shipping.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Anjali Sharma"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Phone number
            </label>
            <input
              required
              type="tel"
              value={shipping.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="98765 43210"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Address
            </label>
            <input
              required
              value={shipping.addressLine1}
              onChange={(e) => updateField("addressLine1", e.target.value)}
              className="w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Flat / House no., Street"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">
                City
              </label>
              <input
                required
                value={shipping.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">
                State
              </label>
              <input
                required
                value={shipping.state}
                onChange={(e) => updateField("state", e.target.value)}
                className="w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">
                Pincode
              </label>
              <input
                required
                value={shipping.pincode}
                onChange={(e) => updateField("pincode", e.target.value)}
                className="w-full rounded-xl border border-primary/15 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </form>

        {/* Order summary */}
        <aside className="h-fit space-y-4 rounded-2xl border border-primary/10 bg-white p-6">
          <h2 className="font-heading text-lg font-bold text-ink">
            Order summary
          </h2>

          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-ink-soft">
                <span className="truncate pr-2">
                  {item.title} × {item.qty}
                </span>
                <span className="shrink-0 font-medium text-ink">
                  {formatINR(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-t border-primary/10 pt-3 text-sm text-ink-soft">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span>Delivery</span>
              <span>{formatINR(DELIVERY_FEE)}</span>
            </div>
          </div>

          <div className="flex justify-between border-t border-primary/10 pt-3 font-heading text-lg font-bold text-ink">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={!formValid || paying}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {paying ? "Processing…" : `Pay ${formatINR(total)} with Razorpay`}
          </button>
          <p className="text-center text-xs text-ink-soft">
            Payment is stubbed for now — no real charge will be made.
          </p>
        </aside>
      </div>
    </div>
  );
}
