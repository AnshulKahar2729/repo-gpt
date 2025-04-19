// lib/prisma.ts

import { PrismaClient } from '@prisma/client'

declare global {
  // allow global `var` in dev with type safety
  var prisma: PrismaClient | undefined
}

export const prisma =
  globalThis.prisma ||
  new PrismaClient({
    log: ['query'], // or remove for less logging
  })

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
