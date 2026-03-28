import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import NewsletterForm from '@/components/NewsletterForm';

// Simple SVG icons for social media (avoid importing heavy icon libraries)
function LinkedInIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>; }
function YouTubeIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>; }
function XIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function FacebookIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>; }

interface FooterLinkData {
  id: string;
  label: string;
  url: string;
  column: string;
  order: number;
  openInNewTab: boolean;
}

const FOOTER_COLUMNS = [
  { key: 'explore', titleKey: 'footer.explore' },
  { key: 'publications', titleKey: 'footer.publications' },
];

// Default links when no CMS links are set
const DEFAULT_LINKS: Record<string, { label_tr: string; label_en: string; href: string }[]> = {
  explore: [
    { label_tr: 'Hakkımızda', label_en: 'About Us', href: '/about' },
    { label_tr: 'Uzmanlık Alanları', label_en: 'Practice Areas', href: '/category/all' },
    { label_tr: 'İletişim', label_en: 'Contact', href: '/contact' },
  ],
  publications: [
    { label_tr: 'Tüm Yayınlar', label_en: 'All Publications', href: '/search' },
    { label_tr: 'Hukuki Analizler', label_en: 'Legal Analyses', href: '/search' },
    { label_tr: 'Mevzuat Takibi', label_en: 'Legislation Tracking', href: '/search' },
  ],
};

