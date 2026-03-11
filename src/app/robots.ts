import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // We want search engines to index the frontend but keep out of the custom CMS admin panel
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://legalinsights.example.com/sitemap.xml',
  };
}
