// backend/lib/prisma.js
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

let prisma

export function getPrisma() {
  if (!prisma) {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
    
    prisma = new PrismaClient({ adapter })
  }
  
  return prisma
}