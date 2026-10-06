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

const hasErrorCode = (error: unknown, code: string) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === code

export const isUniqueViolation = (error: unknown) =>
  hasErrorCode(error, 'P2002')

export const isRecordNotFound = (error: unknown) => hasErrorCode(error, 'P2025')
