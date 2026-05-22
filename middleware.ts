import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('solano-session');
  if (session?.value !== 'authenticated') {
    return NextResponse.redirect(new URL('/panel-sm-9274', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/panel-sm-9274/dashboard/:path*'],
};
