import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting mango database seeding...');

  try {
    // 1. Clear old catalog data using raw SQL truncate with cascade to handle foreign keys
    console.log('🧹 Clearing old products, categories, brands, and media...');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "products" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "categories" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "brands" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "media" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "units" CASCADE;');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "attributes" CASCADE;');

    // 2. Create Unit
    console.log('📦 Seeding Unit...');
    const unit = await prisma.unit.create({
      data: {
        name: 'Carton',
        code: 'carton',
        description: 'Standard cardboard shipping box packaging',
        isActive: true,
      },
    });

    // 3. Create Categories
    console.log('🗂️ Seeding Categories...');
    const amrupaliCat = await prisma.category.create({
      data: { name: 'Amrupali', slug: 'amrupali' },
    });
    const bari4Cat = await prisma.category.create({
      data: { name: 'Bari-4', slug: 'bari-4' },
    });
    const bananaCat = await prisma.category.create({
      data: { name: 'Banana Mango', slug: 'banana-mango' },
    });

    // 4. Create Brands (Orchard Sourced Origins)
    console.log('🏷️ Seeding Brands (Orchard Origins)...');
    const rajshahiBrand = await prisma.brand.create({
      data: { name: 'Rajshahi Sourced', slug: 'rajshahi-sourced' },
    });
    const chapaiBrand = await prisma.brand.create({
      data: { name: 'Chapainawabganj Sourced', slug: 'chapainawabganj-sourced' },
    });
    const satkhiraBrand = await prisma.brand.create({
      data: { name: 'Satkhira Sourced', slug: 'satkhira-sourced' },
    });

    // 5. Seed Media
    console.log('🖼️ Seeding Media...');
    const mediaAmrupali = await prisma.media.create({
      data: {
        url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=85',
        type: 'image',
        provider: 'local',
      },
    });
    const mediaBari4 = await prisma.media.create({
      data: {
        url: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=900&q=85',
        type: 'image',
        provider: 'local',
      },
    });
    const mediaBanana = await prisma.media.create({
      data: {
        url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=900&q=85',
        type: 'image',
        provider: 'local',
      },
    });

    // 6. Seed Products and Variants
    console.log('🥭 Seeding Products & Variants...');

    const productsData = [
      {
        name: 'Amrupali Premium Carton - 5 KG',
        slug: 'amrupali-premium-carton-5-kg',
        description: 'Naturally tree-ripened, extremely sweet, fiberless Amrupali mangoes handpicked from Rajshahi orchards. Packed in double-layer protective 5 KG cartons.',
        categoryId: amrupaliCat.id,
        brandId: rajshahiBrand.id,
        unitId: unit.id,
        mediaId: mediaAmrupali.id,
        sku: 'AMRUPALI-5KG',
        price: 650,
        cost: 300,
      },
      {
        name: 'Amrupali Premium Carton - 10 KG',
        slug: 'amrupali-premium-carton-10-kg',
        description: 'Larger batch of premium, naturally tree-ripened Amrupali mangoes direct from Rajshahi. Packed in double-layer protective 10 KG cartons for family sharing.',
        categoryId: amrupaliCat.id,
        brandId: rajshahiBrand.id,
        unitId: unit.id,
        mediaId: mediaAmrupali.id,
        sku: 'AMRUPALI-10KG',
        price: 1200,
        cost: 550,
      },
      {
        name: 'Bari-4 Premium Carton - 5 KG',
        slug: 'bari-4-premium-carton-5-kg',
        description: 'Exquisite, thick-fleshed Bari-4 late-season mangoes direct from Chapainawabganj orchards. Naturally ripened, high sweetness, 5 KG carton pack.',
        categoryId: bari4Cat.id,
        brandId: chapaiBrand.id,
        unitId: unit.id,
        mediaId: mediaBari4.id,
        sku: 'BARI4-5KG',
        price: 750,
        cost: 350,
      },
      {
        name: 'Bari-4 Premium Carton - 10 KG',
        slug: 'bari-4-premium-carton-10-kg',
        description: 'Large family carton pack of premium late-season Bari-4 mangoes direct from Chapainawabganj. Wrapped individually to preserve freshness. 10 KG carton.',
        categoryId: bari4Cat.id,
        brandId: chapaiBrand.id,
        unitId: unit.id,
        mediaId: mediaBari4.id,
        sku: 'BARI4-10KG',
        price: 1400,
        cost: 650,
      },
      {
        name: 'Banana Mango Exotic Carton - 5 KG',
        slug: 'banana-mango-exotic-carton-5-kg',
        description: 'Highly aromatic, slender and banana-shaped exotic mango variety direct from Satkhira. Extremely thin seed, dense flesh, sweet flavor. 5 KG carton.',
        categoryId: bananaCat.id,
        brandId: satkhiraBrand.id,
        unitId: unit.id,
        mediaId: mediaBanana.id,
        sku: 'BANANA-5KG',
        price: 900,
        cost: 400,
      },
      {
        name: 'Banana Mango Exotic Carton - 10 KG',
        slug: 'banana-mango-exotic-carton-10-kg',
        description: 'Premium choice batch of aromatic, banana-shaped exotic mangoes from Satkhira orchards. Handpicked at peak maturity. 10 KG double carton package.',
        categoryId: bananaCat.id,
        brandId: satkhiraBrand.id,
        unitId: unit.id,
        mediaId: mediaBanana.id,
        sku: 'BANANA-10KG',
        price: 1750,
        cost: 800,
      },
    ];

    for (const p of productsData) {
      // Create Product
      const product = await prisma.product.create({
        data: {
          name: p.name,
          slug: p.slug,
          description: p.description,
          status: 'active',
          categoryId: p.categoryId,
          brandId: p.brandId,
          unitId: p.unitId,
        },
      });

      // Link Product Media
      await prisma.productMedia.create({
        data: {
          productId: product.id,
          mediaId: p.mediaId,
          isFeatured: true,
          sortOrder: 1,
        },
      });

      // Create Product Variant
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: p.sku,
          price: p.price,
          cost: p.cost,
          stockQuantity: 150,
          stockAlertThreshold: 10,
          isDefault: true,
        },
      });

      console.log(`✅ Created product and variant for: ${p.name}`);
    }

    console.log('\n🎉 Successfully seeded all mango products and categories into backend database!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
