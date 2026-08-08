/*
  Warnings:

  - The `seatType` column on the `BusSeat` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `seatClass` to the `BusSeat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeatClass" AS ENUM ('EXECUTIVE', 'BUSINESS', 'SLEEPER');

-- CreateEnum
CREATE TYPE "SeatLayoutType" AS ENUM ('TWO_BY_TWO', 'ONE_BY_TWO');

-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('SEAT', 'UPPER_BED', 'LOWER_BED');

-- AlterTable
ALTER TABLE "Bus" ADD COLUMN     "seatClass" "SeatClass" NOT NULL DEFAULT 'EXECUTIVE',
ADD COLUMN     "seatLayoutType" "SeatLayoutType" NOT NULL DEFAULT 'TWO_BY_TWO';

-- AlterTable
ALTER TABLE "BusSeat" ADD COLUMN     "seatClass" "SeatClass" NOT NULL,
ADD COLUMN     "sleeperGroup" INTEGER,
DROP COLUMN "seatType",
ADD COLUMN     "seatType" "SeatType" NOT NULL DEFAULT 'SEAT';

-- CreateIndex
CREATE INDEX "BusSeat_busId_row_idx" ON "BusSeat"("busId", "row");

-- CreateIndex
CREATE INDEX "BusSeat_busId_sleeperGroup_idx" ON "BusSeat"("busId", "sleeperGroup");

-- CreateIndex
CREATE INDEX "BusSeat_busId_seatClass_idx" ON "BusSeat"("busId", "seatClass");

-- CreateIndex
CREATE INDEX "BusSeat_busId_seatType_idx" ON "BusSeat"("busId", "seatType");
