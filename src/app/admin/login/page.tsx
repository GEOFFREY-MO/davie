'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Access denied', {
          description: 'Invalid credentials or unauthorized access.',
        })
      } else {
        toast.success('Login successful!', {
          description: 'Welcome to the admin dashboard.',
        })
        router.push('/admin/dashboard')
      }
    } catch (error) {
      toast.error('Access denied', {
        description: 'Unauthorized access attempt.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/95 to-primary/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/davietech-logo.jpg"
                  alt="DAVIETECH Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-2xl font-bold text-primary">DAVIETECH Admin</span>
            </div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@davietech.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 input-focus"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 input-focus"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

                         <div className="mt-6 text-center">
               <p className="text-sm text-muted-foreground">
                 Contact administrator for access credentials
               </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 