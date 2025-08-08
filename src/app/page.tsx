'use client'

import { Navbar } from '@/components/layout/navbar'
import { HeroSection } from '@/components/layout/hero-section'
import FeaturedProducts from '@/components/product/featured-products'
import BestSellers from '@/components/product/best-sellers'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#00008B]">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturedProducts />
        <BestSellers />
      </main>
      <Footer />
    </div>
  )
}
