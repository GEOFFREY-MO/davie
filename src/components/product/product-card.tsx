'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  viewMode?: 'grid' | 'list'
}

export function ProductCard({ product, onAddToCart, viewMode = 'grid' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  if (viewMode === 'list') {
    return (
      <Card 
        className="group overflow-hidden card-hover"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          <div className="relative w-48 h-48 overflow-hidden flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.featured && (
                <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                  Featured
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-[#10B981] text-white text-xs px-2 py-1 rounded-full font-medium">
                  Best Seller
                </span>
              )}
            </div>

            {/* Stock indicator */}
            {product.stock === 0 && (
              <div className="absolute top-2 right-2">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-muted-foreground mb-3">
                  {product.description}
                </p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`} 
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-1">(4.0)</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Category: {product.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <span className="text-2xl font-bold text-primary block mb-2">
                  KES {product.price.toLocaleString()}
                </span>
                <Button 
                  className="btn-primary"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card 
      className="group overflow-hidden card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Overlay with quick actions */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex space-x-2">
            <Link href={`/products/${product.id}`}>
              <Button size="sm" variant="secondary" className="rounded-full">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Button 
              size="sm" 
              className="rounded-full btn-accent"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.featured && (
            <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
          {product.bestSeller && (
            <span className="bg-[#10B981] text-white text-xs px-2 py-1 rounded-full font-medium">
              Best Seller
            </span>
          )}
        </div>

        {/* Stock indicator */}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`} 
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            KES {product.price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">
            {product.stock} in stock
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full btn-primary"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
} 