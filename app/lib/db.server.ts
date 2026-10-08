import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from '~/generated/prisma/client'
import { env } from './env.server'

const cache = globalThis as {
  prismaClient?: PrismaClient
  prismaClientClass?: typeof PrismaClient
}

export function db() {
  if (!cache.prismaClient || cache.prismaClientClass !== PrismaClient) {
    void cache.prismaClient?.$disconnect()
    cache.prismaClient = new PrismaClient({
      adapter: new PrismaPg({ connectionString: env.databaseUrl }),
    })
    cache.prismaClientClass = PrismaClient
  }
  return cache.prismaClient
}

const hasErrorCode = (error: unknown, code: string) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === code

export const isUniqueViolation = (error: unknown) =>
  hasErrorCode(error, 'P2002')

export const isRecordNotFound = (error: unknown) => hasErrorCode(error, 'P2025')
