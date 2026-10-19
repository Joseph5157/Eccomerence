import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AuthRequestError,
  authCookieOptions,
  medusaAuthFetch,
} from "@/lib/customer-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !body.password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const { token } = await medusaAuthFetch<{ token: string }>(
      "/auth/customer/emailpass",
      {
        method: "POST",
        body: JSON.stringify({ email, password: body.password }),
      }
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE, token, authCookieOptions);
    return response;
  } catch (error) {
    const status = error instanceof AuthRequestError ? error.status : 500;
    return NextResponse.json(
      {
        message:
          status === 401
            ? "Incorrect email or password."
            : error instanceof Error
              ? error.message
              : "Unable to sign in.",
      },
      { status }
    );
  }
}
