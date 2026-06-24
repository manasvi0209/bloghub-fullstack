import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'
const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  })
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get('auth_token')?.value
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}

export async function getCurrentUser() {
  const token = await getAuthCookie()
  if (!token) {
    return null
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return null
  }

  return decoded.userId
}
