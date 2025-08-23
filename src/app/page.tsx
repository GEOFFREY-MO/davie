'use client'

import { Navbar } from '@/components/layout/navbar'
import { HeroSection } from '@/components/layout/hero-section'
import { BannerCarousel } from '@/components/promotional/banner-carousel'
import { PromotionalOffers } from '@/components/promotional/promotional-offers'
import FeaturedProducts from '@/components/product/featured-products'
import BestSellers from '@/components/product/best-sellers'
import { Footer } from '@/components/layout/footer'
import { FeatureStrip } from '@/components/home/feature-strip'
import { HomeSpotlight } from '@/components/product/home-spotlight'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#00008B]">
      <Navbar />
      <main className="pt-16">
        {/* Move banners and promotions above the hero marquee */}
        <section className="w-full py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BannerCarousel />
          </div>
        </section>
        <HomeSpotlight />
        <PromotionalOffers headerOnly />

        {/* Hero marquee + CTA now comes after promos */}
        <HeroSection />

        {/* Feature strip fades on scroll, placed right before products */}
        <FeatureStrip />

        {/* Compact products block immediately under hero/banner area */}
        <section className="w-full py-4 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <FeaturedProducts compact />
          </div>
        </section>
        <section className="w-full py-4 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <BestSellers compact />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
