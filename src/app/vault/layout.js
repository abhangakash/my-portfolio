import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.VAULT_JWT_SECRET)

export default async function VaultLayout({ children }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('vault_token')?.value

  let valid = false
  if (token) {
    try {
      await jwtVerify(token, secret)
      valid = true
    } catch {}
  }

  return <>{children}</>
}