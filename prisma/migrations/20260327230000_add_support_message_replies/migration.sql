-- AlterTable
ALTER TABLE "SupportMessage" DROP COLUMN "reply",
DROP COLUMN "userReply";

-- CreateTable
CREATE TABLE "SupportMessageReply" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fromAdmin" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportMessageReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SupportMessageReply_messageId_idx" ON "SupportMessageReply"("messageId");

-- CreateIndex
CREATE INDEX "SupportMessageReply_createdAt_idx" ON "SupportMessageReply"("createdAt");

-- AddForeignKey
ALTER TABLE "SupportMessageReply" ADD CONSTRAINT "SupportMessageReply_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "SupportMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
