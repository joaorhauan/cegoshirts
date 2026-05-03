import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin/login'],
}