"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function AccountPage() {
  const { customer, loading, logout } = useAuth();

  if (loading) {
    return <div className="mx-auto min-h-[60vh] max-w-4xl px-4 py-16 text-sm text-ink-soft">Loading your account…</div>;
  }

  if (!customer) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-2xl text-primary" aria-hidden="true">♙</div>
        <h1 className="mt-5 font-heading text-3xl font-bold text-ink">Sign in to your account</h1>
        <p className="mt-2 text-ink-soft">Your session may have expired, or you haven’t signed in yet.</p>
        <Link href="/account/login" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-offwhite hover:bg-primary-600">Go to sign in</Link>
      </div>
    );
  }

  const fullName = [customer.first_name, customer.last_name].filter(Boolean).join(" ");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-sm">
        <div className="bg-primary px-6 py-8 text-offwhite sm:px-10">
          <p className="text-sm text-accent-soft">Customer account</p>
          <h1 className="mt-1 font-heading text-3xl font-bold">Hello, {customer.first_name || "there"}</h1>
          <p className="mt-2 text-sm text-offwhite/70">Your profile is connected to the local Medusa store.</p>
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-10">
          <div className="rounded-2xl bg-offwhite p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Name</p>
            <p className="mt-2 font-heading text-lg font-semibold text-ink">{fullName || "Not provided"}</p>
          </div>
          <div className="rounded-2xl bg-offwhite p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Email</p>
            <p className="mt-2 break-all font-heading text-lg font-semibold text-ink">{customer.email}</p>
          </div>
          <div className="sm:col-span-2 flex flex-wrap gap-3 border-t border-primary/10 pt-6">
            <Link href="/shop" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-offwhite hover:bg-primary-600">Continue shopping</Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
