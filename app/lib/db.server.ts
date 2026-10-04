import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from '~/generated/prisma/client'
import { env } from './env.server'

const globalForPrisma = globalThis as { prisma?: PrismaClient }

export function db() {
  globalForPrisma.prisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString: env.databaseUrl }),
  })
  return globalForPrisma.prisma
}

export const isUniqueViolation = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  error.code === 'P2002'
