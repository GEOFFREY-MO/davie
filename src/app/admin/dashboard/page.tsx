'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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

type Stats = {
  totals: { totalSales: number; totalOrders: number; totalProducts: number; totalCustomers: number }
  changes: { salesPct: number; ordersPct: number; productsPct: number; customersPct: number }
  recentOrders: { id: string; customerName: string; total: number; status: string; date: string }[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const formatNumber = (n?: number) => (typeof n === 'number' ? n.toLocaleString() : '0')

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/admin/login')
    }
  }, [session, status, router])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/stats', { cache: 'no-store' })
        if (res.ok) setStats(await res.json())
      } catch (e) {
        console.error('Failed to load stats', e)
      }
    }
    load()
    // Subscribe to SSE for real-time stats refresh
    const evt = new EventSource('/api/updates/stream')
    evt.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data)
        if (payload?.type === 'orders:changed' || payload?.type === 'products:changed' || payload?.type === 'stats:changed') {
          load()
        }
      } catch {}
    }
    return () => evt.close()
  }, [])

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
                  DAVIETECH Admin
                </h1>
                <p className="text-gray-300 mt-1 text-xs sm:text-sm hidden sm:block">Welcome back, {session.user?.name} 👋</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 text-xs sm:text-sm">
                  <span className="hidden sm:inline">View Store</span>
                  <span className="sm:hidden">Store</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 sm:pt-20 lg:pt-24 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Grid - Mobile: 2 columns, Tablet: 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Total Sales</CardTitle>
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">KES {formatNumber(stats?.totals.totalSales)}</div>
              <p className="text-xs text-gray-600 mt-1 sm:mt-2">
                <span className="text-green-600 font-semibold">{stats ? `${Math.round(stats.changes.salesPct)}%` : '—'}</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Total Orders</CardTitle>
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{formatNumber(stats?.totals.totalOrders)}</div>
              <p className="text-xs text-gray-600 mt-1 sm:mt-2">
                <span className="text-green-600 font-semibold">{stats ? `${Math.round(stats.changes.ordersPct)}%` : '—'}</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Total Products</CardTitle>
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{formatNumber(stats?.totals.totalProducts)}</div>
              <p className="text-xs text-gray-600 mt-1 sm:mt-2">
                <span className="text-green-600 font-semibold">{stats ? `${Math.round(stats.changes.productsPct)}%` : '—'}</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Total Customers</CardTitle>
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">{formatNumber(stats?.totals.totalCustomers)}</div>
              <p className="text-xs text-gray-600 mt-1 sm:mt-2">
                <span className="text-green-600 font-semibold">{stats ? `${Math.round(stats.changes.customersPct)}%` : '—'}</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Mobile: 2 columns, Tablet: 2 columns, Desktop: 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Link href="/admin/products">
            <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-3 lg:space-x-4 space-y-2 sm:space-y-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">Add Product</h3>
                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Create new product</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/orders">
            <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-3 lg:space-x-4 space-y-2 sm:space-y-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Manage Orders</h3>
                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">View all orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/offers">
            <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-3 lg:space-x-4 space-y-2 sm:space-y-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-800 group-hover:text-purple-600 transition-colors duration-300">Manage Offers</h3>
                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Create promotions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/">
            <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-3 lg:space-x-4 space-y-2 sm:space-y-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-800 group-hover:text-gray-600 transition-colors duration-300">View Store</h3>
                    <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Go to storefront</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">Recent Orders</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-600">Latest orders from customers</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="space-y-3 sm:space-y-4">
              {(stats?.recentOrders || []).map((order) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                      <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-gray-800">{order.customerName}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Order #{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-3 lg:space-x-4">
                    <span className="font-bold text-sm sm:text-base text-gray-900">KES {order.total.toLocaleString()}</span>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500">{order.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <Link href="/admin/orders">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm">
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