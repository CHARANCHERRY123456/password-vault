import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/dashboard" , "/"];
const publicPaths = ["/login", "/signup"];

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const isProtectedRoute = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));
    const isPublicRoute = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"));

    const token = req.cookies.get("token")?.value;

    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};

