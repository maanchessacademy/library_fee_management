import { auth } from "@/lib/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isLoginPage = nextUrl.pathname === '/login'
  const isApiAuth = nextUrl.pathname.startsWith('/api/auth')

  // Allow API auth routes always
  if (isApiAuth) return undefined

  // If on login page and already logged in, redirect to dashboard
  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', nextUrl))
  }

  // If not logged in and not on login page, redirect to login
  if (!isLoggedIn && !isLoginPage && nextUrl.pathname !== '/') {
    return Response.redirect(new URL('/login', nextUrl))
  }

  // Redirect root to dashboard if logged in, login if not
  if (nextUrl.pathname === '/') {
    if (isLoggedIn) {
      return Response.redirect(new URL('/dashboard', nextUrl))
    }
    return Response.redirect(new URL('/login', nextUrl))
  }

  return undefined
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
