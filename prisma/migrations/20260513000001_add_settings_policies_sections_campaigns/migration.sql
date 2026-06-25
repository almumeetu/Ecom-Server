-- CreateTable settings
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "shop_name" TEXT NOT NULL,
    "logo" TEXT,
    "icon" TEXT,
    "copyright_year" TEXT,
    "parent_company" TEXT,
    "parent_company_link" TEXT,
    "slogan" TEXT,
    "contact_number" JSONB,
    "email" JSONB,
    "social_contact" JSONB,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "language" TEXT NOT NULL DEFAULT 'en',
    "fraud_check_api_key" TEXT,
    "is_fraud_checking" BOOLEAN NOT NULL DEFAULT false,
    "fraud_checking_threshold" INTEGER NOT NULL DEFAULT 0,
    "fraud_checking_success_rate" DECIMAL(5,2),
    "delivery_charge_inside" DECIMAL(10,2),
    "delivery_charge_outside" DECIMAL(10,2),
    "delivery_charge_near_city" DECIMAL(10,2),
    "youtube_url" TEXT,
    "youtube_thumbnail_image" TEXT,
    "youtube_title" TEXT,
    "youtube_description" TEXT,
    "youtube_meta_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable policies
CREATE TABLE "policies" (
    "id" TEXT NOT NULL,
    "delivery" JSONB,
    "return" JSONB,
    "refund" JSONB,
    "cancellation" JSONB,
    "privacy" JSONB,
    "terms" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable sections
CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable campaigns
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "has_discount" BOOLEAN NOT NULL DEFAULT false,
    "discount_id" TEXT,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "section_id" TEXT NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable campaign_images
CREATE TABLE "campaign_images" (
    "id" TEXT NOT NULL,
    "images" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "campaign_id" TEXT NOT NULL,

    CONSTRAINT "campaign_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_images" ADD CONSTRAINT "campaign_images_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
