import { SignupForm } from '@/components/signup-form'
import { Header } from '@/components/header'

export const metadata = {
  title: 'Sign Up - BlogHub',
  description: 'Create a new BlogHub account',
}

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <SignupForm />
      </main>
    </>
  )
}
