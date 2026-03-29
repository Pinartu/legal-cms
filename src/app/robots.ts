import { MetadataRoute } from 'next';
import { canonicalOriginFromSiteMap, fetchSiteSettingsForMetadata } from '@/lib/global-metadata';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await fetchSiteSettingsForMetadata();
  const origin = canonicalOriginFromSiteMap(site);
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
