'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/product/product-card'
import { useCart } from '@/components/providers/cart-provider'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  featured: boolean
  bestSeller: boolean
}

export function HomeSpotlight() {
  const [products, setProducts] = useState<Product[]>([])
  const { addItem } = useCart()

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/products?take=4', { cache: 'no-store' })
        if (res.ok) {
          setProducts(await res.json())
        }
      } catch {}
    }
    load()
  }, [])

  if (!products.length) return null

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p as any} onAddToCart={(prod) => addItem(prod)} />
          ))}
        </div>
      </div>
    </section>
  )
}


