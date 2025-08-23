'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PromotionalOffers } from '@/components/promotional/promotional-offers'
import FeaturedProducts from '@/components/product/featured-products'

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <section className="w-full py-6">
          <div className="max-w-4xl mx-auto px-4">
            <PromotionalOffers />
          </div>
        </section>

        {/* Spotlight products selected by admin (featured), compact with Was/Now pricing */}
        <section className="w-full py-4">
          <div className="max-w-4xl mx-auto px-4">
            <FeaturedProducts compact />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}


