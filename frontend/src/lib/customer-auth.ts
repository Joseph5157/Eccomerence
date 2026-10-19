import "server-only";

export type { Customer } from "./auth-types";

export const AUTH_COOKIE = "medistore_customer_token";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export class AuthRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthRequestError";
    this.status = status;
  }
}

export async function medusaAuthFetch<T>(
  path: string,
  init: RequestInit = {},
  token?: string
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  if (PUBLISHABLE_KEY) {
    headers.set("x-publishable-api-key", PUBLISHABLE_KEY);
  }
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as {
    message?: string;
  };

  if (!response.ok) {
    throw new AuthRequestError(
      data.message || "We couldn't complete that request. Please try again.",
      response.status
    );
  }

  return data as T;
}

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
