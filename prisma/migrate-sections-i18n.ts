// Migration: Convert flat section content to bilingual {tr, en} format
// Run with: npx tsx prisma/migrate-sections-i18n.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrate() {
  const sections = await prisma.pageSection.findMany();
  
  let migrated = 0;
  for (const section of sections) {
    let content: any;
    try { content = JSON.parse(section.content); } catch { continue; }

    // Skip if already in bilingual format
    if (content.tr && content.en) {
      console.log(`  ⏭ ${section.pageId}/${section.type} — already bilingual`);
      continue;
    }

    // Wrap current content as TR, copy to EN
    const bilingual = { tr: content, en: { ...content } };

    await prisma.pageSection.update({
      where: { id: section.id },
      data: { content: JSON.stringify(bilingual) },
    });

    migrated++;
    console.log(`  ✓ ${section.pageId}/${section.type}`);
  }

  console.log(`Done! Migrated ${migrated} sections to bilingual format.`);
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
