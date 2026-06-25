-- AlterTable
ALTER TABLE "_ProductToTag" ADD CONSTRAINT "_ProductToTag_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProductToTag_AB_unique";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "image_url" TEXT;
