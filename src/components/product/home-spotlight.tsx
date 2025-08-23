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
    <section className="py-4 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {products.map((p) => (
            <ProductCard key={p.id} product={p as any} onAddToCart={(prod) => addItem(prod)} compact />
          ))}
        </div>
      </div>
    </section>
  )
}



