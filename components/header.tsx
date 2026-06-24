'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LogOut, Menu, X } from 'lucide-react'

interface HeaderProps {
  user?: {
    id: string
    email: string
    name: string
  }
}

export function Header({ user }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  if (!isMounted) return null

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          BlogHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-foreground hover:text-primary transition">
            Home
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary transition"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition text-sm"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-foreground hover:text-primary transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-md hover:bg-muted transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3">
          <Link href="/" className="text-foreground hover:text-primary transition">
            Home
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary transition"
              >
                Dashboard
              </Link>
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 transition text-sm w-full justify-center"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-foreground hover:text-primary transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition text-center"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
