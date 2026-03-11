import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, ArrowRight } from 'lucide-react';
import { Locale, t } from '@/lib/i18n';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await params;
  const locale = lang as Locale;
  const isAll = slug === 'all';
  const category = !isAll ? await prisma.category.findUnique({ where: { slug } }) : null;
  if (!isAll && !category) notFound();

  const posts = await prisma.post.findMany({
    where: { isPublished: true, locale: lang, categoryId: isAll ? undefined : category?.id },
    include: { author: true, category: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#1a2332] pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block w-12 h-[2px] bg-[#b8860b] mb-6"></span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">{isAll ? t(locale, 'page.all_publications') : category?.name}</h1>
          {isAll && <p className="text-white/50 text-lg max-w-2xl">{t(locale, 'page.all_publications_desc')}</p>}
          {!isAll && category?.description && <p className="text-white/50 text-lg max-w-2xl leading-relaxed">{category.description}</p>}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length > 0 ? (
          <div className="space-y-0 divide-y divide-zinc-100">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/${lang}/article/${post.slug}`} className="group flex flex-col md:flex-row md:items-center justify-between py-8 first:pt-0 gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-4 mb-3">
                    {post.category && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b]">{post.category.name}</span>}
                    <span className="flex items-center gap-1.5 text-xs text-zinc-400"><Calendar className="w-3 h-3" />{post.publishedAt?.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-[#1a2332] group-hover:text-[#b8860b] transition-colors mb-2">{post.title}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 max-w-3xl">{post.metaDescription || ""}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-300 group-hover:text-[#b8860b] transition-colors flex-shrink-0 hidden md:block" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-zinc-300">
            <p className="text-zinc-400 font-serif text-xl mb-2">{t(locale, 'page.no_posts_category')}</p>
            <p className="text-zinc-400 text-sm">{t(locale, 'page.add_from_admin')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
