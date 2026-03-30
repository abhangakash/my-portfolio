import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.VAULT_JWT_SECRET)

export async function middleware(req) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/vault')) return NextResponse.next()
  if (pathname === '/vault') return NextResponse.next() // login page

  const token = req.cookies.get('vault_token')?.value

  if (!token) return NextResponse.redirect(new URL('/vault', req.url))

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/vault', req.url))
  }
}

export const config = {
  matcher: ['/vault', '/vault/:path*']
}