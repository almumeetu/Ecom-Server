-- Make userId optional for guest orders
ALTER TABLE "orders" ALTER COLUMN "userId" DROP NOT NULL;

-- Make addressId optional for guest orders
ALTER TABLE "orders" ALTER COLUMN "addressId" DROP NOT NULL;

-- Add shipping address column (JSON — stores email, fullName, phone, and full address)
ALTER TABLE "orders" ADD COLUMN "shipping_address" JSONB;

-- Drop old individual columns
ALTER TABLE "orders" DROP COLUMN IF EXISTS "guest_email";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "guest_name";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "guest_phone";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_full_name";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_phone";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_address_line1";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_address_line2";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_city";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_state";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_postal_code";
ALTER TABLE "orders" DROP COLUMN IF EXISTS "shipping_country";
