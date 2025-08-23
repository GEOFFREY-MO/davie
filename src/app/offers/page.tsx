'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PromotionalOffers } from '@/components/promotional/promotional-offers'
import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { useCart } from '@/components/providers/cart-provider'

export default function OffersPage() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/products?inOffer=true&take=24', { cache: 'no-store' })
        if (res.ok) setProducts(await res.json())
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <section className="w-full py-6">
          <div className="max-w-4xl mx-auto px-4">
            <PromotionalOffers />
          </div>
        </section>

        {/* Products in current offers */}
        {products.length > 0 && (
          <section className="w-full py-4">
            <div className="max-w-4xl mx-auto px-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} onAddToCart={(prod) => addItem(prod)} compact />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}


