-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "screenshot" TEXT,
    "aiAnalyzed" BOOLEAN NOT NULL DEFAULT false,
    "aiSuggestedType" TEXT,
    "aiConfidence" DOUBLE PRECISION,
    "aiPriority" TEXT,
    "aiSentiment" TEXT,
    "aiSummary" TEXT,
    "aiCategory" TEXT,
    "aiActionItems" TEXT[],
    "aiLanguage" TEXT,
    "aiTranslated" TEXT,
    "aiResponse" TEXT,
    "aiScreenshotDesc" TEXT,
    "duplicateOfId" TEXT,
    "similarityScore" DOUBLE PRECISION,
    "assignedTo" TEXT,
    "team" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_configs" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "apiKey" TEXT,
    "baseUrl" TEXT,
    "model" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "autoCategorize" BOOLEAN NOT NULL DEFAULT true,
    "validateType" BOOLEAN NOT NULL DEFAULT true,
    "priorityScoring" BOOLEAN NOT NULL DEFAULT true,
    "sentimentAnalysis" BOOLEAN NOT NULL DEFAULT true,
    "autoResponse" BOOLEAN NOT NULL DEFAULT true,
    "screenshotAnalysis" BOOLEAN NOT NULL DEFAULT true,
    "duplicateDetection" BOOLEAN NOT NULL DEFAULT true,
    "smartRouting" BOOLEAN NOT NULL DEFAULT true,
    "languageDetection" BOOLEAN NOT NULL DEFAULT true,
    "minConfidence" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "duplicateThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routing_rules" (
    "id" TEXT NOT NULL,
    "keywords" TEXT[],
    "categories" TEXT[],
    "types" TEXT[],
    "priorities" TEXT[],
    "team" TEXT NOT NULL,
    "assignee" TEXT,
    "autoReply" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "routing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedbacks_type_idx" ON "feedbacks"("type");

-- CreateIndex
CREATE INDEX "feedbacks_createdAt_idx" ON "feedbacks"("createdAt");

-- CreateIndex
CREATE INDEX "feedbacks_aiPriority_idx" ON "feedbacks"("aiPriority");

-- CreateIndex
CREATE INDEX "feedbacks_aiSentiment_idx" ON "feedbacks"("aiSentiment");

-- CreateIndex
CREATE INDEX "feedbacks_status_idx" ON "feedbacks"("status");

-- CreateIndex
CREATE INDEX "feedbacks_team_idx" ON "feedbacks"("team");

-- CreateIndex
CREATE UNIQUE INDEX "ai_configs_projectId_key" ON "ai_configs"("projectId");

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "feedbacks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
