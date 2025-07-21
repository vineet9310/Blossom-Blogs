import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Authentication has been removed, so this middleware is no longer needed.
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
