-- Add missing AI columns
ALTER TABLE "feedbacks" ADD COLUMN IF NOT EXISTS "aiUILanguage" TEXT;
ALTER TABLE "feedbacks" ADD COLUMN IF NOT EXISTS "aiTranslatedResponse" TEXT;
