-- DropIndex
DROP INDEX "Bus_companyId_registrationNumber_key";

-- AlterTable
ALTER TABLE "Bus" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "registrationNumber" DROP NOT NULL;
