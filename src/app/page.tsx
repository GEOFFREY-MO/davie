'use client'

import { Navbar } from '@/components/layout/navbar'
import { HeroSection } from '@/components/layout/hero-section'
import { BannerCarousel } from '@/components/promotional/banner-carousel'
import { PromotionalOffers } from '@/components/promotional/promotional-offers'
import FeaturedProducts from '@/components/product/featured-products'
import BestSellers from '@/components/product/best-sellers'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#00008B]">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        
        {/* Banner Carousel */}
        <section className="w-full py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BannerCarousel />
          </div>
        </section>

        {/* Promotional Offers */}
        <PromotionalOffers />
        
        <FeaturedProducts />
        <BestSellers />
      </main>
      <Footer />
    </div>
  )
}
