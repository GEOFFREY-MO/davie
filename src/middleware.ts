import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'ADMIN'
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = req.nextUrl.pathname === '/admin/login'

    // Allow access to login page without authentication
    if (isLoginPage) {
      return NextResponse.next()
    }

    // Redirect to login if accessing admin routes without admin role
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without token
        if (req.nextUrl.pathname === '/admin/login') {
          return true
        }
        return !!token
      }
    }
  }
)

export const config = {
  matcher: ['/admin/:path*']
} 