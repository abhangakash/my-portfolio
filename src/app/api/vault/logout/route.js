import { NextResponse } from 'next/server'

export async function POST(req) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourportfolio.vercel.app'
  const res = NextResponse.redirect(new URL('/', siteUrl))
  res.cookies.set('vault_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 0,
    expires: new Date(0),
  })
  return res
}