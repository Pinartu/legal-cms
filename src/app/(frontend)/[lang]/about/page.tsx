import { prisma } from '@/lib/prisma';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { Locale, t } from '@/lib/i18n';

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  const sections = await prisma.pageSection.findMany({
    where: { pageId: 'about' },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#1a2332] pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block w-12 h-[2px] bg-[#b8860b] mb-6"></span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">{t(locale, 'page.about')}</h1>
          <p className="text-white/50 text-lg max-w-2xl">{t(locale, 'page.about_desc')}</p>
        </div>
      </div>
      <SectionRenderer sections={sections} lang={locale} />
    </div>
  );
}
