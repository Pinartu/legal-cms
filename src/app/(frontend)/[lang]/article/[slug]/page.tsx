import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import { Locale, t } from '@/lib/i18n';
import SocialPostBlock from '@/components/post/SocialPostBlock';
import NewsSourceBlock from '@/components/post/NewsSourceBlock';
import LegalReferenceBlock from '@/components/post/LegalReferenceBlock';

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
  const { slug, lang } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { translations: true, translationOf: true, author: true, category: true },
  });
  if (!post) return { title: 'Not Found' };

  const altLang = lang === 'tr' ? 'en' : 'tr';
  const altPost = post.translations?.[0] || post.translationOf;
  const baseUrl = 'https://legalinsights.example.com';

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.title,
    alternates: {
      canonical: post.canonicalUrl || `${baseUrl}/${lang}/article/${slug}`,
      languages: altPost ? { [altLang]: `/${altLang}/article/${altPost.slug}` } : undefined,
    },
    openGraph: {
      type: 'article',
      locale: lang === 'tr' ? 'tr_TR' : 'en_US',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.title,
      url: `${baseUrl}/${lang}/article/${slug}`,
      siteName: 'LegalInsights',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [post.author?.name || ''],
      section: post.category?.name || 'Hukuk',
      ...((post.coverImageUrl || post.sourceImageUrl) && {
        images: [{ url: (post.coverImageUrl || post.sourceImageUrl)!.startsWith('/') ? `${baseUrl}${post.coverImageUrl || post.sourceImageUrl}` : (post.coverImageUrl || post.sourceImageUrl)! }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.title,
      ...((post.coverImageUrl || post.sourceImageUrl) && {
        images: [(post.coverImageUrl || post.sourceImageUrl)!.startsWith('/') ? `${baseUrl}${post.coverImageUrl || post.sourceImageUrl}` : (post.coverImageUrl || post.sourceImageUrl)!],
      }),
    },
  };
}

const POST_TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  LEGAL:  { label: 'Yasal İçerik',  cls: 'bg-[#b8860b]/20 text-[#b8860b]' },
  NEWS:   { label: 'Haber Analizi', cls: 'bg-blue-500/20 text-blue-300' },
  SOCIAL: { label: 'Sosyal Medya',  cls: 'bg-purple-500/20 text-purple-300' },
};

