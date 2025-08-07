import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/components/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DAVIETECH - Your One-Stop Tech Hub',
  description: 'Discover amazing tech products at DAVIETECH. Shop the latest technology with secure payments and fast delivery.',
  keywords: 'ecommerce, shopping, online store, davietech, kenya, technology, tech hub',
  authors: [{ name: 'DAVIETECH' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