export default function Footer({ lang = 'tr', siteSettings = {}, footerLinks = [] }: { lang?: Locale; siteSettings?: Record<string, string>; footerLinks?: FooterLinkData[] }) {
  // Read settings with fallback defaults
  const contactEmail = siteSettings.contact_email || 'info@legalinsights.com';
  const contactPhone = siteSettings.contact_phone || '+90 (212) 555 00 00';
  const contactAddress = siteSettings.contact_address || 'Levent Mah. Büyükdere Cad.\nNo: 100, Kat: 12\n34394 Beşiktaş / İstanbul';
  const siteTitle = siteSettings.site_title || 'LEGALINSIGHTS';
  
  // Use locale-specific footer description
  const footerDescription = lang === 'en'
    ? (siteSettings.footer_description_en || siteSettings.footer_description || "An independent legal platform providing strategic legal advisory to Turkey's leading corporations, specializing in commercial law.")
    : (siteSettings.footer_description || "Ticaret hukuku alanında uzmanlaşmış, Türkiye'nin önde gelen şirketlerine stratejik hukuki danışmanlık sunan bağımsız bir hukuk platformu.");

  const tagline = lang === 'en'
    ? (siteSettings.site_tagline_en || 'Commercial Law Advisory')
    : (siteSettings.site_tagline_tr || 'Ticaret Hukuku Danışmanlığı');
  const logoUrl = siteSettings.site_logo_url || '';

  // Parse logo text
  const logoMain = siteTitle.replace(/INSIGHTS|insights/i, '');
  const logoAccent = siteTitle.match(/INSIGHTS|insights/i)?.[0] || '';

  // Social links from settings
  const socialLinks = [
    { key: 'social_linkedin', url: siteSettings.social_linkedin, icon: LinkedInIcon, label: 'LinkedIn' },
    { key: 'social_youtube', url: siteSettings.social_youtube, icon: YouTubeIcon, label: 'YouTube' },
    { key: 'social_x', url: siteSettings.social_x, icon: XIcon, label: 'X' },
    { key: 'social_facebook', url: siteSettings.social_facebook, icon: FacebookIcon, label: 'Facebook' },
  ].filter(s => s.url);

  // Format address for display (support \n in settings)
  const addressLines = contactAddress.split('\n');

  // Group footer links by column. If no CMS links exist for a column, use defaults.
  const hasAnyLinks = footerLinks.length > 0;

  const getColumnLinks = (columnKey: string) => {
    const cmsLinks = footerLinks.filter(l => l.column === columnKey).sort((a, b) => a.order - b.order);
    if (cmsLinks.length > 0) return cmsLinks.map(l => ({ label: l.label, href: l.url, openInNewTab: l.openInNewTab }));
    if (hasAnyLinks) return []; // If CMS links exist for other columns, don't show defaults for this one
    // Fallback to defaults
    const defaults = DEFAULT_LINKS[columnKey] || [];
    return defaults.map(d => ({ label: lang === 'tr' ? d.label_tr : d.label_en, href: `/${lang}${d.href}`, openInNewTab: false }));
  };

  // Also support any additional custom columns from CMS
  const allColumns = [...FOOTER_COLUMNS.map(c => c.key)];
  const extraColumns = [...new Set(footerLinks.map(l => l.column))].filter(c => !allColumns.includes(c));

  return (
    <footer className="bg-[#1a2332] text-white">
      {/* Newsletter banner */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-white mb-1">{t(lang, 'footer.newsletter_title')}</h3>
              <p className="text-white/50 text-sm">{t(lang, 'footer.newsletter_desc')}</p>
            </div>
            <NewsletterForm lang={lang} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: Logo & Social */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              {logoUrl ? (
                <img src={logoUrl} alt={siteTitle} className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-8 h-8 border-2 border-[#b8860b] flex items-center justify-center"><span className="text-[#b8860b] font-serif text-lg font-bold">{siteTitle.charAt(0)}</span></div>
              )}
              <span className="text-white font-serif text-lg font-bold tracking-wide">{logoMain}<span className="font-light text-[#b8860b]">{logoAccent}</span></span>
            </div>
            {tagline && (
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-4 ml-11">{tagline}</p>
            )}
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              {footerDescription}
            </p>
            {/* Social Media Icons */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map(({ key, url, icon: Icon, label }) => (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="w-9 h-9 bg-white/10 flex items-center justify-center text-white/50 hover:bg-[#b8860b] hover:text-white transition-all">
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic link columns */}
          {FOOTER_COLUMNS.map(col => {
            const links = getColumnLinks(col.key);
            if (links.length === 0 && hasAnyLinks) return null;
            return (
              <div key={col.key}>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-6">{t(lang, col.titleKey)}</h4>
                <ul className="space-y-3">
                  {links.map((link, i) => (
                    <li key={i}>
                      {link.openInNewTab ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#b8860b] transition-colors text-sm flex items-center gap-2 group">
                          <span className="w-0 h-[1px] bg-[#b8860b] group-hover:w-3 transition-all" />{link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className="text-white/50 hover:text-[#b8860b] transition-colors text-sm flex items-center gap-2 group">
                          <span className="w-0 h-[1px] bg-[#b8860b] group-hover:w-3 transition-all" />{link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Extra custom columns from CMS */}
          {extraColumns.map(colKey => {
            const links = footerLinks.filter(l => l.column === colKey).sort((a, b) => a.order - b.order);
            return (
              <div key={colKey}>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-6">{colKey.replace(/_/g, ' ').toUpperCase()}</h4>
                <ul className="space-y-3">
                  {links.map(link => (
                    <li key={link.id}>
                      {link.openInNewTab ? (
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#b8860b] transition-colors text-sm flex items-center gap-2 group">
                          <span className="w-0 h-[1px] bg-[#b8860b] group-hover:w-3 transition-all" />{link.label}
                        </a>
                      ) : (
                        <Link href={link.url} className="text-white/50 hover:text-[#b8860b] transition-colors text-sm flex items-center gap-2 group">
                          <span className="w-0 h-[1px] bg-[#b8860b] group-hover:w-3 transition-all" />{link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-6">{t(lang, 'footer.contact')}</h4>
            <div className="space-y-4 text-sm text-white/50">
              <p>{addressLines.map((line, i) => <span key={i}>{line}{i < addressLines.length - 1 && <br />}</span>)}</p>
              <p><a href={`tel:${contactPhone.replace(/[\s()]/g, '')}`} className="hover:text-[#b8860b] transition-colors">{contactPhone}</a></p>
              <p><a href={`mailto:${contactEmail}`} className="hover:text-[#b8860b] transition-colors">{contactEmail}</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
            <span suppressHydrationWarning>© {new Date().getFullYear()} {siteTitle}. {t(lang, 'footer.all_rights')}.</span>
            <div className="flex items-center gap-6">
              <Link href={`/${lang}/about`} className="hover:text-white/60 transition-colors">{t(lang, 'footer.privacy')}</Link>
              <Link href={`/${lang}/about`} className="hover:text-white/60 transition-colors">{t(lang, 'footer.terms')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
