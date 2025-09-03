import Link from 'next/link'
import Image from 'next/image'
import { Facebook, X, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#00008B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Mobile-first three-column layout */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {/* Brand Section - Compact for mobile */}
          <div className="col-span-3 sm:col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/davietech-logo.jpg"
                  alt="DAVIETECH Logo"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="text-sm sm:text-base lg:text-xl font-bold">DAVIETECH</span>
            </div>
            <p className="text-white/80 mb-2 sm:mb-4 text-xs sm:text-sm leading-tight">
              YOUR ONE-STOP TECH HUB! Quality technology products with secure payments and fast delivery across Kenya.
            </p>
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4">
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">
                <Facebook className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">
                <Instagram className="h-3 w-3 sm:h-4 sm:w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links - Compact */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors duration-200 text-xs sm:text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-cyan-400 transition-colors duration-200 text-xs sm:text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors duration-200 text-xs sm:text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-cyan-400 transition-colors duration-200 text-xs sm:text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Compact */}
          <div className="text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Contact Us</h3>
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                <span className="text-xs sm:text-sm">+254 751 030 250</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                <span className="text-xs sm:text-sm">info@davietech.com</span>
              </div>
              <div className="flex items-start justify-center sm:justify-start space-x-1 sm:space-x-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400 mt-0.5" />
                <span className="text-xs sm:text-sm leading-tight">Old Batian Building, Nyeri</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="border-t border-white/20 mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 text-center">
          <p className="text-white/60 text-xs sm:text-sm">
            © 2025 DAVIETECH. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 