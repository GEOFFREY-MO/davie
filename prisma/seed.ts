import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@davietech.com' },
    update: {},
    create: {
      email: 'admin@davietech.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
        price: 15000,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        stock: 25,
        featured: true,
        bestSeller: true,
      },
    }),
    prisma.product.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking with heart rate monitoring and GPS capabilities.',
        price: 25000,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        stock: 15,
        featured: true,
        bestSeller: true,
      },
    }),
    prisma.product.upsert({
      where: { id: '3' },
      update: {},
      create: {
        id: '3',
        name: 'Designer Leather Bag',
        description: 'Handcrafted leather bag with premium materials and elegant design.',
        price: 8500,
        category: 'Fashion',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
        stock: 30,
        featured: true,
        bestSeller: false,
      },
    }),
    prisma.product.upsert({
      where: { id: '4' },
      update: {},
      create: {
        id: '4',
        name: 'Organic Coffee Beans',
        description: 'Premium organic coffee beans sourced from the finest regions.',
        price: 1200,
        category: 'Food & Beverages',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop',
        stock: 50,
        featured: false,
        bestSeller: true,
      },
    }),
    prisma.product.upsert({
      where: { id: '5' },
      update: {},
      create: {
        id: '5',
        name: 'Wireless Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.',
        price: 8000,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
        stock: 20,
        featured: true,
        bestSeller: false,
      },
    }),
    prisma.product.upsert({
      where: { id: '6' },
      update: {},
      create: {
        id: '6',
        name: 'Premium Yoga Mat',
        description: 'Non-slip yoga mat made from eco-friendly materials for your practice.',
        price: 3500,
        category: 'Sports & Fitness',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
        stock: 40,
        featured: false,
        bestSeller: true,
      },
    }),
    prisma.product.upsert({
      where: { id: '7' },
      update: {},
      create: {
        id: '7',
        name: 'Smart Home Security Camera',
        description: '1080p HD security camera with night vision and motion detection.',
        price: 12000,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        stock: 10,
        featured: true,
        bestSeller: false,
      },
    }),
    prisma.product.upsert({
      where: { id: '8' },
      update: {},
      create: {
        id: '8',
        name: 'Artisan Ceramic Mug Set',
        description: 'Handcrafted ceramic mugs perfect for your morning coffee or tea.',
        price: 1800,
        category: 'Home & Kitchen',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop',
        stock: 35,
        featured: false,
        bestSeller: true,
      },
    }),
  ])

  console.log({ admin, products })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 