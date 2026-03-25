-- Add guardrail fields to ai_configs
ALTER TABLE "ai_configs" ADD COLUMN IF NOT EXISTS "keywords" TEXT[] DEFAULT '{}';
ALTER TABLE "ai_configs" ADD COLUMN IF NOT EXISTS "autoReject" BOOLEAN DEFAULT false;
