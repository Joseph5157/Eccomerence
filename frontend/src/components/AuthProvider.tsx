"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Customer } from "@/lib/auth-types";

type AuthContextValue = {
  customer: Customer | null;
  loading: boolean;
  refreshCustomer: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCustomer = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await response.json()) as { customer: Customer | null };
      setCustomer(response.ok ? data.customer : null);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCustomer();
  }, [refreshCustomer]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCustomer(null);
  }, []);

  const value = useMemo(
    () => ({ customer, loading, refreshCustomer, logout }),
    [customer, loading, refreshCustomer, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
