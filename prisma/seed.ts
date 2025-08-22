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

  // Skip sample products for production readiness
  console.log('Production seed: no sample products created')

  // Skip sample offers for production readiness
  console.log('Production seed: no sample offers created')

  // Skip sample banners for production readiness
  console.log('Production seed: no sample banners created')

  // Skip sample orders for production readiness
  console.log('Production seed: no sample orders created')

  // Skip sample order items for production readiness
  console.log('Production seed: no sample order items created')

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