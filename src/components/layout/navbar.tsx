'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
         <nav className="fixed top-0 left-0 right-0 z-50 bg-[#08153A] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
                         <div className="w-8 h-8 bg-[hsl(var(--color-accent))] rounded-lg flex items-center justify-center">
               <span className="text-[hsl(var(--color-accent-foreground))] font-bold text-lg">D</span>
            </div>
                                <span className="text-xl font-bold">DAVIETECH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
                         <Link 
               href="/" 
               className="hover:text-[hsl(var(--color-accent))] transition-colors duration-200"
             >
               Home
             </Link>
             <Link 
               href="/products" 
               className="hover:text-[hsl(var(--color-accent))] transition-colors duration-200"
             >
               Products
             </Link>
             <Link 
               href="/contact" 
               className="hover:text-[hsl(var(--color-accent))] transition-colors duration-200"
             >
               Contact
             </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-[hsl(var(--color-accent))]"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-[hsl(var(--color-accent))] text-[hsl(var(--color-accent-foreground))] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>

            {/* Admin Link (only show if logged in as admin) */}
            {session?.user?.role === 'ADMIN' && (
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="sm">
                  Admin
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="hover:text-[hsl(var(--color-accent))] transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="hover:text-[hsl(var(--color-accent))] transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-[hsl(var(--color-accent))] transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-[hsl(var(--color-accent))]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 