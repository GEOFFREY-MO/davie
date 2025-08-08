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
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Eye,
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
    price: '',
    category: '',
    image: '',
    stock: '',
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
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation.',
        price: 15000,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        stock: 25,
        featured: true,
        bestSeller: true,
      },
      {
        id: '2',
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking with heart rate monitoring.',
        price: 25000,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        stock: 15,
        featured: true,
        bestSeller: true,
      },
      {
        id: '3',
        name: 'Designer Leather Bag',
        description: 'Handcrafted leather bag with premium materials.',
        price: 8500,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
        stock: 30,
        featured: true,
        bestSeller: false,
      },
    ]
    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
  }, [])

  useEffect(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory])

  const handleAddProduct = () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      stock: parseInt(formData.stock) || 0,
      featured: formData.featured,
      bestSeller: formData.bestSeller,
    }

    setProducts([...products, newProduct])
    setIsModalOpen(false)
    resetForm()
    toast.success('Product added successfully!')
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
      featured: product.featured,
      bestSeller: product.bestSeller
    })
    setIsModalOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return

    const updatedProducts = products.map(product =>
      product.id === editingProduct.id
        ? {
            ...product,
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            image: formData.image,
            stock: parseInt(formData.stock) || 0,
            featured: formData.featured,
            bestSeller: formData.bestSeller,
          }
        : product
    )

    setProducts(updatedProducts)
    setIsModalOpen(false)
    setEditingProduct(null)
    resetForm()
    toast.success('Product updated successfully!')
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== productId))
      toast.success('Product deleted successfully!')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: '',
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
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#08153A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/davietech-logo.jpg"
                  alt="DAVIETECH Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Enhanced Product Management</h1>
                <p className="text-gray-300 mt-1">Full CRUD operations for products</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/admin/dashboard')}
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Back to Dashboard
              </Button>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                                     <Button 
                     onClick={() => {
                       setEditingProduct(null)
                       resetForm()
                     }}
                     className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Add Product
                   </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProduct ? 'Update product information' : 'Create a new product listing'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Product Name *</label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category *</label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Fashion">Fashion</SelectItem>
                            <SelectItem value="Food & Beverages">Food & Beverages</SelectItem>
                            <SelectItem value="Sports & Fitness">Sports & Fitness</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter product description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Price (KES) *</label>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Stock Quantity</label>
                        <Input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Image URL</label>
                        <Input
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        />
                        <label htmlFor="featured" className="text-sm">Featured Product</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="bestSeller"
                          checked={formData.bestSeller}
                          onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                        />
                        <label htmlFor="bestSeller" className="text-sm">Best Seller</label>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button 
                        onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                        className="flex-1"
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
      </div>

      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-xl">
          <CardHeader className="border-b border-blue-100 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
                                 <Input
                   placeholder="Search products..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10 border-blue-200 bg-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm text-blue-700 placeholder-blue-400"
                 />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                 <SelectTrigger className="border-blue-200 bg-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm cursor-pointer text-blue-700">
                   <SelectValue placeholder="Select category" />
                 </SelectTrigger>
                                 <SelectContent className="bg-white border-blue-200 shadow-lg">
                   <SelectItem value="all" className="hover:bg-green-100 text-blue-700 hover:text-green-800 cursor-pointer">All Categories</SelectItem>
                   <SelectItem value="Electronics" className="hover:bg-green-100 text-blue-700 hover:text-green-800 cursor-pointer">Electronics</SelectItem>
                   <SelectItem value="Fashion" className="hover:bg-green-100 text-blue-700 hover:text-green-800 cursor-pointer">Fashion</SelectItem>
                   <SelectItem value="Food & Beverages" className="hover:bg-green-100 text-blue-700 hover:text-green-800 cursor-pointer">Food & Beverages</SelectItem>
                   <SelectItem value="Sports & Fitness" className="hover:bg-green-100 text-blue-700 hover:text-green-800 cursor-pointer">Sports & Fitness</SelectItem>
                 </SelectContent>
              </Select>
                             <div className="text-sm text-blue-700 flex items-center bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-100 cursor-pointer">
                 <Filter className="h-4 w-4 mr-2 text-blue-500" />
                 <span className="font-medium text-blue-800">{filteredProducts.length}</span>
                 <span className="mx-1 text-blue-600">of</span>
                 <span className="font-medium text-blue-800">{products.length}</span>
                 <span className="ml-1 text-blue-600">products</span>
               </div>
              <div className="flex items-center space-x-2">
                                 <Button
                   variant={viewMode === 'grid' ? 'default' : 'outline'}
                   size="sm"
                   onClick={() => setViewMode('grid')}
                   className={`cursor-pointer ${viewMode === 'grid' 
                     ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-md' 
                     : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm'
                   }`}
                 >
                   <Grid className="h-4 w-4" />
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
                   <List className="h-4 w-4" />
                 </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-800">{product.name}</CardTitle>
                    <div className="flex space-x-1">
                      {product.featured && <Badge variant="secondary" className="bg-purple-100 text-purple-800">Featured</Badge>}
                      {product.bestSeller && <Badge className="bg-green-100 text-green-800">Best Seller</Badge>}
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">{product.category}</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 text-lg">KES {product.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                                             <Button 
                         variant="outline" 
                         size="sm" 
                         onClick={() => handleEditProduct(product)} 
                         className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 cursor-pointer"
                       >
                         <Edit className="h-4 w-4 mr-2" />
                         Edit
                       </Button>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => handleDeleteProduct(product.id)}
                         className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300 cursor-pointer"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.category}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">KES {product.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Stock: {product.stock}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                        {product.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        {product.featured && <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">Featured</Badge>}
                        {product.bestSeller && <Badge className="text-xs bg-green-100 text-green-800">Best Seller</Badge>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                                             <Button 
                         variant="outline" 
                         size="sm" 
                         onClick={() => handleEditProduct(product)}
                         className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 cursor-pointer"
                       >
                         <Edit className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => handleDeleteProduct(product.id)}
                         className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300 cursor-pointer"
                       >
                         <Trash2 className="h-4 w-4" />
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