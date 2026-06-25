-- AlterTable
ALTER TABLE "settings" ADD COLUMN     "branch_address" TEXT,
ADD COLUMN     "branch_lat" DOUBLE PRECISION,
ADD COLUMN     "branch_lng" DOUBLE PRECISION,
ADD COLUMN     "branch_name" TEXT;
