import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])
const isPublicEntryRoute = createRouteMatcher(['/', '/login', '/register','/api/webhooks/user(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  if (!userId && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting
    console.log("Unauthenticated access attempt to:", req.url)
    return redirectToSignIn()
  }

  if (userId && isPublicEntryRoute(req)) {
    const url = new URL('/dashboard', req.url);
    return Response.redirect(url);
  }
})

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard(.*)',
    '/api/webhooks/user(.*)',
  ],
}