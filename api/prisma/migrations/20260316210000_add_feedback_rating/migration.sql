-- AlterTable: add rating fields to feedbacks
ALTER TABLE "feedbacks" ADD COLUMN IF NOT EXISTS "rating" TEXT;
ALTER TABLE "feedbacks" ADD COLUMN IF NOT EXISTS "ratingNote" TEXT;
