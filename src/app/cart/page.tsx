'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { Product } from '@/types'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/providers/cart-provider'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { signIn } from 'next-auth/react'

interface CartItem {
  product: Product
  quantity: number
}

// Cart items come from the shared CartProvider

export default function CartPage() {
  const { items, setItemQuantity, removeItem: removeItemFromCart, clear } = useCart()
  const cartItems: CartItem[] = items.map(it => ({ product: it.product, quantity: it.quantity }))
  const [couponCode, setCouponCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    collection: '',
    notes: ''
  })
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [saveInfo, setSaveInfo] = useState(true)

  // Prefill customer from previous checkout
  useEffect(() => {
    try {
      const saved = localStorage.getItem('davie.customer.v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        setCustomer(prev => ({ ...prev, ...parsed }))
      }
    } catch {}
  }, [])

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setItemQuantity(productId, newQuantity)
  }

  const removeItem = (productId: string) => {
    removeItemFromCart(productId)
    toast.success('Item removed from cart')
  }

  const clearCart = () => {
    clear()
    toast.success('Cart cleared')
  }

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }
    
    // Mock coupon logic
    if (couponCode.toLowerCase() === 'welcome10') {
      toast.success('Coupon applied! 10% discount added')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    // Basic validation for guest checkout
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim() || !customer.collection.trim()) {
      toast.error('Please fill in name, email, phone and collection location')
      return
    }
    // Very light email/phone checks
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      toast.error('Please enter a valid email')
      return
    }
    if (!/^(?:254|0)7\d{8}$/.test(customer.phone)) {
      toast.error('Enter phone as 2547XXXXXXXX or 07XXXXXXXX')
      return
    }

    // Normalize phone to international format 2547XXXXXXXX
    const normalizedPhone = customer.phone.startsWith('0')
      ? `254${customer.phone.slice(1)}`
      : customer.phone

    try {
      setIsLoading(true)
      const res = await fetch('/api/payments/mpesa/stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: normalizedPhone,
          amount: Math.round(total),
          accountReference: 'DAVIETECH',
          // Extra metadata (ignored by API today but useful for order creation)
          customer: {
            name: customer.name,
            email: customer.email,
            collection: customer.collection,
            notes: customer.notes,
          }
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to initiate STK')
      // Save info for next purchase if enabled
      if (saveInfo) {
        try { localStorage.setItem('davie.customer.v1', JSON.stringify(customer)) } catch {}
      }
      toast.success('M-Pesa STK sent. Check your phone to complete payment.')
      setIsCheckoutOpen(false)
    } catch (e: any) {
      toast.error(e?.message || 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const shipping = subtotal > 5000 ? 0 : 500 // Free shipping over KES 5000
  const tax = subtotal * 0.16 // 16% VAT
  const discount = couponCode.toLowerCase() === 'welcome10' ? subtotal * 0.1 : 0
  const total = subtotal + shipping + tax - discount

  return (
    <div className="min-h-screen bg-[#00008B] text-white pt-16">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-300">
            Review your items and proceed to checkout
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-300 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button className="bg-[#00FFEF] text-black hover:bg-[#00FFEF]/90">
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-[#08153A] rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearCart}
                    className="text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    Clear Cart
                  </Button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.product.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="relative w-20 h-20 overflow-hidden rounded-lg flex-shrink-0">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">
                              {item.product.name}
                            </h3>
                            <p className="text-gray-300 text-sm truncate">
                              {item.product.description}
                            </p>
                            <p className="text-[#00FFEF] font-semibold">
                              KES {item.product.price.toLocaleString()}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 p-0 bg-white/10 border-white/20 hover:bg-white/20"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-12 text-center font-semibold">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-8 h-8 p-0 bg-white/10 border-white/20 hover:bg-white/20"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <p className="font-semibold text-lg">
                              KES {(item.product.price * item.quantity).toLocaleString()}
                            </p>
                            <p className="text-gray-300 text-sm">
                              {item.quantity} × KES {item.product.price.toLocaleString()}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#08153A] rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                {/* Coupon Code */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                    <Button 
                      onClick={applyCoupon}
                      className="bg-[#00FFEF] text-black hover:bg-[#00FFEF]/90"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Subtotal</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `KES ${shipping.toLocaleString()}`}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tax (16% VAT)</span>
                    <span>KES {tax.toLocaleString()}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-KES {discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>KES {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button 
                  className="w-full bg-[#00FFEF] text-black hover:bg-[#00FFEF]/90 h-12 text-lg"
                  onClick={() => setIsCheckoutOpen(true)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Confirm & Pay'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                {/* Continue Shopping */}
                <Link href="/products" className="block mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/10 border-white/20 hover:bg-white/20"
                  >
                    Continue Shopping
                  </Button>
                </Link>

                {/* Shipping Info */}
                <div className="mt-6 p-4 bg-white/5 rounded-lg">
                  <h3 className="font-semibold mb-2">Shipping Information</h3>
                  <p className="text-sm text-gray-300">
                    Free shipping on orders over KES 5,000. 
                    Standard delivery takes 2-3 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Checkout Modal with Customer Details */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-xl bg-[#08153A] text-white border-white/20">
          <DialogHeader>
            <DialogTitle className="text-2xl">Customer Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            <div className="rounded-md bg-white/5 p-3 border border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-200">Create an account for faster checkout and order history.</p>
                <Button size="sm" variant="secondary" onClick={() => signIn()} className="bg-white text-black hover:bg-white/90">
                  Sign in
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="modal-name" className="block text-sm mb-2">Full Name</Label>
                <Input
                  id="modal-name"
                  placeholder="e.g. Jane Doe"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="modal-email" className="block text-sm mb-2">Email</Label>
                <Input
                  id="modal-email"
                  type="email"
                  placeholder="you@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="modal-phone" className="block text-sm mb-2">Phone Number</Label>
                <Input
                  id="modal-phone"
                  type="tel"
                  placeholder="2547XXXXXXXX or 07XXXXXXXX"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\s/g, '') })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label className="block text-sm mb-2">Place of Collection</Label>
                <Select
                  value={customer.collection}
                  onValueChange={(val) => setCustomer({ ...customer, collection: val })}
                >
                  <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b1a4a] text-white border-white/20">
                    <SelectItem value="nairobi-cbd">Nairobi CBD Pickup</SelectItem>
                    <SelectItem value="westlands">Westlands Pickup</SelectItem>
                    <SelectItem value="kilimani">Kilimani Pickup</SelectItem>
                    <SelectItem value="delivery">Delivery (enter details below)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="modal-notes" className="block text-sm mb-2">Notes (address, delivery instructions, etc.)</Label>
                <Textarea
                  id="modal-notes"
                  rows={3}
                  placeholder="Apartment, street, preferred time, etc."
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <label className="flex items-center gap-2 text-sm select-none">
                <input type="checkbox" checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />
                Save my information for next time
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20" onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
              <Button className="bg-[#00FFEF] text-black hover:bg-[#00FFEF]/90" onClick={handleCheckout} disabled={isLoading}>
                {isLoading ? 'Processing…' : 'Pay Now'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
} 