import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { canonicalOriginFromSiteMap, fetchSiteSettingsForMetadata } from '@/lib/global-metadata';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await fetchSiteSettingsForMetadata();
  const baseUrl = canonicalOriginFromSiteMap(site);
  const locales = ['tr', 'en'];

  // Base routes for both languages
  const staticPages = ['', '/about', '/contact', '/search'];
  const routes: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      routes.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'monthly',
        priority: page === '' ? 1 : 0.8,
        alternates: {
          languages: {
            tr: `${baseUrl}/tr${page}`,
            en: `${baseUrl}/en${page}`,
          },
        },
      });
    }
  }

  // Published posts
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true, locale: true, translationOfId: true, translations: { select: { slug: true, locale: true } } },
  });

  for (const post of posts) {
    const altPost = post.translations?.[0];
    const altLang = post.locale === 'tr' ? 'en' : 'tr';

    routes.push({
      url: `${baseUrl}/${post.locale}/article/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: altPost ? {
        languages: {
          [post.locale]: `${baseUrl}/${post.locale}/article/${post.slug}`,
          [altLang]: `${baseUrl}/${altLang}/article/${altPost.slug}`,
        },
      } : undefined,
    });
  }

  // Categories (both languages)
  const categories = await prisma.category.findMany({
    select: { slug: true, updatedAt: true },
  });

  for (const locale of locales) {
    for (const cat of categories) {
      routes.push({
        url: `${baseUrl}/${locale}/category/${cat.slug}`,
        lastModified: cat.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: {
            tr: `${baseUrl}/tr/category/${cat.slug}`,
            en: `${baseUrl}/en/category/${cat.slug}`,
          },
        },
      });
    }
  }

  return routes;
}
