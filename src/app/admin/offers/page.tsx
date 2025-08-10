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
  Tag, 
  Plus,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
  Calendar,
  Percent,
  Target,
  Users,
  TrendingUp,
  Eye,
  EyeOff,
  Save,
  X,
  Minus
} from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface Offer {
  id: string
  title: string
  description: string
  discountPercentage: number
  startDate: string
  endDate: string
  status: 'active' | 'inactive' | 'scheduled'
  targetAudience: 'all' | 'new' | 'existing' | 'vip'
  minimumPurchase?: number
  maximumDiscount?: number
  usageLimit?: number
  usedCount: number
  createdAt: string
}

interface Banner {
  id: string
  title: string
  imageUrl: string
  altText: string
  linkUrl?: string
  status: 'active' | 'inactive'
  position: 'hero' | 'sidebar' | 'footer'
  startDate: string
  endDate: string
  createdAt: string
}

export default function AdminOffersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [offers, setOffers] = useState<Offer[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false)
  const [isOfferMinimized, setIsOfferMinimized] = useState(false)
  const [isBannerMinimized, setIsBannerMinimized] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [offerFormData, setOfferFormData] = useState({
    title: '',
    description: '',
    discountPercentage: 0,
    startDate: '',
    endDate: '',
    status: 'active',
    targetAudience: 'all',
    minimumPurchase: 0,
    maximumDiscount: 0,
    usageLimit: 0
  })
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    imageUrl: '',
    altText: '',
    linkUrl: '',
    status: 'active',
    position: 'hero',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/admin/login')
    }
  }, [session, status, router])

  useEffect(() => {
    const load = async () => {
      try {
        const [offersRes, bannersRes] = await Promise.all([
          fetch('/api/offers', { cache: 'no-store' }),
          fetch('/api/banners', { cache: 'no-store' }),
        ])
        if (offersRes.ok) {
          const offersData = await offersRes.json()
          setOffers(offersData)
        }
        if (bannersRes.ok) {
          const bannersData = await bannersRes.json()
          setBanners(bannersData)
        }
      } catch (err) {
        console.error('Failed loading offers/banners', err)
      }
    }
    load()
  }, [])

  const handleAddOffer = () => {
    setEditingOffer(null)
    setOfferFormData({
      title: '',
      description: '',
      discountPercentage: 0,
      startDate: '',
      endDate: '',
      status: 'active',
      targetAudience: 'all',
      minimumPurchase: 0,
      maximumDiscount: 0,
      usageLimit: 0
    })
    setIsOfferModalOpen(true)
  }

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer)
    setOfferFormData({
      title: offer.title,
      description: offer.description,
      discountPercentage: offer.discountPercentage,
      startDate: offer.startDate,
      endDate: offer.endDate,
      status: offer.status,
      targetAudience: offer.targetAudience,
      minimumPurchase: offer.minimumPurchase || 0,
      maximumDiscount: offer.maximumDiscount || 0,
      usageLimit: offer.usageLimit || 0
    })
    setIsOfferModalOpen(true)
  }

  const handleSaveOffer = () => {
    if (!offerFormData.title || !offerFormData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const save = async () => {
      try {
        if (editingOffer) {
          const res = await fetch(`/api/offers/${editingOffer.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(offerFormData),
          })
          if (!res.ok) throw new Error('Failed to update offer')
          toast.success('Offer updated successfully!')
        } else {
          const res = await fetch('/api/offers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(offerFormData),
          })
          if (!res.ok) throw new Error('Failed to create offer')
          toast.success('Offer created successfully!')
        }
        const refreshed = await fetch('/api/offers', { cache: 'no-store' })
        if (refreshed.ok) setOffers(await refreshed.json())
        setIsOfferModalOpen(false)
        setEditingOffer(null)
      } catch (e) {
        console.error(e)
        toast.error('Save failed')
      }
    }
    void save()
  }

  const handleDeleteOffer = (offerId: string) => {
    const run = async () => {
      try {
        const res = await fetch(`/api/offers/${offerId}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Delete failed')
        const refreshed = await fetch('/api/offers', { cache: 'no-store' })
        if (refreshed.ok) setOffers(await refreshed.json())
        toast.success('Offer deleted successfully!')
      } catch (e) {
        console.error(e)
        toast.error('Failed to delete offer')
      }
    }
    void run()
  }

  const handleAddBanner = () => {
    setEditingBanner(null)
    setBannerFormData({
      title: '',
      imageUrl: '',
      altText: '',
      linkUrl: '',
      status: 'active',
      position: 'hero',
      startDate: '',
      endDate: ''
    })
    setIsBannerModalOpen(true)
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setBannerFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      altText: banner.altText,
      linkUrl: banner.linkUrl || '',
      status: banner.status,
      position: banner.position,
      startDate: banner.startDate,
      endDate: banner.endDate
    })
    setIsBannerModalOpen(true)
  }

  const handleSaveBanner = () => {
    if (!bannerFormData.title || !bannerFormData.imageUrl || !bannerFormData.altText) {
      toast.error('Please fill in all required fields')
      return
    }

    const run = async () => {
      try {
        if (editingBanner) {
          const res = await fetch(`/api/banners/${editingBanner.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bannerFormData),
          })
          if (!res.ok) throw new Error('Update failed')
          toast.success('Banner updated successfully!')
        } else {
          const res = await fetch('/api/banners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bannerFormData),
          })
          if (!res.ok) throw new Error('Create failed')
          toast.success('Banner created successfully!')
        }
        const refreshed = await fetch('/api/banners', { cache: 'no-store' })
        if (refreshed.ok) setBanners(await refreshed.json())
        setIsBannerModalOpen(false)
        setEditingBanner(null)
      } catch (e) {
        console.error(e)
        toast.error('Save failed')
      }
    }
    void run()
  }

  const handleDeleteBanner = (bannerId: string) => {
    const run = async () => {
      try {
        const res = await fetch(`/api/banners/${bannerId}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Delete failed')
        const refreshed = await fetch('/api/banners', { cache: 'no-store' })
        if (refreshed.ok) setBanners(await refreshed.json())
        toast.success('Banner deleted successfully!')
      } catch (e) {
        console.error(e)
        toast.error('Failed to delete banner')
      }
    }
    void run()
  }

  const getStatusColor = (status: string) => {
    const key = String(status).toLowerCase()
    switch (key) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTargetAudienceColor = (audience: string) => {
    const key = String(audience).toLowerCase()
    switch (key) {
      case 'all': return 'bg-purple-100 text-purple-800'
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'existing': return 'bg-green-100 text-green-800'
      case 'vip': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
                  <span className="hidden lg:inline">Offers & Promotions</span>
                  <span className="hidden sm:inline lg:hidden">Offers</span>
                  <span className="sm:hidden">Offers</span>
                </h1>
                <p className="text-gray-300 mt-1 text-xs hidden lg:block">Manage promotional offers and banners</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Promotional Offers */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Promotional Offers</h2>
                <p className="text-gray-600 mt-1">Create and manage promotional offers</p>
              </div>
              <Button
                onClick={handleAddOffer}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Offer
              </Button>
            </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6 w-full">
            {offers.map((offer) => (
              <Card key={offer.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-2 sm:p-3 lg:p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">{offer.title}</h3>
                        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs">
                          <Percent className="h-3 w-3 mr-1" />
                          {offer.discountPercentage}%
                        </Badge>
                        <Badge className={`${getStatusColor(offer.status)} text-xs`}>
                          {offer.status === 'active' ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                          {offer.status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{offer.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          <Badge className={`${getTargetAudienceColor(offer.targetAudience)} text-xs`}>
                            {offer.targetAudience}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {offer.usedCount} / {offer.usageLimit} used
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          <span className="text-gray-600">
                            Min: KES {offer.minimumPurchase?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      </div>
                    <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4">
                        <Button
                          variant="outline"
                        size="sm"
                          onClick={() => handleEditOffer(offer)}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3"
                        >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="outline"
                        size="sm"
                          onClick={() => handleDeleteOffer(offer.id)}
                        className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3"
                        >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Banner Management */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Banner Management</h2>
                <p className="text-gray-600 mt-1">Upload and manage homepage banners</p>
              </div>
              <Button
                onClick={handleAddBanner}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Banner
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6 w-full">
              {banners.map((banner) => (
                <Card key={banner.id} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-2 sm:p-3 lg:p-6">
                    <div className="flex items-start space-x-2 sm:space-x-4">
                      <div className="w-20 h-14 sm:w-24 sm:h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={banner.imageUrl}
                          alt={banner.altText}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">{banner.title}</h3>
                          <Badge className={`${getStatusColor(banner.status)} text-xs`}>
                            {banner.status === 'active' ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                            {banner.status}
                          </Badge>
                          <Badge className="bg-purple-100 text-purple-800 text-xs">
                            {banner.position}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">{banner.altText}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
                          </span>
                          {banner.linkUrl && (
                            <a 
                              href={banner.linkUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline transition-colors duration-200"
                            >
                              View Link
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBanner(banner)}
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Offer Modal */}
      <Dialog
        open={isOfferModalOpen}
        onOpenChange={(open) => {
          setIsOfferModalOpen(open)
          if (!open) setIsOfferMinimized(false)
        }}
      >
        <DialogContent className={`w-[95vw] max-w-2xl bg-white border-0 shadow-2xl overflow-y-auto mx-2 my-4 transition-all duration-300 ${isOfferMinimized ? 'max-h-16' : 'max-h-[85vh]'}`}>
          <DialogHeader className="border-b border-blue-100 pb-2 sm:pb-3 lg:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base sm:text-lg lg:text-2xl font-bold text-blue-800 truncate">
                  {editingOffer ? 'Edit Offer' : 'Add New Offer'}
                </DialogTitle>
                {!isOfferMinimized && (
                  <DialogDescription className="text-blue-600 mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
                    {editingOffer ? 'Update promotional offer details' : 'Create a new promotional offer'}
                  </DialogDescription>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-2 sm:ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOfferMinimized(!isOfferMinimized)}
                  className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                  title={isOfferMinimized ? 'Maximize' : 'Minimize'}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setIsOfferModalOpen(false); setIsOfferMinimized(false) }}
                  className="h-8 w-8 p-0 hover:bg-red-100 text-red-600 hover:text-red-800"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Offer Title *</label>
                    <Input
                      value={offerFormData.title}
                      onChange={(e) => setOfferFormData({ ...offerFormData, title: e.target.value })}
                      placeholder="Enter offer title"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Discount Percentage *</label>
                    <Input
                      type="number"
                      value={offerFormData.discountPercentage}
                      onChange={(e) => setOfferFormData({ ...offerFormData, discountPercentage: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Description *</label>
                  <Textarea
                    value={offerFormData.description}
                    onChange={(e) => setOfferFormData({ ...offerFormData, description: e.target.value })}
                    placeholder="Enter offer description"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Start Date *</label>
                    <Input
                      type="date"
                      value={offerFormData.startDate}
                      onChange={(e) => setOfferFormData({ ...offerFormData, startDate: e.target.value })}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">End Date *</label>
                    <Input
                      type="date"
                      value={offerFormData.endDate}
                      onChange={(e) => setOfferFormData({ ...offerFormData, endDate: e.target.value })}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Status</label>
                    <Select value={offerFormData.status} onValueChange={(value) => setOfferFormData({ ...offerFormData, status: value as any })}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-blue-200">
                        <SelectItem value="active" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Active</SelectItem>
                        <SelectItem value="inactive" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Inactive</SelectItem>
                        <SelectItem value="scheduled" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Target Audience</label>
                    <Select value={offerFormData.targetAudience} onValueChange={(value) => setOfferFormData({ ...offerFormData, targetAudience: value as any })}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-blue-200">
                        <SelectItem value="all" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">All Customers</SelectItem>
                        <SelectItem value="new" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">New Customers</SelectItem>
                        <SelectItem value="existing" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Existing Customers</SelectItem>
                        <SelectItem value="vip" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">VIP Customers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Minimum Purchase (KES)</label>
                    <Input
                      type="number"
                      value={offerFormData.minimumPurchase}
                      onChange={(e) => setOfferFormData({ ...offerFormData, minimumPurchase: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Maximum Discount (KES)</label>
                    <Input
                      type="number"
                      value={offerFormData.maximumDiscount}
                      onChange={(e) => setOfferFormData({ ...offerFormData, maximumDiscount: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Usage Limit</label>
                    <Input
                      type="number"
                      value={offerFormData.usageLimit}
                      onChange={(e) => setOfferFormData({ ...offerFormData, usageLimit: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                    />
                  </div>
                </div>
                <div className="flex space-x-2 pt-4 border-t border-blue-100">
                  <Button 
                    onClick={handleSaveOffer}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingOffer ? 'Update Offer' : 'Create Offer'}
                  </Button>
                </div>
              </div>
          </DialogContent>
      </Dialog>

      {/* Add/Edit Banner Modal */}
      <Dialog
        open={isBannerModalOpen}
        onOpenChange={(open) => {
          setIsBannerModalOpen(open)
          if (!open) setIsBannerMinimized(false)
        }}
      >
        <DialogContent className={`w-[95vw] max-w-2xl bg-white border-0 shadow-2xl overflow-y-auto mx-2 my-4 transition-all duration-300 ${isBannerMinimized ? 'max-h-16' : 'max-h-[85vh]'}`}>
          <DialogHeader className="border-b border-blue-100 pb-2 sm:pb-3 lg:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-base sm:text-lg lg:text-2xl font-bold text-blue-800 truncate">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </DialogTitle>
                {!isBannerMinimized && (
                  <DialogDescription className="text-blue-600 mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base">
                    {editingBanner ? 'Update banner details' : 'Upload a new banner image'}
                  </DialogDescription>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-2 sm:ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBannerMinimized(!isBannerMinimized)}
                  className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600 hover:text-blue-800"
                  title={isBannerMinimized ? 'Maximize' : 'Minimize'}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setIsBannerModalOpen(false); setIsBannerMinimized(false) }}
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
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Banner Title *</label>
                  <Input
                    value={bannerFormData.title}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                    placeholder="Enter banner title"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Image URL *</label>
                  <Input
                    value={bannerFormData.imageUrl}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, imageUrl: e.target.value })}
                    placeholder="https://example.com/banner-image.jpg"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Alt Text *</label>
                  <Input
                    value={bannerFormData.altText}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, altText: e.target.value })}
                    placeholder="Enter alt text for accessibility"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">Link URL</label>
                  <Input
                    value={bannerFormData.linkUrl}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, linkUrl: e.target.value })}
                    placeholder="https://example.com/landing-page"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700 placeholder-blue-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Status</label>
                    <Select value={bannerFormData.status} onValueChange={(value) => setBannerFormData({ ...bannerFormData, status: value as any })}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-blue-200">
                        <SelectItem value="active" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Active</SelectItem>
                        <SelectItem value="inactive" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Position</label>
                    <Select value={bannerFormData.position} onValueChange={(value) => setBannerFormData({ ...bannerFormData, position: value as any })}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-blue-200">
                        <SelectItem value="hero" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Hero</SelectItem>
                        <SelectItem value="sidebar" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Sidebar</SelectItem>
                        <SelectItem value="footer" className="text-blue-700 hover:bg-blue-50 hover:text-blue-800">Footer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-blue-700 mb-2 block">Start Date</label>
                    <Input
                      type="date"
                      value={bannerFormData.startDate}
                      onChange={(e) => setBannerFormData({ ...bannerFormData, startDate: e.target.value })}
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-blue-700 mb-2 block">End Date</label>
                  <Input
                    type="date"
                    value={bannerFormData.endDate}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, endDate: e.target.value })}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-700"
                  />
                </div>
                <div className="flex space-x-2 pt-4 border-t border-blue-100">
                  <Button 
                    onClick={handleSaveBanner}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingBanner ? 'Update Banner' : 'Upload Banner'}
                  </Button>
                </div>
              </div>
          </DialogContent>
      </Dialog>
      </div>
    </>
  )
}