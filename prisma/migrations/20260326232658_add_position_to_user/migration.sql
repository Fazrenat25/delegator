-- CreateEnum
CREATE TYPE "Position" AS ENUM ('MANAGER', 'DEVELOPER', 'DESIGNER', 'ANALYST', 'TESTER', 'HR', 'ACCOUNTANT', 'SALESMAN', 'SUPPORT', 'INTERN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "position" "Position" DEFAULT 'MANAGER',
ALTER COLUMN "username" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");
