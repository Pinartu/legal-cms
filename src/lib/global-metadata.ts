import type { Metadata } from 'next';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';

/** Keys read for root layout metadata + JSON-LD */
const METADATA_KEYS = [
  'site_title',
  'site_tagline_tr',
  'site_description',
  'site_og_image_url',
  'site_twitter_handle',
  'site_canonical_base_url',
  'contact_email',
  'contact_phone',
  'contact_address',
  'social_linkedin',
  'social_youtube',
  'social_x',
  'social_facebook',
] as const;

async function fetchSiteSettingsForMetadataUncached(): Promise<Record<string, string>> {
  const rows = await prisma.siteContent.findMany({
    where: { key: { in: [...METADATA_KEYS] } },
    select: { key: true, value: true },
  });
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

/** Deduped per request (layout + pages). */
export const fetchSiteSettingsForMetadata = cache(fetchSiteSettingsForMetadataUncached);

export function canonicalOriginFromSiteMap(site: Record<string, string>): string {
  return resolveBaseUrl(site.site_canonical_base_url).origin;
}

function resolveBaseUrl(raw: string | undefined): URL {
  const fallback = 'https://legalinsights.example.com';
  const s = raw?.trim();
  if (!s) return new URL(fallback);
  try {
    return new URL(s.replace(/\/$/, ''));
  } catch {
    return new URL(fallback);
  }
}

export function toAbsoluteFromBase(base: URL, pathOrUrl: string): string {
  const t = pathOrUrl.trim();
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  const path = t.startsWith('/') ? t : `/${t}`;
  return `${base.origin}${path}`;
}

export function buildRootMetadata(site: Record<string, string>): Metadata {
  const siteName = site.site_title?.trim() || 'LegalInsights';
  const tagline = site.site_tagline_tr?.trim() || 'Ticaret Hukuku Danışmanlığı';
  const defaultTitle = `${siteName} — ${tagline}`;
  const description =
    site.site_description?.trim() ||
    'Ticaret hukuku alanında kapsamlı ve stratejik hukuki danışmanlık. Şirketler hukuku, birleşme & devralmalar, bankacılık, rekabet hukuku uzmanları.';
  const base = resolveBaseUrl(site.site_canonical_base_url);
  const ogRaw = site.site_og_image_url?.trim();
  const ogImageAbs = ogRaw ? toAbsoluteFromBase(base, ogRaw) : null;
  const twitterHandle = site.site_twitter_handle?.trim().replace(/^@/, '') || '';

  return {
    metadataBase: base,
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      alternateLocale: ['en_US'],
      siteName: siteName,
      title: defaultTitle,
      description,
      url: base.origin,
      ...(ogImageAbs && {
        images: [{ url: ogImageAbs, width: 1200, height: 630, alt: defaultTitle }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description,
      ...(twitterHandle && { site: `@${twitterHandle}`, creator: `@${twitterHandle}` }),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function buildOrganizationJsonLd(site: Record<string, string>) {
  const base = resolveBaseUrl(site.site_canonical_base_url);
  const origin = base.origin;
  const name = site.site_title?.trim() || 'LegalInsights';
  const desc =
    site.site_description?.trim() ||
    'Ticaret hukuku alanında uzmanlaşmış, stratejik hukuki danışmanlık sunan bağımsız bir hukuk platformu.';
  const sameAs = [
    site.social_linkedin,
    site.social_youtube,
    site.social_x,
    site.social_facebook,
  ]
    .map((u) => u?.trim())
    .filter(Boolean) as string[];

  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name,
    description: desc,
    url: origin,
    logo: `${origin}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.contact_address?.split('\n')[0] || 'Levent Mah. Büyükdere Cad. No: 100, Kat: 12',
      addressLocality: 'Beşiktaş',
      addressRegion: 'İstanbul',
      postalCode: '34394',
      addressCountry: 'TR',
    },
    telephone: site.contact_phone?.trim() || '+90 (212) 555 00 00',
    email: site.contact_email?.trim() || 'info@legalinsights.com',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    areaServed: 'TR',
    priceRange: '$$$$',
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function buildWebSiteJsonLd(site: Record<string, string>) {
  const base = resolveBaseUrl(site.site_canonical_base_url);
  const origin = base.origin;
  const name = site.site_title?.trim() || 'LegalInsights';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: origin,
    inLanguage: ['tr-TR', 'en-US'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/tr/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