export default async function ArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; lang: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug, lang } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';
  const locale = lang as Locale;

  const post = await prisma.post.findUnique({
    where: { slug, ...(isPreview ? {} : { isPublished: true }) },
    include: { author: true, category: true, tags: true, faqs: true, translations: true, translationOf: true },
  });
  if (!post) notFound();

  const altPost = post.translations?.[0] || post.translationOf;
  const baseUrl = 'https://legalinsights.example.com';

  const postType = (post.postType || 'LEGAL') as string;
  const typeBadge = POST_TYPE_BADGE[postType] || POST_TYPE_BADGE.LEGAL;

  // JSON-LD: Article
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': postType === 'NEWS' ? 'NewsArticle' : 'Article',
    headline: post.title,
    description: post.metaDescription || post.title,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: { '@type': 'Person', name: post.author?.name || 'Unknown' },
    publisher: { '@type': 'Organization', name: 'LegalInsights', url: baseUrl },
    mainEntityOfPage: `${baseUrl}/${lang}/article/${slug}`,
    inLanguage: lang === 'tr' ? 'tr-TR' : 'en-US',
    ...(post.category && { articleSection: post.category.name }),
    // NewsArticle-specific
    ...(postType === 'NEWS' && post.sourceUrl && {
      isBasedOn: { '@type': 'NewsArticle', url: post.sourceUrl, name: post.sourceTitle || undefined },
    }),
  };

  const faqSchema = post.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faqs.map((faq: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: lang === 'tr' ? 'Ana Sayfa' : 'Home', item: `${baseUrl}/${lang}` },
      ...(post.category ? [{ '@type': 'ListItem', position: 2, name: post.category.name, item: `${baseUrl}/${lang}/category/${post.category.slug}` }] : []),
      { '@type': 'ListItem', position: post.category ? 3 : 2, name: post.title },
    ],
  };

  // Check if source block has meaningful content
  const hasSourceContent = !!(post.sourceUrl || post.embedCode || post.sourceTitle || post.legalPdfUrl);

  // Commentary heading by type
  const commentaryHeading = postType === 'NEWS'   ? (lang === 'tr' ? 'Hukuki Analiz' : 'Legal Analysis')
                          : postType === 'SOCIAL' ? (lang === 'tr' ? 'Hukuki Yorum' : 'Legal Commentary')
                          : null;

  return (
    <article className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* ── Draft preview banner ─────────────────────────────────── */}
      {isPreview && !post.isPublished && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-amber-400 text-amber-900 text-center text-sm font-semibold py-2 px-4 flex items-center justify-center gap-3">
          <span>⚠ TASLAK ÖNİZLEME — Bu yazı henüz yayınlanmamıştır.</span>
          <a href="/admin/posts" className="underline hover:no-underline">Admin Paneline Dön</a>
        </div>
      )}

      {/* ── Article header ──────────────────────────────────────── */}
      <div className="bg-[#1a2332] pt-36 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-white/40 hover:text-[#b8860b] transition-colors text-sm mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t(locale, 'page.back_home')}
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Post type badge */}
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 ${typeBadge.cls}`}>
              {typeBadge.label}
            </span>
            {post.category && (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b] bg-[#b8860b]/10 px-3 py-1">
                {post.category.name}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <Calendar className="w-3 h-3" />
              {post.publishedAt?.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            {altPost && (
              <Link
                href={`/${lang === 'tr' ? 'en' : 'tr'}/article/${altPost.slug}`}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border border-white/20 px-3 py-1 hover:text-[#b8860b] hover:border-[#b8860b] transition-colors"
              >
                {lang === 'tr' ? 'EN' : 'TR'}
              </Link>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-8">
            {post.title}
          </h1>
          {post.author?.name && (
            <div className="flex items-center gap-3 text-sm text-white/50">
              <User className="w-4 h-4" />
              <span><strong className="font-semibold text-white/80">{post.author.name}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* ── Meta bar (mobile-friendly, under header) ────────────── */}
      <div className="border-b border-zinc-100 bg-[#fdf9f0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {post.author?.name && (
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-700 font-medium">{post.author.name}</span>
              </div>
            )}
            {post.category && (
              <Link
                href={`/${lang}/category/${post.category.slug}`}
                className="text-[#b8860b] font-medium hover:text-[#d4a843] transition-colors"
              >
                {post.category.name}
              </Link>
            )}
            <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider ${
              postType === 'LEGAL'  ? 'bg-amber-100 text-amber-800' :
              postType === 'NEWS'   ? 'bg-blue-100 text-blue-800' :
                                      'bg-purple-100 text-purple-800'
            }`}>
              {typeBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* ── Cover image ─────────────────────────────────────────── */}
      {post.coverImageUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-6 relative z-10">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        </div>
      )}

      {/* ── Content area (single column, max-w-3xl for readability) ─── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">

        {/* Commentary / main content — article body first */}
        {post.showCommentary && post.content && (
          <div className="mb-12">
            {commentaryHeading && (
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block w-8 h-[2px] bg-[#b8860b]" />
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8860b]">
                  {commentaryHeading}
                </h2>
              </div>
            )}
            <div
              className="article-content prose prose-zinc prose-base sm:prose-lg max-w-none leading-relaxed
                prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#1a2332] prose-headings:leading-tight prose-headings:mt-10 prose-headings:mb-4
                prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:border-b prose-h2:border-zinc-200 prose-h2:pb-3
                prose-h3:text-xl sm:prose-h3:text-2xl
                prose-p:text-zinc-600 prose-p:mb-5
                prose-a:text-[#b8860b] prose-a:font-medium prose-a:underline-offset-2 hover:prose-a:text-[#d4a843]
                prose-blockquote:border-l-4 prose-blockquote:border-[#b8860b] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-[#f8f6f2] prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:rounded-r
                prose-strong:text-[#1a2332] prose-strong:font-bold
                prose-li:text-zinc-600 prose-li:marker:text-[#b8860b]
                prose-img:rounded-lg prose-img:shadow-md
                prose-table:border prose-table:border-zinc-200 prose-th:bg-zinc-50 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        )}

        {/* Source / reference block — after article content */}
        {post.showSourceBlock && hasSourceContent && (
          <div className="mb-10">
            {postType === 'SOCIAL' && (
              <SocialPostBlock
                sourceUrl={post.sourceUrl}
                sourcePlatform={post.sourcePlatform}
                embedCode={post.embedCode}
                sourceTitle={post.sourceTitle}
                sourceExcerpt={post.sourceExcerpt}
                sourceAuthor={post.sourceAuthor}
                sourceImageUrl={post.sourceImageUrl}
                sourceDate={post.sourceDate}
              />
            )}
            {postType === 'NEWS' && (
              <NewsSourceBlock
                sourceUrl={post.sourceUrl}
                sourceTitle={post.sourceTitle}
                sourceExcerpt={post.sourceExcerpt}
                sourceAuthor={post.sourceAuthor}
                sourceImageUrl={post.sourceImageUrl}
                sourceDate={post.sourceDate}
              />
            )}
            {postType === 'LEGAL' && (
              <LegalReferenceBlock
                sourceUrl={post.sourceUrl}
                sourceTitle={post.sourceTitle}
                sourceExcerpt={post.sourceExcerpt}
                sourceAuthor={post.sourceAuthor}
                sourceDate={post.sourceDate}
                legalDocType={post.legalDocType}
                legalJurisdiction={post.legalJurisdiction}
                legalRefNumber={post.legalRefNumber}
                legalPdfUrl={post.legalPdfUrl}
                legalPdfTitle={post.legalPdfTitle}
              />
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="pt-8 border-t border-zinc-200 flex flex-wrap gap-2 items-center mb-10">
            <Tag className="w-4 h-4 text-zinc-400 mr-1" />
            {post.tags.map((tag: { id: string; name: string }) => (
              <span key={tag.id} className="bg-[#f8f6f2] border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-[#b8860b]/50 transition-colors">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* FAQs */}
        {post.faqs.length > 0 && (
          <div className="pt-8 border-t border-zinc-200">
            <h3 className="text-2xl font-serif font-bold text-[#1a2332] mb-8">{t(locale, 'page.faq')}</h3>
            <div className="space-y-4">
              {post.faqs.map((faq: { id: string; question: string; answer: string }) => (
                <details key={faq.id} className="group border border-zinc-200 rounded-lg overflow-hidden">
                  <summary className="flex items-center justify-between cursor-pointer p-5 bg-white hover:bg-zinc-50 transition-colors">
                    <h4 className="text-base font-semibold text-[#1a2332] pr-4">{faq.question}</h4>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#f8f6f2] flex items-center justify-center text-zinc-400 group-open:rotate-180 transition-transform">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-zinc-500 text-sm leading-relaxed border-t border-zinc-100 pt-4">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
