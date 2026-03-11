import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { prisma } from '@/lib/prisma';

// Simple SVG icons for social media (avoid importing heavy icon libraries)
function LinkedInIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>; }
function YouTubeIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>; }
function XIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function FacebookIcon() { return <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>; }

export default async function Footer({ lang = 'tr' }: { lang?: Locale }) {
  // Fetch social media links from settings
  const socialSettings = await prisma.siteContent.findMany({
    where: { key: { startsWith: 'social_' } }
  });
  const social: Record<string, string> = {};
  socialSettings.forEach((s: any) => { social[s.key] = s.value; });

  const socialLinks = [
    { key: 'social_linkedin', url: social.social_linkedin, icon: LinkedInIcon, label: 'LinkedIn' },
    { key: 'social_youtube', url: social.social_youtube, icon: YouTubeIcon, label: 'YouTube' },
    { key: 'social_x', url: social.social_x, icon: XIcon, label: 'X' },
    { key: 'social_facebook', url: social.social_facebook, icon: FacebookIcon, label: 'Facebook' },
  ].filter(s => s.url);

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
            <div className="flex gap-0 w-full md:w-auto">
              <input type="email" placeholder={t(lang, 'sections.email_placeholder')} className="bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-5 py-3 text-sm focus:outline-none focus:border-[#b8860b] transition-colors flex-grow md:w-72" />
              <button className="bg-[#b8860b] hover:bg-[#d4a843] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors whitespace-nowrap">{t(lang, 'sections.subscribe')}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1: Logo & Social */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 border-2 border-[#b8860b] flex items-center justify-center"><span className="text-[#b8860b] font-serif text-lg font-bold">L</span></div>
              <span className="text-white font-serif text-lg font-bold tracking-wide">LEGAL<span className="font-light text-[#b8860b]">INSIGHTS</span></span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              {lang === 'tr'
                ? "Ticaret hukuku alanında uzmanlaşmış, Türkiye'nin önde gelen şirketlerine stratejik hukuki danışmanlık sunan bağımsız bir hukuk platformu."
                : "An independent legal platform providing strategic legal advisory to Turkey's leading corporations, specializing in commercial law."}
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

          {/* Col 2: Explore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-6">{t(lang, 'footer.explore')}</h4>
            <ul className="space-y-3">
              {[
                { label: t(lang, 'nav.about'), href: `/${lang}/about` },
                { label: t(lang, 'nav.practice_areas'), href: `/${lang}/category/all` },
                { label: t(lang, 'nav.contact'), href: `/${lang}/contact` },
              ].map((link) => (
                <li key={link.href}><Link href={link.href} className="text-white/50 hover:text-[#b8860b] transition-colors text-sm flex items-center gap-2 group"><span className="w-0 h-[1px] bg-[#b8860b] group-hover:w-3 transition-all" />{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 3: Publications */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-6">{t(lang, 'footer.publications')}</h4>
            <ul className="space-y-3">
              {[
                { label: t(lang, 'footer.all_publications'), href: `/${lang}/search` },
                { label: t(lang, 'footer.legal_analyses'), href: `/${lang}/search` },
                { label: t(lang, 'footer.legislation_tracking'), href: `/${lang}/search` },
              ].map((link) => (
                <li key={link.label}><Link href={link.href} className="text-white/50 hover:text-[#b8860b] transition-colors text-sm flex items-center gap-2 group"><span className="w-0 h-[1px] bg-[#b8860b] group-hover:w-3 transition-all" />{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-6">{t(lang, 'footer.contact')}</h4>
            <div className="space-y-4 text-sm text-white/50">
              <p>Levent Mah. Büyükdere Cad.<br />No: 100, Kat: 12<br />34394 Beşiktaş / İstanbul</p>
              <p><a href="tel:+902125550000" className="hover:text-[#b8860b] transition-colors">+90 (212) 555 00 00</a></p>
              <p><a href="mailto:info@legalinsights.com" className="hover:text-[#b8860b] transition-colors">info@legalinsights.com</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
            <span>© {new Date().getFullYear()} LegalInsights. {t(lang, 'footer.all_rights')}.</span>
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
