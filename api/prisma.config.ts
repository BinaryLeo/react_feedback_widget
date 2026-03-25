import { defineConfig } from '@prisma/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  
  // Datasource configuration for migrations
  // @ts-ignore - Prisma 7 requires this but types don't include it yet
  datasource: {
    provider: 'postgresql',
    url: connectionString,
  },
  
  // Database adapter for Migrate and Introspect
  migrate: {
    async adapter() {
      const { PrismaPg } = await import('@prisma/adapter-pg');
      const { Pool } = await import('pg');
      
      const pool = new Pool({ connectionString });
      return new PrismaPg(pool);
    },
  },
});
