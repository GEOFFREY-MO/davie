'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Truck, Shield } from 'lucide-react'

export function FeatureStrip() {
  const [fade, setFade] = useState(1)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const next = Math.max(0, Math.min(1, 1 - y / 300))
      setFade(next)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      className="w-full py-3"
      style={{ opacity: fade, transform: `translateY(${(1 - fade) * -10}px)`, transition: 'opacity 200ms linear, transform 200ms linear' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="flex items-center space-x-2 sm:space-x-3 bg-white/10 border border-white/20 rounded-xl p-2.5 sm:p-3.5">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-xs sm:text-sm">Wide Selection</h3>
              <p className="text-[10px] sm:text-xs text-white/80">Thousands of products</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 bg-white/10 border border-white/20 rounded-xl p-2.5 sm:p-3.5">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-xs sm:text-sm">Fast Delivery</h3>
              <p className="text-[10px] sm:text-xs text-white/80">Same day delivery</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3 bg-white/10 border border-white/20 rounded-xl p-2.5 sm:p-3.5">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-xs sm:text-sm">Secure Payment</h3>
              <p className="text-[10px] sm:text-xs text-white/80">100% secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


