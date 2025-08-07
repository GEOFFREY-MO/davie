'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
}

export function FeaturedProducts({ products, onAddToCart }: FeaturedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const productsPerPage = 4
  const totalPages = Math.ceil(products.length / productsPerPage)

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentProducts = products.slice(
    currentIndex * productsPerPage,
    (currentIndex + 1) * productsPerPage
  )

  return (
         <section className="py-16 bg-[#00008B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Products
          </h2>
                     <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that our customers love
          </p>
        </div>

        {/* Products Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          {totalPages > 1 && (
            <>
                             <Button
                 variant="outline"
                 size="icon"
                 className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[hsl(var(--color-background))] border shadow-lg hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-accent-foreground))]"
                 onClick={prevPage}
               >
                 <ChevronLeft className="h-4 w-4" />
               </Button>
               
               <Button
                 variant="outline"
                 size="icon"
                 className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[hsl(var(--color-background))] border shadow-lg hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-accent-foreground))]"
                 onClick={nextPage}
               >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                                 className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                   i === currentIndex
                     ? 'bg-[hsl(var(--color-primary))]'
                     : 'bg-[hsl(var(--color-muted))] hover:bg-[hsl(var(--color-muted-foreground)/0.5)]'
                 }`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" className="btn-primary">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
} 