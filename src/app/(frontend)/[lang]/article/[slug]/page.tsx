import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, User } from 'lucide-react';
import { Locale, t } from '@/lib/i18n';

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
  const { slug: rawSlug, lang } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await prisma.post.findUnique({ where: { slug }, include: { translations: true, translationOf: true, author: true, category: true } });
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
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.title,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug: rawSlug, lang } = await params;
  const slug = decodeURIComponent(rawSlug);
  const locale = lang as Locale;

  const post = await prisma.post.findUnique({
    where: { slug, isPublished: true },
    include: { author: true, category: true, tags: true, faqs: true, translations: true, translationOf: true },
  });
  if (!post) notFound();

  const altPost = post.translations?.[0] || post.translationOf;
  const baseUrl = 'https://legalinsights.example.com';

  // Article JSON-LD schema
  const articleSchema = {
    "@context": "https://schema.org", "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription || post.title,
    "datePublished": post.publishedAt?.toISOString(),
    "dateModified": post.updatedAt?.toISOString(),
    "author": { "@type": "Person", "name": post.author.name },
    "publisher": { "@type": "Organization", "name": "LegalInsights", "url": baseUrl },
    "mainEntityOfPage": `${baseUrl}/${lang}/article/${slug}`,
    "inLanguage": lang === 'tr' ? 'tr-TR' : 'en-US',
    ...(post.category && { "articleSection": post.category.name }),
  };

  const faqSchema = post.faqs.length > 0 ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": post.faqs.map((faq: any) => ({ "@type": "Question", "name": faq.question, "acceptedAnswer": { "@type": "Answer", "text": faq.answer } }))
  } : null;
  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": lang === 'tr' ? 'Ana Sayfa' : 'Home', "item": `${baseUrl}/${lang}` },
      ...(post.category ? [{ "@type": "ListItem", "position": 2, "name": post.category.name, "item": `${baseUrl}/${lang}/category/${post.category.slug}` }] : []),
      { "@type": "ListItem", "position": post.category ? 3 : 2, "name": post.title },
    ],
  };

  return (
    <article className="bg-white min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <div className="bg-[#1a2332] pt-36 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-white/40 hover:text-[#b8860b] transition-colors text-sm mb-8 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t(locale, 'page.back_home')}
          </Link>
          <div className="flex items-center gap-4 mb-6">
            {post.category && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b] bg-[#b8860b]/10 px-3 py-1">{post.category.name}</span>}
            <span className="flex items-center gap-1.5 text-xs text-white/40"><Calendar className="w-3 h-3" />{post.publishedAt?.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            {altPost && (
              <Link href={`/${lang === 'tr' ? 'en' : 'tr'}/article/${altPost.slug}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 border border-white/20 px-3 py-1 hover:text-[#b8860b] hover:border-[#b8860b] transition-colors">
                {lang === 'tr' ? 'EN' : 'TR'}
              </Link>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-8">{post.title}</h1>
          <div className="flex items-center gap-3 text-sm text-white/50"><User className="w-4 h-4" /><span><strong className="font-semibold text-white/80">{post.author.name}</strong></span></div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-9">
            <div className="prose prose-lg max-w-none text-zinc-600 leading-relaxed prose-headings:font-serif prose-headings:font-bold prose-headings:text-[#1a2332] prose-a:text-[#b8860b] prose-blockquote:border-l-4 prose-blockquote:border-[#b8860b] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-[#f8f6f2] prose-blockquote:py-4 prose-blockquote:pr-4" dangerouslySetInnerHTML={{ __html: post.content }} />
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-zinc-200 flex flex-wrap gap-2 items-center">
                <Tag className="w-4 h-4 text-zinc-400 mr-1" />
                {post.tags.map((tag: any) => <span key={tag.id} className="bg-[#f8f6f2] border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600">{tag.name}</span>)}
              </div>
            )}
            {post.faqs.length > 0 && (
              <div className="mt-12 pt-8 border-t border-zinc-200">
                <h3 className="text-2xl font-serif font-bold text-[#1a2332] mb-8">{t(locale, 'page.faq')}</h3>
                <div className="space-y-6">{post.faqs.map((faq: any) => (<div key={faq.id} className="border border-zinc-200 p-6"><h4 className="text-base font-semibold text-[#1a2332] mb-2">{faq.question}</h4><p className="text-zinc-500 text-sm leading-relaxed">{faq.answer}</p></div>))}</div>
              </div>
            )}
          </div>
          <aside className="lg:col-span-3">
            <div className="sticky top-28">
              <div className="bg-[#f8f6f2] p-6 border-l-2 border-[#b8860b] mb-6"><h4 className="text-sm font-bold text-[#1a2332] uppercase tracking-wider mb-3">{t(locale, 'page.author')}</h4><p className="text-zinc-600 text-sm font-medium">{post.author.name}</p></div>
              {post.category && (<div className="bg-[#f8f6f2] p-6 border-l-2 border-[#b8860b]"><h4 className="text-sm font-bold text-[#1a2332] uppercase tracking-wider mb-3">{t(locale, 'page.category')}</h4><Link href={`/${lang}/category/${post.category.slug}`} className="text-[#b8860b] text-sm font-medium hover:text-[#d4a843] transition-colors">{post.category.name}</Link></div>)}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
