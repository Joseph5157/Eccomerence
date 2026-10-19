import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AuthRequestError,
  authCookieOptions,
  medusaAuthFetch,
} from "@/lib/customer-auth";

type RegistrationBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegistrationBody;
    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();

    if (!firstName || !lastName || !email || !body.password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const { token: registrationToken } = await medusaAuthFetch<{
      token: string;
    }>("/auth/customer/emailpass/register", {
      method: "POST",
      body: JSON.stringify({ email, password: body.password }),
    });

    await medusaAuthFetch(
      "/store/customers",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
        }),
      },
      registrationToken
    );

    const { token } = await medusaAuthFetch<{ token: string }>(
      "/auth/customer/emailpass",
      {
        method: "POST",
        body: JSON.stringify({ email, password: body.password }),
      }
    );

    const response = NextResponse.json({ success: true }, { status: 201 });
    response.cookies.set(AUTH_COOKIE, token, authCookieOptions);
    return response;
  } catch (error) {
    const status = error instanceof AuthRequestError ? error.status : 500;
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to create account.",
      },
      { status }
    );
  }
}
