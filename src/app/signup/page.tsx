'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, User } from 'lucide-react'
import { toast } from 'sonner'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    try {
      setIsLoading(true)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error || 'Failed to sign up')
        return
      }
      toast.success('Account created')
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        router.push('/admin/login')
      } else {
        router.push('/')
      }
    } catch (err) {
      toast.error('Failed to sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#00008B] text-white">
      <Navbar />
      <main className="pt-16 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl">Create your account</CardTitle>
              <CardDescription className="text-gray-300">Sign up to save details and track orders</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="name" className="mb-2 block">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="mb-2 block">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="mb-2 block">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-[#00FFEF] text-black hover:bg-[#00FFEF]/90">
                  {isLoading ? 'Creating account…' : 'Sign Up'}
                </Button>
              </form>
              <p className="text-sm text-gray-300 mt-4 text-center">
                Already have an account? <a href="/admin/login" className="text-[#00FFEF] hover:underline">Sign in</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}


