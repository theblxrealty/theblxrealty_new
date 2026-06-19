import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate())
}

declare global {
  var __db: undefined | ReturnType<typeof prismaClientSingleton>
}

const db = globalThis.__db ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.__db = db

export { db } 