'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Package, 
  Search, 
  Filter,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  ShoppingCart,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Minus,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: 'mpesa' | 'card' | 'cash'
  paymentStatus: 'pending' | 'paid' | 'failed'
  orderDate: string
  estimatedDelivery?: string
  trackingNumber?: string
  notes?: string
}

export default function AdminOrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all')
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'customer'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewMinimized, setIsViewMinimized] = useState(false)
  const [isEditMinimized, setIsEditMinimized] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [editFormData, setEditFormData] = useState({
    status: '',
    trackingNumber: '',
    notes: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/admin/login')
    }
  }, [session, status, router])

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
          setFilteredOrders(data)
        }
      } catch (e) {
        console.error('Failed to load orders', e)
      }
    }
    loadOrders()
  }, [])

  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm)
      )
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus)
    }

    if (selectedPaymentStatus !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === selectedPaymentStatus)
    }

    // Sort orders
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.orderDate).getTime()
          bValue = new Date(b.orderDate).getTime()
          break
        case 'total':
          aValue = a.total
          bValue = b.total
          break
        case 'customer':
          aValue = a.customerName.toLowerCase()
          bValue = b.customerName.toLowerCase()
          break
        default:
          aValue = new Date(a.orderDate).getTime()
          bValue = new Date(b.orderDate).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, selectedStatus, selectedPaymentStatus, sortBy, sortOrder])

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsViewModalOpen(true)
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setEditFormData({
      status: order.status,
      trackingNumber: order.trackingNumber || '',
      notes: order.notes || ''
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateOrder = () => {
    if (!editingOrder) return
    const run = async () => {
      try {
        const res = await fetch(`/api/orders/${editingOrder.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editFormData),
        })
        if (!res.ok) throw new Error('Update failed')
        const refreshed = await fetch('/api/orders', { cache: 'no-store' })
        if (refreshed.ok) setOrders(await refreshed.json())
        setIsEditModalOpen(false)
        setEditingOrder(null)
        toast.success('Order updated successfully!')
      } catch (e) {
        console.error(e)
        toast.error('Failed to update order')
      }
    }
    void run()
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    <>
      {/* Fixed Header - Mobile Optimized */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#08153A] text-white shadow-lg">
        <div className="w-full px-2 sm:px-4 lg:px-8 py-2 sm:py-3 lg:py-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-1 sm:space-x-2 flex-1 min-w-0">
              {/* Logo */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/davietech-logo.jpg"
                  alt="DAVIETECH Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xs sm:text-sm lg:text-xl font-bold text-white truncate">
                  <span className="hidden lg:inline">Order Management</span>
                  <span className="hidden sm:inline lg:hidden">Orders</span>
                  <span className="sm:hidden">Orders</span>
                </h1>
                <p className="text-gray-300 mt-1 text-xs hidden lg:block">Manage customer orders and deliveries</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                onClick={() => router.push('/admin/dashboard')}
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-xs px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Separate Container */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden overflow-y-auto w-full pt-16 sm:pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-8 sm:pb-12">
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
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              <div className="relative col-span-2 sm:col-span-1">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-3 w-3 sm:h-4 sm:w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 sm:pl-10 border-blue-200 bg-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm text-blue-700 placeholder-blue-400 text-xs sm:text-sm"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="border-blue-200 bg-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm cursor-pointer text-blue-700 text-xs sm:text-sm">
                    <SelectValue placeholder="Order Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-200 shadow-lg">
                    <SelectItem value="all" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">All Statuses</SelectItem>
                    <SelectItem value="pending" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Pending</SelectItem>
                    <SelectItem value="processing" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Processing</SelectItem>
                    <SelectItem value="shipped" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Shipped</SelectItem>
                    <SelectItem value="delivered" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Delivered</SelectItem>
                    <SelectItem value="cancelled" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                  <SelectTrigger className="border-blue-200 bg-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm cursor-pointer text-blue-700 text-xs sm:text-sm">
                    <SelectValue placeholder="Payment Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-200 shadow-lg">
                    <SelectItem value="all" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">All Payments</SelectItem>
                    <SelectItem value="pending" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Pending</SelectItem>
                    <SelectItem value="paid" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Paid</SelectItem>
                    <SelectItem value="failed" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Select value={sortBy} onValueChange={(value: 'date' | 'total' | 'customer') => setSortBy(value)}>
                  <SelectTrigger className="border-blue-200 bg-white focus:border-indigo-500 focus:ring-indigo-500 shadow-sm cursor-pointer text-blue-700 text-xs sm:text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-blue-200 shadow-lg">
                    <SelectItem value="date" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Order Date</SelectItem>
                    <SelectItem value="total" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Total Amount</SelectItem>
                    <SelectItem value="customer" className="hover:bg-green-100 text-blue-700 hover:text-green-700 cursor-pointer text-xs sm:text-sm">Customer Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm cursor-pointer"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-3 w-3 sm:h-4 sm:w-4" /> : <SortDesc className="h-3 w-3 sm:h-4 sm:w-4" />}
                </Button>
              </div>
              <div className="text-xs sm:text-sm text-blue-700 flex items-center bg-white px-2 sm:px-3 py-2 rounded-lg shadow-sm border border-blue-100 cursor-pointer">
                <Package className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                <span className="font-medium text-blue-800">{filteredOrders.length}</span>
                <span className="mx-1 text-blue-600 hidden sm:inline">of</span>
                <span className="mx-1 text-blue-600 sm:hidden">/</span>
                <span className="font-medium text-blue-800">{orders.length}</span>
                <span className="ml-1 text-blue-600 hidden sm:inline">orders</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List - Mobile Responsive 2-Column Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6 w-full">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-2 sm:p-3 lg:p-6">
                {/* Mobile 2-column compact layout / Desktop full layout */}
                <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-4">
                  <div className="flex items-start space-x-2 lg:space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 lg:h-6 lg:w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="space-y-1 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
                        <div className="space-y-1">
                          <h4 className="text-xs lg:text-lg font-semibold text-gray-900 truncate">{order.id}</h4>
                          <p className="text-xs text-gray-600 flex items-center lg:mt-1">
                            <User className="h-3 w-3 mr-1" />
                            <span className="truncate">{order.customerName}</span>
                          </p>
                          <p className="text-xs text-gray-600 flex items-center lg:hidden">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(order.orderDate)}
                          </p>
                          <p className="hidden lg:flex text-sm text-gray-600 items-center mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                        <div className="lg:text-right">
                          <p className="text-sm lg:text-lg font-bold text-gray-900 flex items-center">
                            <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                            KES {order.total.toLocaleString()}
                          </p>
                          <div className="flex flex-wrap items-center gap-1 lg:space-x-2 mt-1 lg:mt-2">
                            <Badge className={`${getStatusColor(order.status)} text-xs`}>
                              <span className="lg:hidden">{getStatusIcon(order.status)}</span>
                              <span className="hidden lg:inline">{getStatusIcon(order.status)}</span>
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                            <Badge className={`${getPaymentStatusColor(order.paymentStatus)} text-xs`}>
                              <span className="capitalize">{order.paymentStatus}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {/* Desktop-only details */}
                      <div className="hidden lg:flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {order.customerPhone}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="truncate">{order.shippingAddress}</span>
                        </span>
                        <span className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          {order.paymentMethod.toUpperCase()}
                        </span>
                        <span className="flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {/* Mobile-only compact details */}
                      <div className="flex items-center text-xs text-gray-600 mt-1 lg:hidden">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                        <span className="mx-2">•</span>
                        <span className="truncate">{order.paymentMethod.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center justify-center lg:justify-start space-x-1 lg:space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 cursor-pointer text-xs lg:text-sm px-2 lg:px-3"
                    >
                      <Eye className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="hidden lg:inline ml-2">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOrder(order)}
                      className="border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-300 cursor-pointer text-xs lg:text-sm px-2 lg:px-3"
                    >
                      <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="hidden lg:inline ml-2">Edit</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-800">No orders found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedStatus !== 'all' || selectedPaymentStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No orders have been placed yet'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Order Modal */}
      <Dialog
        open={isViewModalOpen}
        onOpenChange={(open) => {
          setIsViewModalOpen(open)
          if (!open) setIsViewMinimized(false)
        }}
      >
        <DialogContent className={`w-[95vw] max-w-3xl bg-white border-0 shadow-2xl overflow-y-auto mx-2 my-4 transition-all duration-300 ${isViewMinimized ? 'max-h-16' : 'max-h-[85vh]'}`}>
          <DialogHeader className="border-b border-blue-100 pb-2 sm:pb-3 lg:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base sm:text-lg lg:text-2xl font-bold text-blue-800 truncate">
                  Order Details - {selectedOrder?.id}
                </DialogTitle>
                {!isViewMinimized && (
                  <DialogDescription className="text-blue-600 mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
                    Complete order information and customer details
                  </DialogDescription>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-2 sm:ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsViewMinimized(!isViewMinimized)}
                  className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                  title={isViewMinimized ? 'Maximize' : 'Minimize'}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setIsViewModalOpen(false); setIsViewMinimized(false) }}
                  className="h-8 w-8 p-0 hover:bg-red-100 text-red-600 hover:text-red-800"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* Order Summary */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-blue-800">Order Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1 capitalize">{selectedOrder.status}</span>
                    </Badge>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-green-800">Payment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                      <span className="capitalize">{selectedOrder.paymentStatus}</span>
                    </Badge>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-purple-800">Total Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-bold text-purple-800">KES {selectedOrder.total.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Information */}
              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-gray-900">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-gray-900">{selectedOrder.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Phone</p>
                      <p className="text-gray-900">{selectedOrder.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payment Method</p>
                      <p className="text-gray-900 capitalize">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Shipping Address</p>
                    <p className="text-gray-900">{selectedOrder.shippingAddress}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">KES {item.price.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Total: KES {item.total.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-800">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-semibold text-gray-900">KES {selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Shipping:</span>
                      <span className="font-semibold text-gray-900">KES {selectedOrder.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tax:</span>
                      <span className="font-semibold text-gray-900">KES {selectedOrder.tax.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-blue-800">Total:</span>
                        <span className="text-lg font-bold text-blue-800">KES {selectedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              {(selectedOrder.trackingNumber || selectedOrder.estimatedDelivery || selectedOrder.notes) && (
                <Card className="bg-gray-50 border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedOrder.trackingNumber && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Tracking Number</p>
                        <p className="text-gray-900">{selectedOrder.trackingNumber}</p>
                      </div>
                    )}
                    {selectedOrder.estimatedDelivery && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Estimated Delivery</p>
                        <p className="text-gray-900">{selectedOrder.estimatedDelivery}</p>
                      </div>
                    )}
                    {selectedOrder.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Notes</p>
                        <p className="text-gray-900">{selectedOrder.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open)
          if (!open) setIsEditMinimized(false)
        }}
      >
        <DialogContent className={`w-[95vw] max-w-2xl bg-white border-0 shadow-2xl overflow-y-auto mx-2 my-4 transition-all duration-300 ${isEditMinimized ? 'max-h-16' : 'max-h-[85vh]'}`}>
          <DialogHeader className="border-b border-blue-100 pb-2 sm:pb-3 lg:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base sm:text-lg lg:text-2xl font-bold text-blue-800 truncate">
                  Edit Order - {editingOrder?.id}
                </DialogTitle>
                {!isEditMinimized && (
                  <DialogDescription className="text-blue-600 mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
                    Update order status and tracking information
                  </DialogDescription>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-2 sm:ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditMinimized(!isEditMinimized)}
                  className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                  title={isEditMinimized ? 'Maximize' : 'Minimize'}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setIsEditModalOpen(false); setIsEditMinimized(false) }}
                  className="h-8 w-8 p-0 hover:bg-red-100 text-red-600 hover:text-red-800"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div>
              <label className="text-sm font-semibold text-blue-700 mb-2 block">Order Status *</label>
              <Select value={editFormData.status} onValueChange={(value) => setEditFormData({ ...editFormData, status: value })}>
                <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-200">
                  <SelectItem value="pending" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Pending</SelectItem>
                  <SelectItem value="processing" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Processing</SelectItem>
                  <SelectItem value="shipped" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Shipped</SelectItem>
                  <SelectItem value="delivered" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Delivered</SelectItem>
                  <SelectItem value="cancelled" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold text-blue-700 mb-2 block">Tracking Number</label>
              <Input
                value={editFormData.trackingNumber}
                onChange={(e) => setEditFormData({ ...editFormData, trackingNumber: e.target.value })}
                placeholder="Enter tracking number"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-blue-700 mb-2 block">Notes</label>
              <Input
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                placeholder="Add order notes"
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
              />
            </div>
            <div className="flex space-x-2 pt-4 border-t border-blue-100">
              <Button 
                onClick={handleUpdateOrder}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Update Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  )
} 