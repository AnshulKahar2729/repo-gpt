import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

async function verifyJWT(token: string, secret: string) {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);
  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch (err) {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const protectedPaths = ["/dashboard", "/profile"];
  const { pathname } = req.nextUrl;
  console.log({pathname});

  // Redirect authorized user from /login to /dashboard
  if (pathname === "/login") {
    const token = req.cookies.get('token')?.value;
    if (token && token.split('.').length === 3) {
      const valid = await verifyJWT(token, JWT_SECRET);
      if (valid) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    return NextResponse.next();
  }

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = req.cookies.get('token')?.value;
    console.log({token});
    if (!token) {
      console.log('[middleware] No token found');
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (token.split('.').length !== 3) {
      console.log('[middleware] Malformed token:', token);
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const valid = await verifyJWT(token, JWT_SECRET);
    if (!valid) {
      console.log('[middleware] Invalid token');
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile", "/login"],
};
