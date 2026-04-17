-- CreateEnum
CREATE TYPE "BackupStatus" AS ENUM ('COMPLETED', 'RESTORING', 'FAILED');

-- AlterTable
ALTER TABLE "SupportMessage" ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DatabaseBackup" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filesize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "BackupStatus" NOT NULL DEFAULT 'COMPLETED',
    "note" TEXT,

    CONSTRAINT "DatabaseBackup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DatabaseBackup_filename_key" ON "DatabaseBackup"("filename");
