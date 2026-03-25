-- Add statusNote column
ALTER TABLE "feedbacks" ADD COLUMN IF NOT EXISTS "statusNote" TEXT;
