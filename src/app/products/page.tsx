'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductCard } from '@/components/product/product-card'
import { PromotionalOffers } from '@/components/promotional/promotional-offers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Grid, List, Search, Filter } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useCart } from '@/components/providers/cart-provider'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  featured: boolean
  bestSeller: boolean
}

export default function ProductsPage() {
  const { addItem } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortOrder, setSortOrder] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const applyFilters = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
          setFilteredProducts(data)
        } else {
          console.error('Failed to fetch products')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  // Initialize search from URL (e.g., /products?search=phone)
  useEffect(() => {
    const q = searchParams?.get('search') || ''
    if (q) {
      setSearchTerm(q)
    }
  }, [searchParams])

  useEffect(() => {
    applyFilters()
  }, [products, searchTerm, selectedCategory, sortOrder])

  const addToCart = (product: Product) => {
    addItem(product, 1)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16">
        {/* Promotional Offers Section */}
        <div className="bg-gradient-to-r from-[#00008B] to-[#00008B]/90 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Special Offers Available
              </h2>
              <p className="text-white/80">
                Take advantage of these amazing deals while shopping!
              </p>
            </div>
            <PromotionalOffers />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Filters and Search */}
          <div className="bg-[#00008B] rounded-xl p-6 mb-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') applyFilters() }}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#00FFEF] focus:ring-[#00FFEF]"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#00FFEF] focus:ring-[#00FFEF]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="all" className="text-black hover:bg-gray-100">All Categories</SelectItem>
                  <SelectItem value="Electronics" className="text-black hover:bg-gray-100">Electronics</SelectItem>
                  <SelectItem value="Fashion" className="text-black hover:bg-gray-100">Fashion</SelectItem>
                  <SelectItem value="Food & Beverages" className="text-black hover:bg-gray-100">Food & Beverages</SelectItem>
                  <SelectItem value="Sports & Fitness" className="text-black hover:bg-gray-100">Sports & Fitness</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-[#00FFEF] focus:ring-[#00FFEF]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="name" className="text-black hover:bg-gray-100">Sort by Name</SelectItem>
                  <SelectItem value="price-low" className="text-black hover:bg-gray-100">Price: Low to High</SelectItem>
                  <SelectItem value="price-high" className="text-black hover:bg-gray-100">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' 
                    ? 'bg-[#00FFEF] hover:bg-[#00FFEF]/90 text-black' 
                    : 'border-white/20 text-white hover:bg-white/10'
                  }
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' 
                    ? 'bg-[#00FFEF] hover:bg-[#00FFEF]/90 text-black' 
                    : 'border-white/20 text-white hover:bg-white/10'
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={applyFilters}
                  className="bg-[#00FFEF] hover:bg-[#00FFEF]/90 text-black"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-700 font-medium">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'
              : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  compact={viewMode === 'grid'}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No products found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="bg-[#00008B] hover:bg-[#00008B]/90 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
} 