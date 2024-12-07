/*
  Warnings:

  - You are about to drop the column `referralDate` on the `Referral` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Referral" DROP COLUMN "referralDate",
ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
