import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.customPage.findUnique({ where: { slug } });

  if (!page) return {};

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || undefined,
  };
}

export default async function CustomPageRoute({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = lang as Locale;

  // Find page by slug and filter by locale
  const page = await prisma.customPage.findFirst({
    where: {
      slug,
      locale,
      isPublished: true,
    },
  });

  // Fallback: try finding page by slug only (for pages without locale-specific version)
  const fallbackPage = page || await prisma.customPage.findFirst({
    where: {
      slug,
      isPublished: true,
    },
  });

  if (!fallbackPage) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fbfbfb]">
      {/* Header spacer */}
      <div className="h-24" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-serif font-bold text-[#1a2332] mb-8">{fallbackPage.title}</h1>
        <div
          className="prose prose-lg max-w-none text-[#334155]
            prose-headings:text-[#1a2332] prose-headings:font-serif
            prose-a:text-[#b8860b] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#1a2332]"
          dangerouslySetInnerHTML={{ __html: fallbackPage.content }}
        />
      </div>
    </div>
  );
}
