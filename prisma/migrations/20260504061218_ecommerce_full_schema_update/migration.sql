/*
  Warnings:

  - You are about to drop the column `created_at` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entity_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `entity_type` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `attribute_id` on the `attribute_values` table. All the data in the column will be lost.
  - You are about to drop the column `cart_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `session_id` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `max_usage` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `used_count` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `reference_id` on the `inventory_logs` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `inventory_logs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `is_read` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `order_status_logs` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `order_status_logs` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_number` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `payment_status` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `placed_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_cost` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `paid_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `is_featured` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `is_featured` on the `product_media` table. All the data in the column will be lost.
  - You are about to drop the column `media_id` on the `product_media` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_media` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `product_media` table. All the data in the column will be lost.
  - You are about to drop the column `attribute_value_id` on the `product_variant_attributes` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `product_variant_attributes` table. All the data in the column will be lost.
  - You are about to drop the column `is_default` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `stock_alert_threshold` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `stock_quantity` on the `product_variants` table. All the data in the column will be lost.
  - You are about to drop the column `brand_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `is_approved` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `courier_name` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `delivered_at` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `shipped_at` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `tracking_number` on the `shipments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `wishlists` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `wishlists` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `wishlists` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderNumber]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,productId]` on the table `wishlists` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributeId` to the `attribute_values` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cartId` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `carts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxUsage` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `inventory_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `order_status_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderNumber` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `product_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaId` to the `product_media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `product_media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributeValueId` to the `product_variant_attributes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `product_variant_attributes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `product_variants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courierName` to the `shipments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `shipments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `wishlists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `wishlists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activity_logs" DROP CONSTRAINT "activity_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "attribute_values" DROP CONSTRAINT "attribute_values_attribute_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_logs" DROP CONSTRAINT "inventory_logs_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "order_status_logs" DROP CONSTRAINT "order_status_logs_order_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_address_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_media_id_fkey";

-- DropForeignKey
ALTER TABLE "product_media" DROP CONSTRAINT "product_media_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variant_attributes" DROP CONSTRAINT "product_variant_attributes_attribute_value_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variant_attributes" DROP CONSTRAINT "product_variant_attributes_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variants" DROP CONSTRAINT "product_variants_product_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_category_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_product_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_user_id_fkey";

-- DropForeignKey
ALTER TABLE "shipments" DROP CONSTRAINT "shipments_order_id_fkey";

-- DropForeignKey
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_product_id_fkey";

-- DropForeignKey
ALTER TABLE "wishlists" DROP CONSTRAINT "wishlists_user_id_fkey";

-- DropIndex
DROP INDEX "orders_order_number_key";

-- DropIndex
DROP INDEX "wishlists_user_id_product_id_key";

-- AlterTable
ALTER TABLE "activity_logs" DROP COLUMN "created_at",
DROP COLUMN "entity_id",
DROP COLUMN "entity_type",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "entityId" TEXT,
ADD COLUMN     "entityType" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "attribute_values" DROP COLUMN "attribute_id",
ADD COLUMN     "attributeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "cart_id",
DROP COLUMN "created_at",
DROP COLUMN "variant_id",
ADD COLUMN     "cartId" TEXT NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "session_id",
DROP COLUMN "user_id",
ADD COLUMN     "sessionId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "parent_id",
ADD COLUMN     "parentId" TEXT;

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "expires_at",
DROP COLUMN "max_usage",
DROP COLUMN "used_count",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "maxUsage" INTEGER NOT NULL,
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "value" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "inventory_logs" DROP COLUMN "reference_id",
DROP COLUMN "variant_id",
ADD COLUMN     "referenceId" TEXT,
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "created_at",
DROP COLUMN "is_read",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "order_id",
DROP COLUMN "product_id",
DROP COLUMN "total_price",
DROP COLUMN "unit_price",
DROP COLUMN "variant_id",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "unitPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "order_status_logs" DROP COLUMN "created_at",
DROP COLUMN "order_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "address_id",
DROP COLUMN "order_number",
DROP COLUMN "payment_status",
DROP COLUMN "placed_at",
DROP COLUMN "shipping_cost",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "addressId" TEXT NOT NULL,
ADD COLUMN     "orderNumber" TEXT NOT NULL,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'unpaid',
ADD COLUMN     "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "shippingCost" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "order_id",
DROP COLUMN "paid_at",
DROP COLUMN "transaction_id",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "transactionId" TEXT;

-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "is_featured",
DROP COLUMN "product_id",
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_media" DROP COLUMN "is_featured",
DROP COLUMN "media_id",
DROP COLUMN "product_id",
DROP COLUMN "sort_order",
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mediaId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "product_variant_attributes" DROP COLUMN "attribute_value_id",
DROP COLUMN "variant_id",
ADD COLUMN     "attributeValueId" TEXT NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "is_default",
DROP COLUMN "product_id",
DROP COLUMN "stock_alert_threshold",
DROP COLUMN "stock_quantity",
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "stockAlertThreshold" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "brand_id",
DROP COLUMN "category_id",
ADD COLUMN     "brandId" TEXT NOT NULL,
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "created_at",
DROP COLUMN "is_approved",
DROP COLUMN "product_id",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shipments" DROP COLUMN "courier_name",
DROP COLUMN "delivered_at",
DROP COLUMN "order_id",
DROP COLUMN "shipped_at",
DROP COLUMN "tracking_number",
ADD COLUMN     "courierName" TEXT NOT NULL,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "wishlists" DROP COLUMN "created_at",
DROP COLUMN "product_id",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "wishlists_userId_productId_key" ON "wishlists"("userId", "productId");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_media" ADD CONSTRAINT "product_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attributes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_attributes" ADD CONSTRAINT "product_variant_attributes_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_attributes" ADD CONSTRAINT "product_variant_attributes_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "attribute_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_logs" ADD CONSTRAINT "inventory_logs_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_logs" ADD CONSTRAINT "order_status_logs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
