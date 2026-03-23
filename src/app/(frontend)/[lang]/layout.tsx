import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { prisma } from '@/lib/prisma';
import { Locale, SUPPORTED_LOCALES } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  if (!SUPPORTED_LOCALES.includes(lang as Locale)) {
    notFound();
  }

  const locale = lang as Locale;

  const categories = await prisma.category.findMany({
    take: 5,
    orderBy: { name: 'asc' }
  });

  // Fetch site settings for Header & Footer
  const allSettings = await prisma.siteContent.findMany();
  const siteSettings: Record<string, string> = {};
  allSettings.forEach((s: any) => { siteSettings[s.key] = s.value; });

  // Fetch header links from DB
  const headerLinks = await prisma.headerLink.findMany({
    where: { locale },
    orderBy: { order: 'asc' },
  });

  // Fetch footer links from DB (filtered by locale)
  const footerLinks = await prisma.footerLink.findMany({
    where: { locale },
    orderBy: [{ column: 'asc' }, { order: 'asc' }],
  });

  const disclaimerVisible = siteSettings.disclaimer_visible !== 'false';

  // Disclaimer CMS text (locale-aware with fallback to i18n)
  const disclaimerTitle = locale === 'en'
    ? (siteSettings.disclaimer_title_en || undefined)
    : (siteSettings.disclaimer_title_tr || undefined);
  const disclaimerText = locale === 'en'
    ? (siteSettings.disclaimer_text_en || undefined)
    : (siteSettings.disclaimer_text_tr || undefined);

  return (
    <>
      <Header categories={categories} lang={locale} siteSettings={siteSettings} headerLinks={headerLinks} />
      <DisclaimerBanner
        lang={locale}
        visible={disclaimerVisible}
        title={disclaimerTitle}
        text={disclaimerText}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer lang={locale} siteSettings={siteSettings} footerLinks={footerLinks} />
    </>
  );
}
