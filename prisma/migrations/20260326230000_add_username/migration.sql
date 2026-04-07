-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT NOT NULL DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
