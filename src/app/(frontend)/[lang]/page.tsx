import { prisma } from '@/lib/prisma';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { Locale } from '@/lib/i18n';

// ISR: revalidate every 60 seconds as a fallback.
// On-demand revalidation from admin API provides instant updates.
export const revalidate = 60;

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;

  const sections = await prisma.pageSection.findMany({
    where: { pageId: 'home' },
    orderBy: { order: 'asc' },
  });

  const posts = await prisma.post.findMany({
    where: { isPublished: true, locale: lang },
    include: {
      category: true,
      author: { select: { name: true, profileImage: true } }
    },
    orderBy: { publishedAt: 'desc' },
    take: 6
  });

  return (
    <div className="bg-white">
      <SectionRenderer sections={sections} posts={posts} lang={locale} />
    </div>
  );
}
