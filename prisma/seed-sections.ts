// Seed script for default page sections
// Run with: npx tsx prisma/seed-sections.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULTS: { pageId: string; type: string; content: any }[] = [
  // === HOME PAGE ===
  {
    pageId: 'home', type: 'hero',
    content: {
      subtitle: 'TİCARET HUKUKU DANIŞMANLIĞI',
      title: 'Ticari hayatınıza\ngüçlü hukuki\ndestek.',
      description: 'Türkiye\'nin önde gelen şirketlerine, finansal kurumlarına ve uluslararası yatırımcılarına ticaret hukuku alanında kapsamlı ve stratejik danışmanlık sunuyoruz.',
      buttonText: 'Uzmanlık Alanlarımız', buttonLink: '/category/all',
      button2Text: 'İletişim', button2Link: '/contact',
      backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2600&auto=format&fit=crop',
    },
  },
  {
    pageId: 'home', type: 'stats',
    content: {
      items: [
        { number: '25+', label: 'Yıllık Deneyim' },
        { number: '500+', label: 'Başarılı Dava' },
        { number: '120+', label: 'Kurumsal Müvekkil' },
        { number: '15+', label: 'Uzmanlık Alanı' },
      ],
    },
  },
  {
    pageId: 'home', type: 'practice_areas',
    content: {
      title: 'Uzmanlık Alanlarımız',
      areas: [
        { icon: 'Briefcase', title: 'Ticaret Hukuku', description: 'Şirketler hukuku, sözleşmeler ve ticari uyuşmazlıklar' },
        { icon: 'Building2', title: 'Birleşme & Devralmalar', description: 'Şirket birleşmeleri, bölünmeleri ve devralma süreçleri' },
        { icon: 'Landmark', title: 'Bankacılık & Finans', description: 'Bankacılık düzenlemeleri ve finansal işlem danışmanlığı' },
        { icon: 'Globe', title: 'Uluslararası Tahkim', description: 'Uluslararası ticari uyuşmazlık çözüm mekanizmaları' },
        { icon: 'Scale', title: 'Rekabet Hukuku', description: 'Rekabet mevzuatı uyumu ve soruşturma süreçleri' },
        { icon: 'Shield', title: 'Fikri Mülkiyet', description: 'Marka, patent ve telif hakları koruması' },
      ],
    },
  },
  {
    pageId: 'home', type: 'about_text',
    content: {
      title: 'Ticaret hukuku alanında güvenilir danışmanlık',
      content: 'Ticaret hukuku alanında uzmanlaşmış ekibimiz, yurt içi ve yurt dışı ticari işlemlerinizde, sözleşme müzakerelerinizde ve uyuşmazlık çözüm süreçlerinizde yanınızda olmaya devam etmektedir.',
      buttonText: 'Bizi Tanıyın', buttonLink: '/about',
      subItems: [
        { title: 'Şirketler Hukuku', description: 'Kuruluş, tescil ve yönetim kurulu danışmanlığı' },
        { title: 'Sözleşme Hukuku', description: 'Ticari sözleşmelerin hazırlanması ve müzakeresi' },
        { title: 'İcra & İflas', description: 'Alacak takibi ve iflas süreç yönetimi' },
        { title: 'Dış Ticaret', description: 'Uluslararası ticaret ve gümrük mevzuatı' },
      ],
    },
  },
  {
    pageId: 'home', type: 'featured_posts',
    content: { title: 'Güncel Yayınlar', subtitle: 'Son hukuki analiz ve değerlendirmelerimiz', count: 6 },
  },

  // === ABOUT PAGE ===
  {
    pageId: 'about', type: 'custom_html',
    content: {
      title: 'Hakkımızda',
      content: 'Ticaret hukuku alanında uzmanlaşmış ekibimiz, yurt içi ve uluslararası ticari işlemlerde şirketlere kapsamlı hukuki danışmanlık sunmaktadır.\n\nBirleşme ve devralmalar, bankacılık ve finans hukuku, rekabet hukuku, fikri mülkiyet hakları, uluslararası tahkim ve uyuşmazlık çözümü başta olmak üzere pek çok alanda hizmet vermekteyiz.',
      bgColor: 'white',
    },
  },
  {
    pageId: 'about', type: 'stats',
    content: {
      items: [
        { number: '25+', label: 'Yıllık Deneyim' },
        { number: '500+', label: 'Başarılı Dava' },
        { number: '120+', label: 'Kurumsal Müvekkil' },
        { number: '15+', label: 'Uzmanlık Alanı' },
      ],
    },
  },
  {
    pageId: 'about', type: 'cta_banner',
    content: {
      title: 'İletişime Geçin',
      description: 'Hukuki danışmanlık ihtiyaçlarınız için bizimle iletişime geçebilirsiniz.',
      buttonText: 'İletişim', buttonLink: '/contact', bgColor: 'navy',
    },
  },

  // === CONTACT PAGE ===
  {
    pageId: 'contact', type: 'contact_info',
    content: {
      address: 'Levent Mah. Büyükdere Cad.\nNo: 100, Kat: 12\n34394 Beşiktaş / İstanbul',
      phone: '+90 (212) 555 00 00',
      email: 'info@legalinsights.com',
      hours: 'Pazartesi - Cuma: 09:00 - 18:00',
    },
  },
  {
    pageId: 'contact', type: 'contact_form',
    content: { title: 'Mesaj Gönderin', description: 'Formu doldurarak bize ulaşabilirsiniz.' },
  },
];

async function seed() {
  // Check if sections already exist
  const count = await prisma.pageSection.count();
  if (count > 0) {
    console.log(`Already have ${count} sections. Skipping seed.`);
    return;
  }

  console.log('Seeding default page sections...');
  
  for (let i = 0; i < DEFAULTS.length; i++) {
    const d = DEFAULTS[i];
    await prisma.pageSection.create({
      data: {
        pageId: d.pageId,
        type: d.type,
        order: i,
        isVisible: true,
        content: JSON.stringify(d.content),
      },
    });
    console.log(`  ✓ ${d.pageId}/${d.type}`);
  }

  console.log(`Done! Seeded ${DEFAULTS.length} sections.`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
