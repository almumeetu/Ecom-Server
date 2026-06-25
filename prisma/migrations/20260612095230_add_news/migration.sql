-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('retail', 'wholesale');

-- CreateEnum
CREATE TYPE "WholesaleRequestStatus" AS ENUM ('pending', 'info_requested', 'approved', 'rejected', 'converted');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('percentage', 'fixed');

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_addressId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- AlterTable
ALTER TABLE "campaign_images" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "campaigns" ALTER COLUMN "end_at" DROP NOT NULL,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "orderType" "OrderType" NOT NULL DEFAULT 'retail',
ADD COLUMN     "tax" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "policies" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "sections" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "settings" ALTER COLUMN "shop_name" DROP NOT NULL,
ALTER COLUMN "copyright_year" SET DEFAULT '2026',
ALTER COLUMN "delivery_charge_inside" SET DEFAULT 0,
ALTER COLUMN "delivery_charge_outside" SET DEFAULT 0,
ALTER COLUMN "delivery_charge_near_city" SET DEFAULT 0,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "wholesale_order_requests" (
    "id" TEXT NOT NULL,
    "request_number" TEXT NOT NULL,
    "status" "WholesaleRequestStatus" NOT NULL DEFAULT 'pending',
    "customer_note" TEXT,
    "admin_note" TEXT,
    "info_request_message" TEXT,
    "contact_phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "reviewed_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "order_id" TEXT,

    CONSTRAINT "wholesale_order_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wholesale_order_request_items" (
    "id" TEXT NOT NULL,
    "requested_quantity" INTEGER NOT NULL,
    "target_price" DECIMAL(10,2),
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "request_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "variant_id" TEXT,

    CONSTRAINT "wholesale_order_request_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "cover_image_url" TEXT,
    "author" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_discounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_products" (
    "discount_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "discount_products_pkey" PRIMARY KEY ("discount_id","product_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wholesale_order_requests_request_number_key" ON "wholesale_order_requests"("request_number");

-- CreateIndex
CREATE UNIQUE INDEX "wholesale_order_requests_order_id_key" ON "wholesale_order_requests"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "news"("slug");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wholesale_order_requests" ADD CONSTRAINT "wholesale_order_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wholesale_order_requests" ADD CONSTRAINT "wholesale_order_requests_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wholesale_order_request_items" ADD CONSTRAINT "wholesale_order_request_items_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "wholesale_order_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wholesale_order_request_items" ADD CONSTRAINT "wholesale_order_request_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wholesale_order_request_items" ADD CONSTRAINT "wholesale_order_request_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "product_discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_products" ADD CONSTRAINT "discount_products_discount_id_fkey" FOREIGN KEY ("discount_id") REFERENCES "product_discounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_products" ADD CONSTRAINT "discount_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
