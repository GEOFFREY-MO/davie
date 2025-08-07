'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react'
import { Product } from '@/types'
import { toast } from 'sonner'

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    price: 15000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    stock: 25,
    featured: true,
    bestSeller: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking with heart rate monitor and GPS.',
    price: 25000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    stock: 15,
    featured: true,
    bestSeller: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Premium Coffee Maker',
    description: 'Automatic coffee maker with programmable settings and thermal carafe.',
    price: 12000,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    stock: 8,
    featured: false,
    bestSeller: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable cotton t-shirt in various colors.',
    price: 2500,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
    stock: 50,
    featured: false,
    bestSeller: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound and 20-hour battery.',
    price: 8000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    stock: 30,
    featured: true,
    bestSeller: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle that keeps drinks cold for 24 hours.',
    price: 3500,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    stock: 100,
    featured: false,
    bestSeller: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Wireless Gaming Mouse',
    description: 'High-precision gaming mouse with customizable RGB lighting.',
    price: 12000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    stock: 20,
    featured: false,
    bestSeller: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat made from eco-friendly materials.',
    price: 4500,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    stock: 35,
    featured: false,
    bestSeller: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const categories = ['All', 'Electronics', 'Fashion', 'Home & Kitchen', 'Sports']
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const productsPerPage = 8

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart!`, {
      description: `Price: KES ${product.price.toLocaleString()}`,
    })
  }

  // Filter and sort products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort products
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [products, searchTerm, selectedCategory, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-[#00008B] text-white pt-16">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Products</h1>
          <p className="text-gray-300">
            Discover our complete collection of premium products
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#08153A] rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="bg-white/10 border-white/20 hover:bg-white/20"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="bg-white/10 border-white/20 hover:bg-white/20"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-300">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        {currentProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">No products found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
                setSortBy('newest')
              }}
              className="mt-4 bg-[#00FFEF] text-black hover:bg-[#00FFEF]/90"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white/10 border-white/20 hover:bg-white/20"
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page 
                    ? "bg-[#00FFEF] text-black hover:bg-[#00FFEF]/90"
                    : "bg-white/10 border-white/20 hover:bg-white/20"
                  }
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-white/10 border-white/20 hover:bg-white/20"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
} 