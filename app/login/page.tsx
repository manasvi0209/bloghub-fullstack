import { LoginForm } from '@/components/login-form'
import { Header } from '@/components/header'

export const metadata = {
  title: 'Login - BlogHub',
  description: 'Sign in to your BlogHub account',
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <LoginForm />
      </main>
    </>
  )
}
