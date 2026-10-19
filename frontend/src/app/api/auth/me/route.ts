import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AuthRequestError,
  type Customer,
  medusaAuthFetch,
} from "@/lib/customer-auth";

export async function GET() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ customer: null });
  }

  try {
    const { customer } = await medusaAuthFetch<{ customer: Customer }>(
      "/store/customers/me?fields=id,email,first_name,last_name,phone",
      {},
      token
    );
    return NextResponse.json({ customer });
  } catch (error) {
    const response = NextResponse.json(
      { customer: null },
      { status: error instanceof AuthRequestError ? error.status : 500 }
    );
    if (error instanceof AuthRequestError && error.status === 401) {
      response.cookies.delete(AUTH_COOKIE);
    }
    return response;
  }
}
