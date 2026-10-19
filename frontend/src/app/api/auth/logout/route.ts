import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/customer-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(AUTH_COOKIE);
  return response;
}
