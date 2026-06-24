'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary hover:no-underline">
          BlogHub
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <div className="text-sm text-muted-foreground">
                Welcome, <span className="font-semibold">{user.username}</span>
              </div>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
