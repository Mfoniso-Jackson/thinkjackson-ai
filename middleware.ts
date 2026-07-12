import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function unauthorized(message = "Authentication required.") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "www-authenticate": 'Basic realm="thinkjackson sales", charset="UTF-8"',
      "x-robots-tag": "noindex, nofollow"
    }
  });
}

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin/sales")) {
    return NextResponse.next();
  }

  const password = process.env.ADMIN_SALES_PASSWORD;
  const username = process.env.ADMIN_SALES_USERNAME ?? "mfoniso";

  if (!password) {
    return new NextResponse("Admin sales dashboard is not configured. Set ADMIN_SALES_PASSWORD.", {
      status: 503,
      headers: {
        "x-robots-tag": "noindex, nofollow"
      }
    });
  }

  const header = request.headers.get("authorization");

  if (!header?.startsWith("Basic ")) {
    return unauthorized();
  }

  const decoded = atob(header.slice("Basic ".length));
  const separator = decoded.indexOf(":");
  const suppliedUsername = decoded.slice(0, separator);
  const suppliedPassword = decoded.slice(separator + 1);

  if (suppliedUsername !== username || suppliedPassword !== password) {
    return unauthorized("Invalid credentials.");
  }

  const response = NextResponse.next();
  response.headers.set("x-robots-tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/sales/:path*"]
};
