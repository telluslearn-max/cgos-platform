import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // SaaS Multi-tenant slug extraction from header or query param, defaulting to pilot tenant
  const tenantSlug = request.headers.get("x-tenant-slug") || "nuru-electronics";

  const response = NextResponse.next();
  response.headers.set("x-tenant-resolved", tenantSlug);
  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
