import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Search as SearchIcon, Calendar } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Locale, t } from '@/lib/i18n';

export default async function SearchPage({ params, searchParams: sp }: { params: Promise<{ lang: string }>; searchParams: Promise<{ q?: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const searchParams = await sp;
  const q = searchParams?.q || '';

  const posts = q ? await prisma.post.findMany({
    where: { isPublished: true, locale: lang, OR: [{ title: { contains: q } }, { content: { contains: q } }, { metaDescription: { contains: q } }] },
    include: { category: true, author: true },
    orderBy: { publishedAt: 'desc' },
  }) : [];

  async function searchAction(formData: FormData) {
    "use server";
    const query = formData.get('q');
    const l = formData.get('lang') || 'tr';
    if (query) redirect(`/${l}/search?q=${encodeURIComponent(query.toString())}`);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#1a2332] pt-36 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block w-12 h-[2px] bg-[#b8860b] mb-6"></span>
          <h1 className="text-4xl font-serif font-bold text-white mb-4 tracking-tight">{t(locale, 'page.search')}</h1>
          <p className="text-white/50 text-lg mb-10">{t(locale, 'page.search_desc')}</p>
          <form action={searchAction} className="relative flex items-center max-w-2xl mx-auto">
            <input type="hidden" name="lang" value={lang} />
            <SearchIcon className="absolute left-5 h-5 w-5 text-white/30" />
            <input type="text" name="q" defaultValue={q} placeholder={t(locale, 'page.search_placeholder')} required className="w-full pl-14 pr-32 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/30 focus:border-[#b8860b] focus:outline-none transition-colors text-base" />
            <button type="submit" className="absolute right-2 px-6 py-2.5 bg-[#b8860b] text-white font-semibold text-sm uppercase tracking-wider hover:bg-[#d4a843] transition-colors">{t(locale, 'page.search_button')}</button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {q && <div className="mb-10 pb-4 border-b border-zinc-200"><h2 className="text-lg text-zinc-600"><span className="font-semibold text-[#1a2332]">"{q}"</span> {t(locale, 'page.results_for')} {posts.length} {t(locale, 'page.results_found')}</h2></div>}
        {q && posts.length > 0 && (
          <div className="space-y-0 divide-y divide-zinc-100">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/${lang}/article/${post.slug}`} className="group block py-8 first:pt-0">
                <div className="flex items-center gap-4 mb-3">
                  {post.category && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b]">{post.category.name}</span>}
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400"><Calendar className="w-3 h-3" />{post.publishedAt?.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-[#1a2332] group-hover:text-[#b8860b] transition-colors mb-2">{post.title}</h3>
                <p className="text-sm text-zinc-500 line-clamp-2 max-w-3xl">{post.metaDescription || ""}</p>
              </Link>
            ))}
          </div>
        )}
        {q && posts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-300">
            <p className="text-zinc-400 font-serif text-xl mb-2">{t(locale, 'page.no_results')}</p>
            <p className="text-zinc-400 text-sm">{t(locale, 'page.no_results_hint')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
