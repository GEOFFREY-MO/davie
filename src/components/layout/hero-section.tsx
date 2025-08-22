import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag, Truck, Shield } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#00008B] via-[#00008B]/95] to-[#00008B]/90] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="space-y-8">
          {/* Marquee headline */}
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
            <div className="marquee h-16 md:h-20 flex items-center">
              <div className="marquee-track text-2xl md:text-4xl font-extrabold tracking-wide">
                YOUR ONE-STOP TECH HUB!
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-center">
            <Link href="/products">
              <Button 
                size="lg" 
                className="relative bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xl px-10 py-6 rounded-2xl shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-yellow-300"
                style={{ 
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                  boxShadow: '0 10px 25px rgba(251, 191, 36, 0.4), 0 0 0 4px rgba(251, 191, 36, 0.2)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  clipPath: 'polygon(0% 0%, 100% 0%, 95% 50%, 100% 100%, 0% 100%, 5% 50%)'
                }}
              >
                <span className="relative z-10">SHOP NOW</span>
                <ArrowRight className="ml-3 h-6 w-6 relative z-10" />
                <div className="absolute inset-0 bg-yellow-300 rounded-2xl transform rotate-1 scale-105 opacity-50"></div>
                <div className="absolute inset-0 bg-yellow-200 rounded-2xl transform -rotate-1 scale-105 opacity-30"></div>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeMove {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .marquee { position: relative; overflow: hidden; }
        .marquee-track {
          white-space: nowrap;
          animation: marqueeMove 30s linear infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  )
} 