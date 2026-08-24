-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('OPERATIONAL', 'DOWN', 'RETIRED');

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "status" "AssetStatus" NOT NULL DEFAULT 'OPERATIONAL';

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "assetId" TEXT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
