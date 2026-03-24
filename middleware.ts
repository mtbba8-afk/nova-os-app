import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'

/** Public routes only — everything else (pages + API) requires a session. */
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/stripe/webhook(.*)',
])

const clerkHandler = clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return
  await auth().protect()
})

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const secretKey = process.env.CLERK_SECRET_KEY
  if (!secretKey || secretKey.trim() === '') {
    console.error('[middleware] CLERK_SECRET_KEY is not set — add it in Vercel Environment Variables')
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  try {
    return await clerkHandler(request, event)
  } catch (err) {
    console.error('[middleware] Clerk invocation failed:', err)
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
