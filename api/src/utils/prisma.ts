import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create PrismaClient with adapter for Prisma 7 compatibility
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
