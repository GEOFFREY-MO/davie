import Link from 'next/link'
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Welcome to
                <span className="block text-[hsl(var(--color-accent))]">DAVIETECH</span>
                YOUR ONE-STOP TECH HUB!
              </h1>
                             <p className="text-xl text-[hsl(var(--color-primary-foreground)/0.9)] max-w-lg">
                Your premier destination for quality technology products. Shop with confidence knowing you're getting the best deals and fastest delivery.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="btn-accent text-lg px-8 py-6">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                                 <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-[hsl(var(--color-primary-foreground)/0.3)] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary-foreground)/0.1)]">
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                                 <div className="w-10 h-10 bg-[hsl(var(--color-accent)/0.2)] rounded-lg flex items-center justify-center">
                   <ShoppingBag className="h-5 w-5 text-[hsl(var(--color-accent))]" />
                 </div>
                 <div>
                   <h3 className="font-semibold">Wide Selection</h3>
                   <p className="text-sm text-[hsl(var(--color-primary-foreground)/0.7)]">Thousands of products</p>
                 </div>
               </div>
               
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-[hsl(var(--color-accent)/0.2)] rounded-lg flex items-center justify-center">
                   <Truck className="h-5 w-5 text-[hsl(var(--color-accent))]" />
                 </div>
                 <div>
                   <h3 className="font-semibold">Fast Delivery</h3>
                   <p className="text-sm text-[hsl(var(--color-primary-foreground)/0.7)]">Same day delivery</p>
                 </div>
               </div>
               
               <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-[hsl(var(--color-accent)/0.2)] rounded-lg flex items-center justify-center">
                   <Shield className="h-5 w-5 text-[hsl(var(--color-accent))]" />
                 </div>
                 <div>
                   <h3 className="font-semibold">Secure Payment</h3>
                   <p className="text-sm text-[hsl(var(--color-primary-foreground)/0.7)]">100% secure checkout</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center space-y-4">
                                     <div className="w-20 h-20 bg-[hsl(var(--color-accent))] rounded-full mx-auto flex items-center justify-center">
                     <ShoppingBag className="h-10 w-10 text-[hsl(var(--color-accent-foreground))]" />
                   </div>
                   <h3 className="text-2xl font-bold">Start Shopping</h3>
                   <p className="text-[hsl(var(--color-primary-foreground)/0.8)]">
                     Browse our collection of premium products
                   </p>
                   <div className="flex justify-center space-x-4 text-sm">
                     <div className="text-center">
                       <div className="font-bold text-[hsl(var(--color-accent))]">10K+</div>
                       <div className="text-[hsl(var(--color-primary-foreground)/0.7)]">Products</div>
                     </div>
                     <div className="text-center">
                       <div className="font-bold text-[hsl(var(--color-accent))]">5K+</div>
                       <div className="text-[hsl(var(--color-primary-foreground)/0.7)]">Customers</div>
                     </div>
                     <div className="text-center">
                       <div className="font-bold text-[hsl(var(--color-accent))]">99%</div>
                       <div className="text-[hsl(var(--color-primary-foreground)/0.7)]">Satisfaction</div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
                         <div className="absolute -top-4 -right-4 w-32 h-32 bg-[hsl(var(--color-accent)/0.2)] rounded-full blur-xl"></div>
             <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[hsl(var(--color-accent)/0.3)] rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 