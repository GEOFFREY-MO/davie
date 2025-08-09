'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Package, 
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

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
  createdAt: string
  updatedAt: string
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    stock: 0,
    featured: false,
    bestSeller: false
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/admin/login')
    }
  }, [session, status, router])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
      } else {
        toast.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Error fetching products')
    }
  }

  useEffect(() => {
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

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  const handleAddProduct = () => {
    setEditingProduct(null)
    resetForm()
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      featured: product.featured,
      bestSeller: product.bestSeller
    })
    setIsModalOpen(true)
  }

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.image) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const savedProduct = await response.json()
        
        if (editingProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? savedProduct : p))
          toast.success('Product updated successfully!')
        } else {
          setProducts([...products, savedProduct])
          toast.success('Product created successfully!')
        }
        
        setIsModalOpen(false)
        setEditingProduct(null)
        resetForm()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Error saving product')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
        toast.success('Product deleted successfully!')
      } else {
        toast.error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Error deleting product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      stock: 0,
      featured: false,
      bestSeller: false
    })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header - Mobile Optimized */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#08153A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Logo */}
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/davietech-logo.jpg"
                  alt="DAVIETECH Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h1 className="text-sm sm:text-xl lg:text-2xl font-bold text-white">
                  <span className="hidden sm:inline">Enhanced Product Management</span>
                  <span className="sm:hidden">Products</span>
                </h1>
                <p className="text-gray-300 mt-1 text-xs sm:text-sm hidden sm:block">Full CRUD operations for products</p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/admin/dashboard')}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingProduct(null)
                    resetForm()
                  }}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-xs sm:text-sm ml-2"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-blue-100 pb-3 sm:pb-4">
                  <DialogTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-800">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                  <DialogDescription className="text-blue-600 mt-2 text-sm sm:text-base">
                    {editingProduct ? 'Update product information' : 'Create a new product listing'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 sm:space-y-6 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm font-semibold text-blue-700 mb-2 block">Product Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter product name"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-blue-700 mb-2 block">Category *</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700">
                          <SelectValue placeholder="Select category" className="text-blue-600" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-blue-200">
                          <SelectItem value="Electronics" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Electronics</SelectItem>
                          <SelectItem value="Fashion" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Fashion</SelectItem>
                          <SelectItem value="Food & Beverages" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Food & Beverages</SelectItem>
                          <SelectItem value="Sports & Fitness" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Sports & Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Description *</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter product description"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm font-semibold text-blue-700 mb-2 block">Price (KES) *</label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-blue-700 mb-2 block">Stock Quantity</label>
                      <Input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-blue-700 mb-2 block">Image URL *</label>
                      <Input
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-semibold text-blue-700">Featured Product</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.bestSeller}
                        onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                        className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-semibold text-blue-700">Best Seller</span>
                    </label>
                  </div>
                  <div className="flex space-x-2 pt-4 border-t border-blue-100">
                    <Button 
                      onClick={handleSaveProduct}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="pt-16 sm:pt-20 lg:pt-24 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filters */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-xl">
          <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {/* Mobile-first filters layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <div className="relative col-span-2 sm:col-span-1">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-3 w-3 sm:h-4 sm:w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 border-blue-200 bg-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm text-blue-700 placeholder-blue-400 text-xs sm:text-sm"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-blue-200 bg-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm cursor-pointer text-blue-700 text-xs sm:text-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-200 shadow-lg">
                    <SelectItem value="all" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">All Categories</SelectItem>
                    <SelectItem value="Electronics" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Electronics</SelectItem>
                    <SelectItem value="Fashion" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Fashion</SelectItem>
                    <SelectItem value="Food & Beverages" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Food & Beverages</SelectItem>
                    <SelectItem value="Sports & Fitness" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Sports & Fitness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs sm:text-sm text-blue-700 flex items-center bg-white px-2 sm:px-3 py-2 rounded-lg shadow-sm border border-blue-100 cursor-pointer">
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                <span className="font-medium text-blue-800">{filteredProducts.length}</span>
                <span className="mx-1 text-blue-600 hidden sm:inline">of</span>
                <span className="mx-1 text-blue-600 sm:hidden">/</span>
                <span className="font-medium text-blue-800">{products.length}</span>
                <span className="ml-1 text-blue-600 hidden sm:inline">products</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`cursor-pointer ${viewMode === 'grid'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md'
                    : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`cursor-pointer ${viewMode === 'list'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md'
                    : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List - Mobile: 2 columns */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="border-b border-gray-100 p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                    <CardTitle className="text-sm sm:text-base lg:text-lg text-gray-800 truncate">{product.name}</CardTitle>
                    <div className="flex flex-wrap gap-1">
                      {product.featured && <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">Featured</Badge>}
                      {product.bestSeller && <Badge className="bg-green-100 text-green-800 text-xs">Best Seller</Badge>}
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 text-xs sm:text-sm">{product.category}</CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-1 sm:space-y-0">
                        <span className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">KES {product.price.toLocaleString()}</span>
                        <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1 sm:space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 cursor-pointer text-xs sm:text-sm"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                        <span className="sm:hidden">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300 cursor-pointer px-2 sm:px-3"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-md mx-auto sm:mx-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">{product.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                          <span className="font-bold text-sm sm:text-base text-gray-900">KES {product.price.toLocaleString()}</span>
                          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Stock: {product.stock}</span>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-1 mt-1">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                        {product.featured && <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">Featured</Badge>}
                        {product.bestSeller && <Badge className="text-xs bg-green-100 text-green-800">Best Seller</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 cursor-pointer text-xs sm:text-sm"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <Button
                  onClick={() => {
                    setEditingProduct(null)
                    resetForm()
                    setIsModalOpen(true)
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 