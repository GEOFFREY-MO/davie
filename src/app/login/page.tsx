'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Mail } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const params = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        toast.error('Invalid email or password')
      } else {
        const callbackUrl = params.get('callbackUrl') || '/'
        router.push(callbackUrl)
      }
    } catch (err) {
      toast.error('Failed to sign in')
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
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription className="text-gray-300">Sign in to continue shopping</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="mb-2 block">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 bg白/10 border白/20 text-white placeholder:text-gray-400" />
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
                  {isLoading ? 'Signing in…' : 'Sign In'}
                </Button>
              </form>
              <p className="text-sm text-gray-300 mt-4 text-center">
                New here? <a href="/signup" className="text-[#00FFEF] hover:underline">Create an account</a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}


