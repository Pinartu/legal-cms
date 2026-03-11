import Header from '@/components/Header';
import Footer from '@/components/Footer';
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

  return (
    <>
      <Header categories={categories} lang={locale} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer lang={locale} />
    </>
  );
}
