import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@davietech.com' },
    update: {},
    create: {
      email: 'admin@davietech.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  console.log('Admin user created:', adminUser.email)

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod-1' },
      update: {},
      create: {
        id: 'prod-1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.',
        price: 15000,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        stock: 50,
        featured: true,
        bestSeller: true
      }
    }),
    prisma.product.upsert({
      where: { id: 'prod-2' },
      update: {},
      create: {
        id: 'prod-2',
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone connectivity.',
        price: 25000,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        stock: 30,
        featured: true,
        bestSeller: false
      }
    }),
    prisma.product.upsert({
      where: { id: 'prod-3' },
      update: {},
      create: {
        id: 'prod-3',
        name: 'Designer Leather Bag',
        description: 'Premium leather handbag with elegant design and spacious interior. Perfect for everyday use.',
        price: 8500,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
        stock: 25,
        featured: false,
        bestSeller: true
      }
    }),
    prisma.product.upsert({
      where: { id: 'prod-4' },
      update: {},
      create: {
        id: 'prod-4',
        name: 'Organic Coffee Beans',
        description: 'Premium organic coffee beans sourced from high-altitude farms. Rich flavor and smooth finish.',
        price: 1200,
        category: 'Food & Beverages',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop',
        stock: 100,
        featured: false,
        bestSeller: false
      }
    }),
    prisma.product.upsert({
      where: { id: 'prod-5' },
      update: {},
      create: {
        id: 'prod-5',
        name: 'Professional Yoga Mat',
        description: 'Non-slip yoga mat made from eco-friendly materials. Perfect for yoga, pilates, and fitness activities.',
        price: 3500,
        category: 'Sports & Fitness',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
        stock: 40,
        featured: true,
        bestSeller: false
      }
    })
  ])

  console.log('Products created:', products.length)

  // Create sample offers
  const offers = await Promise.all([
    prisma.offer.upsert({
      where: { id: 'off-1' },
      update: {},
      create: {
        id: 'off-1',
        title: 'Summer Sale',
        description: 'Get up to 50% off on selected items',
        discountPercentage: 50,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31'),
        status: 'ACTIVE',
        targetAudience: 'ALL',
        minimumPurchase: 5000,
        maximumDiscount: 10000,
        usageLimit: 1000,
        usedCount: 342
      }
    }),
    prisma.offer.upsert({
      where: { id: 'off-2' },
      update: {},
      create: {
        id: 'off-2',
        title: 'New Year Special',
        description: 'Welcome 2025 with amazing deals',
        discountPercentage: 30,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        status: 'ACTIVE',
        targetAudience: 'EXISTING',
        minimumPurchase: 3000,
        maximumDiscount: 5000,
        usageLimit: 500,
        usedCount: 156
      }
    }),
    prisma.offer.upsert({
      where: { id: 'off-3' },
      update: {},
      create: {
        id: 'off-3',
        title: 'Tech Week',
        description: 'Exclusive deals on electronics',
        discountPercentage: 25,
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-02-07'),
        status: 'SCHEDULED',
        targetAudience: 'ALL',
        minimumPurchase: 10000,
        maximumDiscount: 15000,
        usageLimit: 200,
        usedCount: 0
      }
    })
  ])

  console.log('Offers created:', offers.length)

  // Create sample banners
  const banners = await Promise.all([
    prisma.banner.upsert({
      where: { id: 'ban-1' },
      update: {},
      create: {
        id: 'ban-1',
        title: 'Hero Banner 1',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
        altText: 'Summer Sale Banner',
        linkUrl: '/products?category=summer-sale',
        status: 'ACTIVE',
        position: 'HERO',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-03-31')
      }
    }),
    prisma.banner.upsert({
      where: { id: 'ban-2' },
      update: {},
      create: {
        id: 'ban-2',
        title: 'Hero Banner 2',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop',
        altText: 'New Year Special Banner',
        linkUrl: '/products?category=new-year',
        status: 'ACTIVE',
        position: 'HERO',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31')
      }
    })
  ])

  console.log('Banners created:', banners.length)

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.upsert({
      where: { id: 'ord-1' },
      update: {},
      create: {
        id: 'ord-1',
        customerName: 'John Doe',
        customerEmail: 'john.doe@email.com',
        customerPhone: '+254 751 030 250',
        shippingAddress: '123 Main St, Nyeri, Kenya',
        total: 58750,
        status: 'PROCESSING',
        paymentMethod: 'MPESA',
        paymentStatus: 'PAID',
        trackingNumber: 'TRK-123456789',
        notes: 'Customer requested express delivery',
        estimatedDelivery: new Date('2025-01-20')
      }
    }),
    prisma.order.upsert({
      where: { id: 'ord-2' },
      update: {},
      create: {
        id: 'ord-2',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@email.com',
        customerPhone: '+254 725 172 596',
        shippingAddress: '456 Oak Ave, Nairobi, Kenya',
        total: 9725,
        status: 'SHIPPED',
        paymentMethod: 'CARD',
        paymentStatus: 'PAID',
        trackingNumber: 'TRK-987654321',
        estimatedDelivery: new Date('2025-01-18')
      }
    })
  ])

  console.log('Orders created:', orders.length)

  // Create order items
  const orderItems = await Promise.all([
    prisma.orderItem.upsert({
      where: { id: 'item-1' },
      update: {},
      create: {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Premium Wireless Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
        quantity: 2,
        price: 15000,
        total: 30000,
        orderId: 'ord-1'
      }
    }),
    prisma.orderItem.upsert({
      where: { id: 'item-2' },
      update: {},
      create: {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'Smart Fitness Watch',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
        quantity: 1,
        price: 25000,
        total: 25000,
        orderId: 'ord-1'
      }
    }),
    prisma.orderItem.upsert({
      where: { id: 'item-3' },
      update: {},
      create: {
        id: 'item-3',
        productId: 'prod-3',
        productName: 'Designer Leather Bag',
        productImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&h=100&fit=crop',
        quantity: 1,
        price: 8500,
        total: 8500,
        orderId: 'ord-2'
      }
    })
  ])

  console.log('Order items created:', orderItems.length)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 