import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, Calendar, Scale, Newspaper, Share2, ExternalLink, BookOpen } from 'lucide-react';
import { Locale, t } from '@/lib/i18n';
import { Suspense } from 'react';
import CategoryFilterTabs from '@/components/post/CategoryFilterTabs';

type Post = {
  id: string;
  title: string;
  slug: string;
  postType: string;
  sourceUrl: string | null;
  sourcePlatform: string | null;
  sourceTitle: string | null;
  sourceExcerpt: string | null;
  sourceAuthor: string | null;
  sourceImageUrl: string | null;
  sourceDate: string | null;
  legalDocType: string | null;
  legalJurisdiction: string | null;
  legalRefNumber: string | null;
  metaDescription: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
};

// ── Social Post Card ────────────────────────────────────────────────────────
function SocialCard({ post, lang }: { post: Post; lang: string }) {
  const platform = (post.sourcePlatform || 'other').toLowerCase();
  const PLATFORM_COLORS: Record<string, string> = {
    twitter:   'bg-black text-white',
    instagram: 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white',
    linkedin:  'bg-[#0077b5] text-white',
    facebook:  'bg-[#1877f2] text-white',
    tiktok:    'bg-black text-white',
    youtube:   'bg-[#ff0000] text-white',
  };
  const platformColor = PLATFORM_COLORS[platform] || 'bg-slate-700 text-white';
  const platformLabel: Record<string, string> = {
    twitter: 'X / Twitter', instagram: 'Instagram', linkedin: 'LinkedIn',
    facebook: 'Facebook', tiktok: 'TikTok', youtube: 'YouTube',
  };

  return (
    <div className="group bg-white border border-zinc-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
      {/* Platform strip */}
      <div className={`flex items-center gap-2 px-4 py-2 text-xs font-bold ${platformColor}`}>
        <Share2 className="w-3.5 h-3.5 flex-shrink-0" />
        {platformLabel[platform] || 'Sosyal Medya'}
        {post.sourceDate && <span className="ml-auto opacity-70">{post.sourceDate}</span>}
      </div>

      {/* Image or placeholder */}
      <div className="relative overflow-hidden bg-zinc-100 aspect-[16/7] flex-shrink-0">
        {post.sourceImageUrl ? (
          <img
            src={post.sourceImageUrl}
            alt={post.sourceTitle || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
            <Share2 className="w-10 h-10 text-purple-300" />
          </div>
        )}
        {post.sourceAuthor && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 px-4 py-2">
            <span className="text-white text-xs font-semibold">{post.sourceAuthor}</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col">
        {post.sourceTitle && (
          <p className="text-sm text-zinc-500 italic line-clamp-2 mb-3 leading-relaxed">
            "{post.sourceTitle}"
          </p>
        )}
        <h3 className="font-serif font-bold text-[#1a2332] text-base leading-snug mb-auto group-hover:text-purple-700 transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
          {post.publishedAt && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Calendar className="w-3 h-3" />
              {post.publishedAt.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
          <Link
            href={`/${lang}/article/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors ml-auto"
          >
            Analizi Oku <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── News Card ───────────────────────────────────────────────────────────────
function NewsCard({ post, lang }: { post: Post; lang: string }) {
  return (
    <div className="group bg-white border border-zinc-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden bg-zinc-100 aspect-[16/9] flex-shrink-0">
        {post.sourceImageUrl ? (
          <img
            src={post.sourceImageUrl}
            alt={post.sourceTitle || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <Newspaper className="w-10 h-10 text-blue-300" />
          </div>
        )}
        {post.sourceAuthor && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
              {post.sourceAuthor}
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 p-5 flex flex-col">
        {post.sourceDate && (
          <span className="flex items-center gap-1 text-xs text-zinc-400 mb-2">
            <Calendar className="w-3 h-3" />
            {post.sourceDate}
          </span>
        )}
        {post.sourceTitle && (
          <p className="text-base font-bold text-[#1a2332] leading-snug mb-2">
            {post.sourceTitle}
          </p>
        )}
        {post.sourceExcerpt && (
          <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed mb-3">
            {post.sourceExcerpt}
          </p>
        )}
        <div className="mt-auto pt-3 border-t border-zinc-100">
          <p className="text-xs text-zinc-400 mb-2">Hukuki Analiz:</p>
          <h3 className="font-serif font-bold text-[#1a2332] text-sm leading-snug group-hover:text-blue-700 transition-colors mb-3">
            {post.title}
          </h3>
          <div className="flex items-center gap-3">
            {post.sourceUrl && (
              <a
                href={post.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-3 h-3" /> Haber
              </a>
            )}
            <Link
              href={`/${lang}/article/${post.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors ml-auto"
            >
              Analizi Oku <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Legal Card ──────────────────────────────────────────────────────────────
const DOC_TYPE_LABELS: Record<string, string> = {
  kanun: 'Kanun', yönetmelik: 'Yönetmelik', tebliğ: 'Tebliğ',
  içtihat: 'İçtihat', karar: 'M. Kararı', genelge: 'Genelge',
  act: 'Act', regulation: 'Regulation', 'case-law': 'Case Law', directive: 'Direktif',
};

function LegalCard({ post, lang }: { post: Post; lang: string }) {
  const docTypeLabel = post.legalDocType
    ? (DOC_TYPE_LABELS[post.legalDocType.toLowerCase()] || post.legalDocType)
    : null;

  return (
    <Link
      href={`/${lang}/article/${post.slug}`}
      className="group flex items-start gap-4 py-6 border-b border-zinc-100 last:border-0 hover:bg-amber-50/30 px-2 -mx-2 transition-colors rounded-md"
    >
      <div className="w-10 h-10 rounded-full bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#b8860b]/20 transition-colors">
        <BookOpen className="w-5 h-5 text-[#b8860b]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {post.legalJurisdiction && (
            <span className="text-[10px] bg-[#1a2332] text-white font-bold px-2 py-0.5">
              {post.legalJurisdiction}
            </span>
          )}
          {docTypeLabel && (
            <span className="text-[10px] bg-[#b8860b] text-white font-bold px-2 py-0.5">
              {docTypeLabel}
            </span>
          )}
          {post.legalRefNumber && (
            <span className="text-[10px] text-zinc-400 font-mono">
              {post.legalRefNumber}
            </span>
          )}
        </div>
        {post.sourceTitle && (
          <p className="text-sm font-bold text-zinc-700 mb-1 leading-snug">{post.sourceTitle}</p>
        )}
        <h3 className="font-serif font-semibold text-[#1a2332] text-base leading-snug group-hover:text-[#b8860b] transition-colors">
          {post.title}
        </h3>
        {(post.sourceExcerpt || post.metaDescription) && (
          <p className="text-sm text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed">
            {post.sourceExcerpt || post.metaDescription}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2">
          {post.publishedAt && (
            <span className="flex items-center gap-1 text-xs text-zinc-400">
              <Calendar className="w-3 h-3" />
              {post.publishedAt.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
          <span className="ml-auto flex items-center gap-1 text-xs font-bold text-[#b8860b] opacity-0 group-hover:opacity-100 transition-opacity">
            Analizi Oku <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Section wrapper ─────────────────────────────────────────────────────────
function SectionHeader({
  icon, title, subtitle, count, accentClass,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  count: number;
  accentClass: string;
}) {
  return (
    <div className={`flex items-start gap-4 mb-8 pb-6 border-b-2 ${accentClass}`}>
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#1a2332]">{title}</h2>
        {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      <span className="ml-auto self-center text-2xl font-bold text-zinc-200 tabular-nums">{count}</span>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; lang: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { slug: rawSlug, lang } = await params;
  const { type } = await searchParams;
  const locale = lang as Locale;
  const slug = decodeURIComponent(rawSlug);
  const isAll = slug === 'all';

  let category = !isAll ? await prisma.category.findUnique({ where: { slug } }) : null;

  // Eski Türkçe karakterli slug'lar için ASCII versiyonuna yönlendirme
  if (!isAll && !category) {
    const asciiSlug = slug
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').trim();

    if (asciiSlug !== slug) {
      const asciiCategory = await prisma.category.findUnique({ where: { slug: asciiSlug } });
      if (asciiCategory) {
        redirect(`/${lang}/category/${asciiSlug}`);
      }
    }
    notFound();
  }

  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      locale: lang,
      categoryId: isAll ? undefined : category?.id,
    },
    select: {
      id: true, title: true, slug: true, postType: true,
      sourceUrl: true, sourcePlatform: true, sourceTitle: true,
      sourceExcerpt: true, sourceAuthor: true, sourceImageUrl: true, sourceDate: true,
      legalDocType: true, legalJurisdiction: true, legalRefNumber: true,
      metaDescription: true, publishedAt: true,
      category: { select: { name: true, slug: true } },
    },
    orderBy: { publishedAt: 'desc' },
  });

  const allPosts = posts as Post[];
  const socialPosts = allPosts.filter((p: Post) => p.postType === 'SOCIAL');
  const newsPosts   = allPosts.filter((p: Post) => p.postType === 'NEWS');
  const legalPosts  = allPosts.filter((p: Post) => p.postType === 'LEGAL' || !p.postType);

  const showSocial = !type || type === 'SOCIAL';
  const showNews   = !type || type === 'NEWS';
  const showLegal  = !type || type === 'LEGAL';

  const counts = { all: allPosts.length, social: socialPosts.length, news: newsPosts.length, legal: legalPosts.length };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#1a2332] pt-36 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block w-12 h-[2px] bg-[#b8860b] mb-6" />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            {isAll ? t(locale, 'page.all_publications') : category?.name}
          </h1>
          {isAll && <p className="text-white/50 text-lg max-w-2xl">{t(locale, 'page.all_publications_desc')}</p>}
          {!isAll && category?.description && (
            <p className="text-white/50 text-lg max-w-2xl leading-relaxed">{category.description}</p>
          )}
          {/* Quick counts */}
          <div className="flex flex-wrap gap-4 mt-8">
            {socialPosts.length > 0 && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                {socialPosts.length} Sosyal Medya
              </div>
            )}
            {newsPosts.length > 0 && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                {newsPosts.length} Haber
              </div>
            )}
            {legalPosts.length > 0 && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <span className="w-2 h-2 rounded-full bg-[#b8860b]" />
                {legalPosts.length} Yasal İçerik
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={null}>
          <CategoryFilterTabs lang={lang} categorySlug={slug} counts={counts} />
        </Suspense>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {allPosts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-zinc-300 rounded-lg">
            <p className="text-zinc-400 font-serif text-xl mb-2">{t(locale, 'page.no_posts_category')}</p>
            <p className="text-zinc-400 text-sm">{t(locale, 'page.add_from_admin')}</p>
          </div>
        )}

        {/* ── SOCIAL section ─────────────────────────────────────── */}
        {showSocial && socialPosts.length > 0 && (
          <section>
            <SectionHeader
              icon={<Share2 className="w-6 h-6 text-purple-600" />}
              title="Sosyal Medyada Konuşulanlar"
              subtitle="Sosyal medya paylaşımları üzerine hukuki yorum ve analizler"
              count={socialPosts.length}
              accentClass="border-purple-200"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialPosts.map((post: Post) => (
                <SocialCard key={post.id} post={post} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {/* ── NEWS section ───────────────────────────────────────── */}
        {showNews && newsPosts.length > 0 && (
          <section>
            <SectionHeader
              icon={<Newspaper className="w-6 h-6 text-blue-600" />}
              title="Güncel Haberler"
              subtitle="Önemli haberler ve hukuki değerlendirmeler"
              count={newsPosts.length}
              accentClass="border-blue-200"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsPosts.map((post: Post) => (
                <NewsCard key={post.id} post={post} lang={lang} />
              ))}
            </div>
          </section>
        )}

        {/* ── LEGAL section ──────────────────────────────────────── */}
        {showLegal && legalPosts.length > 0 && (
          <section>
            <SectionHeader
              icon={<Scale className="w-6 h-6 text-[#b8860b]" />}
              title="Yasal İçerikler"
              subtitle="Kanun, yönetmelik, içtihat ve hukuki belge analizleri"
              count={legalPosts.length}
              accentClass="border-[#b8860b]/30"
            />
            <div className="bg-[#fdf9f0] border border-[#b8860b]/20 rounded-lg px-6 divide-y divide-zinc-100">
              {legalPosts.map((post: Post) => (
                <LegalCard key={post.id} post={post} lang={lang} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
