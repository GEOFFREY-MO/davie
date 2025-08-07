'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/layout/hero-section'
import { FeaturedProducts } from '@/components/product/featured-products'
import { BestSellers } from '@/components/product/best-sellers'
import { Product } from '@/types'
import { toast } from 'sonner'

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    price: 15000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    stock: 25,
    featured: true,
    bestSeller: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitoring and GPS capabilities.',
    price: 25000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    stock: 15,
    featured: true,
    bestSeller: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Designer Leather Bag',
    description: 'Handcrafted leather bag with premium materials and elegant design.',
    price: 8500,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    stock: 30,
    featured: true,
    bestSeller: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Organic Coffee Beans',
    description: 'Premium organic coffee beans sourced from the finest regions.',
    price: 1200,
    category: 'Food & Beverages',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop',
    stock: 50,
    featured: false,
    bestSeller: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Wireless Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.',
    price: 8000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    stock: 20,
    featured: true,
    bestSeller: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Premium Yoga Mat',
    description: 'Non-slip yoga mat made from eco-friendly materials for your practice.',
    price: 3500,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    stock: 40,
    featured: false,
    bestSeller: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Smart Home Security Camera',
    description: '1080p HD security camera with night vision and motion detection.',
    price: 12000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    stock: 10,
    featured: true,
    bestSeller: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Artisan Ceramic Mug Set',
    description: 'Handcrafted ceramic mugs perfect for your morning coffee or tea.',
    price: 1800,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
    stock: 35,
    featured: false,
    bestSeller: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default function HomePage() {
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  const handleAddToCart = (product: Product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + 1
    }))
    
    toast.success(`${product.name} added to cart!`, {
      description: `Price: KES ${product.price.toLocaleString()}`,
    })
  }

  const featuredProducts = mockProducts.filter(product => product.featured)
  const bestSellers = mockProducts.filter(product => product.bestSeller)

  return (
         <div className="min-h-screen bg-[#00008B] text-white pt-16">
      <Navbar />
      
      <main>
        <HeroSection />
        <FeaturedProducts products={featuredProducts} onAddToCart={handleAddToCart} />
        <BestSellers products={bestSellers} onAddToCart={handleAddToCart} />
      </main>
      
      <Footer />
    </div>
  )
}
