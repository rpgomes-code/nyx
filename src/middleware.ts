import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
    const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard");

    // Redirect authenticated users away from auth pages
    if (session && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users to login
    if (!session && isProtectedPage) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all paths except static files and API routes (unless auth API)
        "/((?!_next/static|_next/image|favicon.ico|api/(?!auth)).*)",
    ],
};