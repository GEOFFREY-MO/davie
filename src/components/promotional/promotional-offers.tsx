'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Percent, Users, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface Offer {
  id: string
  title: string
  description: string
  discountPercentage: number
  status: 'active' | 'inactive' | 'scheduled'
  targetAudience: 'all' | 'new' | 'existing'
  usageLimit?: number
  usedCount?: number
  minimumOrderAmount?: number
  // Some APIs may return this field name instead
  minimumPurchase?: number
  startDate: string
  endDate: string
  code?: string
}

export function PromotionalOffers({ headerOnly = false }: { headerOnly?: boolean }) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers?status=active', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          setOffers(data)
        } else {
          console.error('Failed to fetch offers')
        }
      } catch (error) {
        console.error('Error fetching offers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOffers()

    // Subscribe to SSE for instant updates
    const evt = new EventSource('/api/updates/stream')
    evt.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data)
        if (payload?.type === 'offers:changed') {
          fetchOffers()
        }
      } catch {}
    }
    return () => evt.close()
  }, [])

  const getStatusColor = (status: string) => {
    const key = String(status).toLowerCase()
    switch (key) {
      case 'active':
        return 'bg-[#56CC9D] text-white'
      case 'scheduled':
        return 'bg-blue-500 text-white'
      case 'inactive':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getTargetAudienceColor = (audience: string) => {
    const key = String(audience).toLowerCase()
    switch (key) {
      case 'all':
        return 'bg-blue-100 text-blue-800'
      case 'new':
        return 'bg-green-100 text-green-800'
      case 'existing':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatNumber = (value?: number) =>
    typeof value === 'number' && !Number.isNaN(value) ? value.toLocaleString() : '0'

  const computeUsagePercent = (used?: number, limit?: number) => {
    if (!limit || limit <= 0) return 0
    const percent = ((used ?? 0) / limit) * 100
    return Math.round(Math.min(percent, 100))
  }

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // In headerOnly mode, always render the header/CTAs even if there are no offers

  const sectionClass = headerOnly
    ? 'w-full bg-gradient-to-r from-[#00008B] to-[#00008B]/90 py-1 lg:py-0 lg:h-[120px] flex items-center'
    : 'w-full py-6 bg-gradient-to-r from-[#00008B] to-[#00008B]/90'

  return (
    <section className={sectionClass}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-0">
          <div className="text-center md:text-left mb-1 md:mb-0">
            <h2 className={headerOnly ? 'text-sm md:text-base font-bold text-white' : 'text-xl md:text-2xl font-bold text-white'}>
              Special Offers & Deals
            </h2>
            <p className={headerOnly ? 'text-[11px] md:text-xs text-white/80' : 'text-sm md:text-base text-white/80'}>
              Don't miss out on these amazing promotions!
            </p>
          </div>
          <div className="flex items-center justify-center md:justify-end gap-2 md:ml-4">
            <Link href="/offers">
              <Button
                className="bg-[#56CC9D] hover:bg-[#56CC9D]/90 text-black font-bold px-3 py-1.5 text-xs rounded-lg border border-black/10 cursor-pointer"
                style={{ cursor: 'pointer' }}
              >
                Click to View Special Offers
              </Button>
            </Link>
          </div>
        </div>

        {!headerOnly && offers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
          {offers.map((offer) => (
            <div key={offer.id} className="relative group">
              {/* Ambient colorful glow orbs (yellow, orange, green, purple) */}
              <div className="pointer-events-none absolute -inset-6 -z-10 opacity-80">
                <div className="absolute -top-10 -left-8 h-28 w-28 bg-amber-400/35 rounded-full blur-3xl group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute -bottom-12 -right-10 h-36 w-36 bg-orange-400/35 rounded-full blur-3xl group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-1/3 h-24 w-24 bg-green-500/30 rounded-full blur-3xl group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute -top-6 right-1/4 h-20 w-20 bg-purple-500/30 rounded-full blur-3xl group-hover:opacity-90 transition-opacity"></div>
              </div>

              {/* Conic gradient ring and glass card */}
              <div
                className="relative rounded-2xl p-[2px] transition-transform duration-300 group-hover:scale-[1.01]"
                style={{
                  background:
                    'conic-gradient(from 180deg at 50% 50%, rgba(245,158,11,0.65), rgba(249,115,22,0.65), rgba(16,185,129,0.65), rgba(168,85,247,0.65), rgba(245,158,11,0.65))',
                }}
              >
                <div className="rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.35),0_0_60px_-25px_rgba(56,189,248,0.45),0_0_80px_-30px_rgba(168,85,247,0.4)]">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {offer.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={getStatusColor(offer.status)}>
                      {offer.status}
                    </Badge>
                    <Badge className={getTargetAudienceColor(offer.targetAudience)}>
                      {offer.targetAudience}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 flex items-center drop-shadow-sm">
                    <Percent className="h-5 w-5 mr-1" />
                    {offer.discountPercentage}%
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">
                {offer.description}
              </p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-[#00FFEF]" />
                  <span>
                    {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-[#00FFEF]" />
                  <span>
                    {(offer.usedCount ?? 0)} / {(offer.usageLimit ?? 0)} used
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2 text-[#00FFEF]" />
                  <span>
                    Min: KES {formatNumber(offer.minimumOrderAmount ?? offer.minimumPurchase)}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Usage</span>
                  <span>{computeUsagePercent(offer.usedCount, offer.usageLimit)}%</span>
                </div>
                <div className="w-full bg-gray-200/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600"
                    style={{
                      width: `${computeUsagePercent(offer.usedCount, offer.usageLimit)}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Action button */}
              <Button
                className="w-full bg-[#00008B] hover:bg-[#00008B]/90 text-white font-bold py-2 text-sm shadow-[0_8px_18px_rgba(59,130,246,0.28)] hover:shadow-[0_10px_24px_rgba(59,130,246,0.35)] transform hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-[#00FFEF]/20"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  // Navigate to products page or apply offer
                  window.location.href = '/products'
                }}
              >
                Shop Now
              </Button>
              </div>
            </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
