'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Eye, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  viewMode?: 'grid' | 'list'
}

export function ProductCard({ product, onAddToCart, viewMode = 'grid' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isZooming, setIsZooming] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const handleEyeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowModal(true)
    setZoomLevel(1)
    setRotation(0)
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return
    
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => {
    if (zoomLevel > 1) {
      setIsZooming(true)
    }
  }

  const handleMouseLeave = () => {
    setIsZooming(false)
  }

  const resetView = () => {
    setZoomLevel(1)
    setRotation(0)
    setIsZooming(false)
  }

  // Product Detail Modal
  const ProductDetailModal = () => (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center justify-between">
            <span>{product.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowModal(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image Section with Zoom */}
          <div className="space-y-4">
            <div className="relative">
              {/* Zoom Controls */}
              <div className="absolute top-2 right-2 z-10 flex space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleZoomOut}
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleZoomIn}
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleRotate}
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={resetView}
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-xs"
                >
                  Reset
                </Button>
              </div>

              {/* Zoomable Image */}
              <div
                ref={imageRef}
                className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-300"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transformOrigin: isZooming ? `${mousePosition.x}% ${mousePosition.y}%` : 'center',
                  }}
                />
                
                {/* Lens Effect */}
                {isZooming && zoomLevel > 1 && (
                  <div
                    className="absolute w-32 h-32 border-2 border-white shadow-lg rounded-full pointer-events-none"
                    style={{
                      left: `${mousePosition.x}%`,
                      top: `${mousePosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                      background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`,
                    }}
                  />
                )}
              </div>

              {/* Zoom Level Indicator */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {Math.round(zoomLevel * 100)}%
              </div>
            </div>

            {/* Product Actions */}
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  handleAddToCart()
                  setShowModal(false)
                }}
                className="flex-1 bg-[#00008B] hover:bg-[#00008B]/90 text-white"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Link href={`/products/${product.id}`}>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold">
                  View Details
                </Button>
              </Link>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-gray-500 text-sm italic">Click "View Details" to see full description</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="text-gray-600 ml-2">(4.0)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold">{product.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Stock:</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Price:</span>
                <span className="text-3xl font-bold text-[#00008B]">
                  KES {product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex space-x-2">
              {product.featured && (
                <span className="bg-[#00FFEF] text-black text-sm px-3 py-1 rounded-full font-medium">
                  Featured
                </span>
              )}
              {product.bestSeller && (
                <span className="bg-[#10B981] text-white text-sm px-3 py-1 rounded-full font-medium">
                  Best Seller
                </span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  if (viewMode === 'list') {
    return (
      <>
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

              {/* Quick View Button */}
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full bg-white/90 hover:bg-white text-gray-900"
                  onClick={handleEyeClick}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm italic mb-3">Click "View Details" to see full description</p>
                  
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
                      <span className="text-sm text-gray-600 ml-1">(4.0)</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Category: {product.category}
                    </span>
                    <span className="text-sm text-gray-600">
                      Stock: {product.stock}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary block mb-2">
                    KES {product.price.toLocaleString()}
                  </span>
                  <Button 
                    className="bg-[#00008B] hover:bg-[#00008B]/90 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                    style={{ cursor: 'pointer' }}
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
        <ProductDetailModal />
      </>
    )
  }

  return (
    <>
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
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full bg-white/90 hover:bg-white text-gray-900"
                onClick={handleEyeClick}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                className="rounded-full bg-[#00008B] hover:bg-[#00008B]/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ cursor: 'pointer' }}
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
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors text-gray-900">
              {product.name}
            </h3>
            <p className="text-gray-500 text-sm italic line-clamp-1">
              Click "View Details" to see full description
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
              <span className="text-xs text-gray-600 ml-1">(4.0)</span>
            </div>
            <span className="text-sm text-gray-600">
              {product.category}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              KES {product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">
              {product.stock} in stock
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-[#00008B] hover:bg-[#00008B]/90 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
            style={{ cursor: 'pointer' }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
      <ProductDetailModal />
    </>
  )
} 