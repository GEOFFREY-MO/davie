'use client'

import { useEffect, useState, useMemo } from 'react'

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
  const [index, setIndex] = useState(0)
  const [singleTick, setSingleTick] = useState(0)
  const bannerCount = banners.length

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

  // Reset index if list length changes
  useEffect(() => {
    if (index >= bannerCount) setIndex(0)
  }, [bannerCount, index])

  // Auto-advance every 5s when there are multiple banners
  useEffect(() => {
    if (bannerCount <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % bannerCount)
    }, 5000)
    return () => clearInterval(id)
  }, [bannerCount])

  // Single banner: toggle subtle motion every 5s
  useEffect(() => {
    if (bannerCount !== 1) return
    const id = setInterval(() => {
      setSingleTick((t) => (t + 1) % 2)
    }, 5000)
    return () => clearInterval(id)
  }, [bannerCount])

  if (loading) {
    return (
      <div className="w-full overflow-hidden">
        <div className="w-full h-40 md:h-64 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!banners.length) {
    return null
  }

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden rounded-xl h-40 md:h-64">
        {bannerCount <= 1 ? (
          // Single banner with subtle motion toggle every 5s
          banners.map((banner) => (
            <div key={banner.id} className="relative w-full h-40 md:h-64">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.imageUrl}
                alt={banner.altText || banner.title}
                className="w-full h-full object-cover"
                loading="lazy"
                style={{
                  transform: singleTick === 0 ? 'scale(1)' : 'scale(1.05)',
                  transition: 'transform 2000ms ease-in-out',
                }}
              />
              {banner.title ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 md:p-4">
                  <h3 className="text-white text-sm md:text-base font-semibold truncate">{banner.title}</h3>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <>
            {/* Track for multiple banners */}
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${index * 100}%)`, width: `${bannerCount * 100}%` }}
            >
              {banners.map((banner) => {
                const slide = (
                  <div className="relative w-full h-40 md:h-64 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={banner.imageUrl}
                      alt={banner.altText || banner.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {banner.title ? (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 md:p-4">
                        <h3 className="text-white text-sm md:text-base font-semibold truncate">{banner.title}</h3>
                      </div>
                    ) : null}
                  </div>
                )

                return banner.linkUrl ? (
                  <a key={banner.id} href={banner.linkUrl} className="w-full" aria-label={banner.title}>
                    {slide}
                  </a>
                ) : (
                  <div key={banner.id} className="w-full">
                    {slide}
                  </div>
                )
              })}
            </div>

            {/* Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}


