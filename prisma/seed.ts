import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { seedAuth } from './seed-auth';

const sections = [
  { title: 'Hero Campaign', position: 1, page: 'home' },
  { title: 'New Trend Campaign', position: 2, page: 'home' },
  { title: 'Banner Campaign', position: 3, page: 'home' },
];

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedSections() {
  const created: Array<{ id: string; title: string }> = [];

  for (const section of sections) {
    const existing = await prisma.section.findFirst({
      where: { title: section.title },
    });

    if (existing) {
      console.log(`ℹ️ Section already exists: ${section.title}`);
      created.push({ id: existing.id, title: existing.title });
    } else {
      const createdSection = await prisma.section.create({
        data: {
          title: section.title,
          position: section.position,
          page: section.page,
        },
      });
      console.log(`✅ Created section: ${createdSection.title} (position ${createdSection.position})`);
      created.push({ id: createdSection.id, title: createdSection.title });
    }
  }

  console.log(`🎉 Successfully seeded ${created.length} sections`);
  return { total: created.length, sections: created };
}

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    console.log('\n👤 Seeding staff, roles & permissions...');
    const { superadmin, admin } = await seedAuth(prisma);

    console.log('\n📋 Seeding sections...');
    const sectionResult = await seedSections();

    console.log('\n🎉 All seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Superadmin: ${superadmin.email}`);
    console.log(`   Admin:      ${admin.email}`);
    console.log(`   Sections: ${sectionResult.total}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { main as seedAll };
