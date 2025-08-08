'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Percent, Users, Calendar, DollarSign } from 'lucide-react'

interface Offer {
  id: string
  title: string
  description: string
  discountPercentage: number
  status: 'active' | 'inactive' | 'scheduled'
  targetAudience: 'all' | 'new' | 'existing'
  usageLimit: number
  usedCount: number
  minimumOrderAmount: number
  startDate: string
  endDate: string
  code?: string
}

export function PromotionalOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers?status=active')
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
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'scheduled':
        return 'bg-blue-500'
      case 'inactive':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getTargetAudienceColor = (audience: string) => {
    switch (audience) {
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

  if (offers.length === 0) {
    return null
  }

  return (
    <section className="w-full py-12 bg-gradient-to-r from-[#00008B] to-[#00008B]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Special Offers & Deals
          </h2>
          <p className="text-xl text-white/80">
            Don't miss out on these amazing promotions!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
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
                  <div className="text-3xl font-bold text-[#00008B] flex items-center">
                    <Percent className="h-6 w-6 mr-1" />
                    {offer.discountPercentage}%
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4">
                {offer.description}
              </p>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-[#00FFEF]" />
                  <span>
                    {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 text-[#00FFEF]" />
                  <span>
                    {offer.usedCount} / {offer.usageLimit} used
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2 text-[#00FFEF]" />
                  <span>
                    Min: KES {offer.minimumOrderAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Usage</span>
                  <span>{Math.round((offer.usedCount / offer.usageLimit) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#00FFEF] h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((offer.usedCount / offer.usageLimit) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Action button */}
              <Button
                className="w-full bg-[#00008B] hover:bg-[#00008B]/90 text-white"
                onClick={() => {
                  // Navigate to products page or apply offer
                  window.location.href = '/products'
                }}
              >
                Shop Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
