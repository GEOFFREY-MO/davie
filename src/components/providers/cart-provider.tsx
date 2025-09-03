'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Product } from '@/types'

type CartItem = {
  product: Product
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  setItemQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'davie.cart.v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {}
    setIsHydrated(true)
  }, [])

  // Persist to localStorage whenever items change after hydration
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, isHydrated])

  const addItem = (product: Product, quantity: number = 1) => {
    setItems(prev => {
      const index = prev.findIndex(i => i.product.id === product.id)
      if (index !== -1) {
        const updated = [...prev]
        const current = updated[index]
        const desired = current.quantity + quantity
        const maxQty = typeof product.stock === 'number' && product.stock > 0 ? product.stock : desired
        updated[index] = { ...current, quantity: Math.max(1, Math.min(desired, maxQty)) }
        return updated
      }
      const initialQty = Math.max(1, quantity)
      const maxQty = typeof product.stock === 'number' && product.stock > 0 ? product.stock : initialQty
      return [...prev, { product, quantity: Math.min(initialQty, maxQty) }]
    })
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }

  const setItemQuantity = (productId: string, quantity: number) => {
    setItems(prev => {
      if (quantity <= 0) return prev.filter(i => i.product.id !== productId)
      return prev.map(i => {
        if (i.product.id !== productId) return i
        const maxQty = typeof i.product.stock === 'number' && i.product.stock > 0 ? i.product.stock : quantity
        return { ...i, quantity: Math.max(1, Math.min(quantity, maxQty)) }
      })
    })
  }

  const clear = () => setItems([])

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const value: CartContextValue = {
    items,
    itemCount,
    addItem,
    removeItem,
    setItemQuantity,
    clear,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}


