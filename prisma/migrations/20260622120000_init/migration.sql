-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EQUIPE');

-- CreateEnum
CREATE TYPE "Format" AS ENUM ('INSTAGRAM_FEED', 'INSTAGRAM_STORY', 'FACEBOOK_FEED');

-- CreateEnum
CREATE TYPE "GenStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EQUIPE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "brandColors" JSONB,
    "fonts" JSONB,
    "styleDescription" TEXT,
    "visualRules" TEXT,
    "restrictions" TEXT,
    "basePrompt" TEXT,
    "referenceImages" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "format" "Format" NOT NULL,
    "briefing" TEXT NOT NULL,
    "mainText" TEXT,
    "secondaryText" TEXT,
    "cta" TEXT,
    "observations" TEXT,
    "referenceImageUrl" TEXT,
    "finalPrompt" TEXT NOT NULL,
    "model" TEXT NOT NULL DEFAULT 'gpt-image-1',
    "sizeUsed" TEXT NOT NULL,
    "rawImageUrl" TEXT,
    "composedImageUrl" TEXT,
    "layers" JSONB,
    "status" "GenStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_slug_key" ON "Client"("slug");

-- CreateIndex
CREATE INDEX "Client_slug_idx" ON "Client"("slug");

-- CreateIndex
CREATE INDEX "Generation_clientId_idx" ON "Generation"("clientId");

-- CreateIndex
CREATE INDEX "Generation_userId_idx" ON "Generation"("userId");

-- CreateIndex
CREATE INDEX "Generation_format_idx" ON "Generation"("format");

-- CreateIndex
CREATE INDEX "Generation_createdAt_idx" ON "Generation"("createdAt");

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
