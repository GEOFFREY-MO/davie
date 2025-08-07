'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tag, Plus, Image as ImageIcon } from 'lucide-react'

export default function AdminOffersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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
    router.push('/admin/login')
    return null
  }

  const mockOffers = [
    {
      id: '1',
      title: 'Summer Sale',
      description: 'Get up to 50% off on selected items',
      discount: '50%',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: '2',
      title: 'New Year Special',
      description: 'Welcome 2024 with amazing deals',
      discount: '30%',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-01-15'
    },
    {
      id: '3',
      title: 'Tech Week',
      description: 'Exclusive deals on electronics',
      discount: '25%',
      status: 'inactive',
      startDate: '2024-02-01',
      endDate: '2024-02-07'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Offers & Promotions</h1>
              <p className="text-primary-foreground/80">Manage promotional offers and banners</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => router.push('/admin/dashboard')}>
                Back to Dashboard
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Offer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Offers Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span>Promotional Offers</span>
              </CardTitle>
              <CardDescription>
                Create and manage promotional offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockOffers.map((offer) => (
                  <div key={offer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Tag className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{offer.title}</h4>
                        <p className="text-sm text-muted-foreground">{offer.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary">{offer.discount}</Badge>
                      <Badge className={getStatusColor(offer.status)}>
                        {offer.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Banner Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Banner Management</span>
              </CardTitle>
              <CardDescription>
                Upload and manage homepage banners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-medium mb-2">Upload Banner</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop banner images here or click to browse
                  </p>
                  <Button variant="outline">
                    Choose Files
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Current Banners</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gray-200 rounded"></div>
                        <span className="text-sm">Hero Banner 1</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gray-200 rounded"></div>
                        <span className="text-sm">Hero Banner 2</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 