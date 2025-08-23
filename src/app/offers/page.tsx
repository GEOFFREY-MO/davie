'use client'

import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PromotionalOffers } from '@/components/promotional/promotional-offers'

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
      </main>
      <Footer />
    </div>
  )
}


