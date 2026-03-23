import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Check if there are already links
  const count = await prisma.headerLink.count();
  if (count > 0) {
    console.log('Header links already exist. Skipping seed.');
    return;
  }

  const links = [
    { label: 'Hakkımızda', url: '/about', locale: 'tr', order: 10 },
    { label: 'Uzmanlık Alanları', url: '/category/all', locale: 'tr', order: 20 },
    { label: 'Yayınlar', url: '/search', locale: 'tr', order: 30 },
    { label: 'İletişim', url: '/contact', locale: 'tr', order: 40 },
    { label: 'About Us', url: '/about', locale: 'en', order: 10 },
    { label: 'Practice Areas', url: '/category/all', locale: 'en', order: 20 },
    { label: 'Publications', url: '/search', locale: 'en', order: 30 },
    { label: 'Contact', url: '/contact', locale: 'en', order: 40 },
  ];

  for (const link of links) {
    await prisma.headerLink.create({ data: link });
  }
  
  console.log('Successfully seeded default header links.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
