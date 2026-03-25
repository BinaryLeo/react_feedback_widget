-- AlterTable: add businessContext to ai_configs
ALTER TABLE "ai_configs" ADD COLUMN IF NOT EXISTS "businessContext" TEXT;
