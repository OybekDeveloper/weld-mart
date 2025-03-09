import { NextResponse } from "next/server";

export function middleware(req) {
  const authCookie = req.cookies.get("auth")?.value;
  const adminAuthCookie = req.cookies.get("adminAuth")?.value;
  const { pathname } = req.nextUrl;

  // Foydalanuvchilar uchun himoyalangan sahifalar
  const protectedRoutes = ["/login", "/register"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Agar "auth" cookie bor bo‘lsa va foydalanuvchi /login, /register yoki /profile sahifalariga kirmoqchi bo‘lsa, uni bosh sahifaga yo‘naltirish
  if (authCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (!authCookie && pathname.startsWith("/profile")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Agar foydalanuvchi /admin sahifalariga kirayotgan bo‘lsa, lekin "adminAuth" cookie'ga ega bo‘lmasa, uni /login-admin sahifasiga yo‘naltirish
  if (pathname.startsWith("/admin") && !adminAuthCookie) {
    return NextResponse.redirect(new URL("/login-admin", req.url));
  }

  return NextResponse.next();
}

// Middleware faqat kerakli sahifalarda ishlashi uchun
export const config = {
  matcher: ["/login", "/register", "/admin/:path*", "/profile/:path*"],
};
