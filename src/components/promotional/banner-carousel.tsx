'use client'

import { useEffect, useState } from 'react'

interface Banner {
  id: string
  title: string
  imageUrl: string
  altText: string
  linkUrl?: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'SCHEDULED' | string
  position: 'HERO' | 'SIDEBAR' | string
  startDate: string
  endDate: string
}

export function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/banners?status=active&position=hero', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setBanners(Array.isArray(data) ? data : [])
        }
      } catch (e) {
        console.error('Failed to fetch banners', e)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()

    // Subscribe to SSE for real-time updates
    const evt = new EventSource('/api/updates/stream')
    evt.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data)
        if (payload?.type === 'banners:changed') {
          fetchBanners()
        }
      } catch {
        // ignore malformed events
      }
    }
    return () => evt.close()
  }, [])

  if (loading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[280px] md:min-w-[520px] h-40 md:h-64 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!banners.length) {
    return null
  }

  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {banners.map((banner) => {
          const content = (
            <div className="relative min-w-[280px] md:min-w-[520px] h-40 md:h-64 rounded-xl overflow-hidden shadow-md">
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.imageUrl}
                alt={banner.altText || banner.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Title overlay */}
              {banner.title ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 md:p-4">
                  <h3 className="text-white text-sm md:text-base font-semibold truncate">{banner.title}</h3>
                </div>
              ) : null}
            </div>
          )

          return banner.linkUrl ? (
            <a key={banner.id} href={banner.linkUrl} className="shrink-0" aria-label={banner.title}>
              {content}
            </a>
          ) : (
            <div key={banner.id} className="shrink-0">
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}


