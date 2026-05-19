import { NextResponse } from "next/server";

const COOKIE_NAME = "jfcr_admin_session";

export async function POST() {
  const response = NextResponse.redirect(
    new URL("/admin/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
  );
  response.cookies.delete(COOKIE_NAME);
  return response;
}
