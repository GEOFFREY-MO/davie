'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp,
  Plus,
  Eye,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Mock data for demonstration
const mockStats = {
  totalSales: 1250000,
  totalOrders: 156,
  totalProducts: 89,
  totalCustomers: 234
}

const mockRecentOrders = [
  {
    id: '1',
    customerName: 'John Doe',
    total: 25000,
    status: 'pending',
    date: '2024-01-15'
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    total: 15000,
    status: 'processing',
    date: '2024-01-14'
  },
  {
    id: '3',
    customerName: 'Mike Johnson',
    total: 35000,
    status: 'delivered',
    date: '2024-01-13'
  }
]

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/admin/login')
    }
  }, [session, status, router])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
      case 'processing':
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md'
      case 'delivered':
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md'
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-[#08153A] text-white shadow-lg">
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
                <h1 className="text-2xl font-bold text-white">
                  DAVIETECH Admin Dashboard
                </h1>
                <p className="text-gray-300 mt-1">Welcome back, {session.user?.name} 👋</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300">
                  View Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Sales</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">KES {mockStats.totalSales.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-2">
                <span className="text-green-600 font-semibold">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Orders</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{mockStats.totalOrders}</div>
              <p className="text-xs text-gray-600 mt-2">
                <span className="text-green-600 font-semibold">+8%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Products</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{mockStats.totalProducts}</div>
              <p className="text-xs text-gray-600 mt-2">
                <span className="text-green-600 font-semibold">+5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Customers</CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{mockStats.totalCustomers}</div>
              <p className="text-xs text-gray-600 mt-2">
                <span className="text-green-600 font-semibold">+15%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/products">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">Add Product</h3>
                    <p className="text-sm text-gray-600">Create new product</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Manage Orders</h3>
                    <p className="text-sm text-gray-600">View all orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/offers">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">Manage Offers</h3>
                    <p className="text-sm text-gray-600">Create promotions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-gray-600 transition-colors duration-300">View Store</h3>
                    <p className="text-sm text-gray-600">Go to storefront</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-xl font-bold text-gray-800">Recent Orders</CardTitle>
            <CardDescription className="text-gray-600">Latest orders from customers</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {mockRecentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{order.customerName}</h4>
                      <p className="text-sm text-gray-600">Order #{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-gray-900">KES {order.total.toLocaleString()}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/admin/orders">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  View All Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 