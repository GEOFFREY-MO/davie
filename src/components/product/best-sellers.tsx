'use client'

import { TrendingUp, Star } from 'lucide-react'
import { ProductCard } from './product-card'
import { Product } from '@/types'

interface BestSellersProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
}

export function BestSellers({ products, onAddToCart }: BestSellersProps) {
  const bestSellers = products.filter(product => product.bestSeller).slice(0, 8)

  return (
         <section className="py-16 bg-[#00008B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-6 w-6 text-[hsl(var(--color-accent))]" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Best Sellers
            </h2>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Our most popular products that customers can't stop buying
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product, index) => (
            <div key={product.id} className="relative">
              {/* Best Seller Badge */}
              <div className="absolute -top-2 -left-2 z-10 bg-[#10B981] text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
                <Star className="h-3 w-3 fill-current" />
                <span>#{index + 1}</span>
              </div>
              
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-[hsl(var(--color-primary))] mb-2">
              {bestSellers.length}+
            </div>
            <div className="text-gray-300">
              Best Selling Products
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-[hsl(var(--color-accent))] mb-2">
              4.8★
            </div>
            <div className="text-gray-300">
              Average Rating
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-[hsl(var(--color-vibrant-purple))] mb-2">
              10K+
            </div>
            <div className="text-gray-300">
              Happy Customers
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 