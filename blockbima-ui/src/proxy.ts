import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

const PUBLIC_PATHS = ["/", "/login", "/access-denied"];

export async function proxy(request: Request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/auth")) {
    return auth0.middleware(request);
  }

  if (PUBLIC_PATHS.includes(url.pathname)) {
    return NextResponse.next();
  }

  const session = await auth0.getSession();

  if (!session) {
    return Response.redirect(`${url.origin}/auth/login`);
  }

  return auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
