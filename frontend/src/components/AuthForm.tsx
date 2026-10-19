"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "./AuthProvider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { refreshCustomer } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = isRegister
        ? {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            password,
          }
        : { email: formData.get("email"), password };

      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }

      await refreshCustomer();
      router.push("/account");
      router.refresh();
    } catch {
      setError("The store is temporarily unavailable. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass =
    "mt-1.5 w-full rounded-xl border border-primary/15 bg-offwhite px-4 py-3 text-sm text-ink outline-none transition focus:border-primary/40 focus:ring-4 focus:ring-sage";

  return (
    <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-5xl items-center gap-10 px-4 py-12 md:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden md:block">
        <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-primary">Your wellness shelf</span>
        <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-ink">
          {isRegister ? "A simpler way to return to your essentials." : "Welcome back to your everyday wellness."}
        </h1>
        <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
          Your customer account is securely connected to the Medusa commerce backend. Your password is never stored in the browser.
        </p>
        <div className="mt-8 grid max-w-sm grid-cols-3 gap-3" aria-hidden="true">
          {["Vitamins", "Syrups", "Supplements"].map((item) => (
            <div key={item} className="rounded-2xl border border-primary/10 bg-white p-3 text-center text-xs font-semibold text-primary shadow-sm">
              <div className="blister-perf mb-2 h-2 rounded bg-sage" />
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-primary/10 bg-white shadow-xl shadow-primary/5">
        <div className="blister-perf h-3 bg-primary" />
        <div className="p-6 sm:p-9">
          <p className="text-sm font-semibold text-accent">{isRegister ? "Create account" : "Customer sign in"}</p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-ink md:text-2xl">
            {isRegister ? "Join medistore" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {isRegister ? "Enter your details to create a customer profile." : "Use the email and password linked to your account."}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium text-ink">
                  First name
                  <input name="firstName" autoComplete="given-name" required className={fieldClass} />
                </label>
                <label className="text-sm font-medium text-ink">
                  Last name
                  <input name="lastName" autoComplete="family-name" required className={fieldClass} />
                </label>
              </div>
            )}

            <label className="block text-sm font-medium text-ink">
              Email address
              <input name="email" type="email" autoComplete="email" required className={fieldClass} placeholder="you@example.com" />
            </label>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  minLength={8}
                  required
                  className={`${fieldClass} pr-16`}
                  placeholder={isRegister ? "At least 8 characters" : "Your password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 mt-0.5 -translate-y-1/2 text-xs font-semibold text-primary hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink">Confirm password</label>
                <input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} required className={fieldClass} />
              </div>
            )}

            {error && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-offwhite transition-colors hover:bg-primary-600 disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? (isRegister ? "Creating account…" : "Signing in…") : (isRegister ? "Create account" : "Sign in")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-soft">
            {isRegister ? "Already have an account?" : "New to medistore?"}{" "}
            <Link href={isRegister ? "/account/login" : "/account/register"} className="font-semibold text-primary hover:underline">
              {isRegister ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
