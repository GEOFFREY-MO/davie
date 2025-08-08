'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Banner {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  position: 'hero' | 'sidebar' | 'footer'
  status: 'active' | 'inactive' | 'scheduled'
  startDate: string
  endDate: string
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners?position=hero&status=active')
        if (response.ok) {
          const data = await response.json()
          setBanners(data)
        } else {
          console.error('Failed to fetch banners')
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        )
      }, 5000) // Change banner every 5 seconds

      return () => clearInterval(interval)
    }
  }, [banners.length])

  const nextBanner = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevBanner = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
  }

  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"></div>
    )
  }

  if (banners.length === 0) {
    return null
  }

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={banner.imageUrl}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
                {banner.title}
              </h2>
              <p className="text-lg md:text-xl mb-6 opacity-90 drop-shadow-md">
                {banner.description}
              </p>
              <Button
                onClick={() => window.open(banner.linkUrl, '_blank')}
                className="bg-[#00FFEF] hover:bg-[#00FFEF]/90 text-black font-bold px-8 py-3 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-white/20"
                style={{ cursor: 'pointer' }}
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <Button
            onClick={prevBanner}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 cursor-pointer"
            size="sm"
            style={{ cursor: 'pointer' }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 cursor-pointer"
            size="sm"
            style={{ cursor: 'pointer' }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                  index === currentIndex ? 'bg-[#00FFEF]' : 'bg-white/50'
                }`}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
