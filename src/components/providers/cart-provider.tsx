'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Product } from '@/types'
import { toast } from 'sonner'

type CartLineItem = {
  product: Product
  quantity: number
}

type CartContextValue = {
  items: CartLineItem[]
  itemCount: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  setItemQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'davie.cart.v1'

function loadCart(): CartLineItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLineItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCart(items: CartLineItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore storage errors
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([])

  // hydrate from localStorage once mounted
  useEffect(() => {
    setItems(loadCart())
  }, [])

  // persist on changes
  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = (product: Product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(line => line.product.id === product.id)
      if (existing) {
        const maxQty = product.stock ?? Infinity
        const newQty = Math.min(existing.quantity + quantity, maxQty)
        if (newQty === existing.quantity) {
          toast.info('Maximum available stock reached')
          return prev
        }
        toast.success('Added to cart')
        return prev.map(line =>
          line.product.id === product.id ? { ...line, quantity: newQty } : line
        )
      }
      toast.success('Added to cart')
      return [...prev, { product, quantity: Math.max(1, Math.min(quantity, product.stock ?? quantity)) }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(line => line.product.id !== productId))
  }

  const setItemQuantity = (productId: string, quantity: number) => {
    setItems(prev =>
      prev
        .map(line =>
          line.product.id === productId
            ? { ...line, quantity: Math.max(1, Math.min(quantity, line.product.stock ?? quantity)) }
            : line
        )
        .filter(line => line.quantity > 0)
    )
  }

  const clear = () => setItems([])

  const itemCount = useMemo(() => items.reduce((sum, l) => sum + l.quantity, 0), [items])

  const value = useMemo<CartContextValue>(
    () => ({ items, itemCount, addItem, removeItem, setItemQuantity, clear }),
    [items, itemCount]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}





