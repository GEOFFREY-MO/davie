import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// Export db as an alias for prisma to match API route imports
export const db = prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 