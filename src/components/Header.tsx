"use client";

import Link from 'next/link';
import { Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

// NOT: Eski sabit menü yapısı Header.original.backup.tsx dosyasına yedeklenmiştir.

const TAGLINE: Record<Locale, string> = {
  tr: 'Ticaret Hukuku Danışmanlığı',
  en: 'Commercial Law Advisory',
};

export default function Header({
  categories = [],
  lang = 'tr',
  siteSettings = {},
  headerLinks = [],
}: {
  categories?: any[];
  lang?: Locale;
  siteSettings?: Record<string, string>;
  headerLinks?: any[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const altLang = lang === 'tr' ? 'en' : 'tr';

  // Use CMS settings with fallback defaults
  const contactEmail = siteSettings.contact_email || 'info@legalinsights.com';
  const contactPhone = siteSettings.contact_phone || '+90 (212) 555 00 00';
  const siteTitle = siteSettings.site_title || 'LEGALINSIGHTS';

  // Parse logo text: split at first lowercase→uppercase boundary or use as-is
  const logoMain = siteTitle.replace(/INSIGHTS|insights/i, '');
  const logoAccent = siteTitle.match(/INSIGHTS|insights/i)?.[0] || '';

  // Build the alternate-language URL
  const altUrl = pathname.replace(`/${lang}`, `/${altLang}`);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 ease-in-out",
        scrolled ? "bg-[#1a2332] shadow-lg py-3" : "bg-transparent py-5"
      )}>
        {/* Top bar */}
        <div className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 overflow-hidden",
          scrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100 mb-3"
        )}>
          <div className="flex justify-end items-center gap-6 text-xs text-white/60">
            <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">{contactEmail}</a>
            <span>{contactPhone}</span>
            <div className="flex items-center gap-2 border-l border-white/20 pl-4">
              <Link href={lang === 'tr' ? pathname : altUrl} className={cn("transition-colors", lang === 'tr' ? "text-white font-semibold" : "hover:text-white")}>TR</Link>
              <span className="text-white/30">|</span>
              <Link href={lang === 'en' ? pathname : altUrl} className={cn("transition-colors", lang === 'en' ? "text-white font-semibold" : "hover:text-white")}>EN</Link>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href={`/${lang}`} className="flex items-center gap-3 group">
              <div className="w-10 h-10 border-2 border-[#b8860b] flex items-center justify-center transition-colors group-hover:bg-[#b8860b]">
                <span className="text-[#b8860b] font-serif text-xl font-bold group-hover:text-white transition-colors">{siteTitle.charAt(0)}</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-white font-serif text-xl font-bold tracking-wide">{logoMain}<span className="font-light text-[#b8860b]">{logoAccent}</span></span>
                <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] -mt-0.5">{TAGLINE[lang]}</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {headerLinks.map((item) => {
                // Determine if URL is absolute
                const isAbsolute = item.url.startsWith('http');
                const href = isAbsolute ? item.url : `/${lang}${item.url.startsWith('/') ? item.url : `/${item.url}`}`;
                return (
                  <Link key={item.id} href={href} target={item.openInNewTab ? "_blank" : "_self"} className="px-4 py-2 text-[13px] font-medium tracking-wider uppercase text-white/80 hover:text-[#b8860b] transition-colors relative group">
                    {item.label}
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#b8860b] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                );
              })}
              {categories.slice(0, 2).map((c: any) => (
                <Link key={c.id} href={`/${lang}/category/${c.slug}`} className="px-4 py-2 text-[13px] font-medium tracking-wider uppercase text-white/80 hover:text-[#b8860b] transition-colors relative group">
                  {c.name}
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#b8860b] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link href={`/${lang}/search`} className="text-white/70 hover:text-[#b8860b] transition-colors p-2">
                <Search className="h-5 w-5" />
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white/70 hover:text-white transition-colors p-2">
                {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-40 bg-[#1a2332] transition-all duration-500 lg:hidden flex flex-col justify-center items-center",
        mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <nav className="flex flex-col items-center gap-6">
          {headerLinks.map((item) => {
            const isAbsolute = item.url.startsWith('http');
            const href = isAbsolute ? item.url : `/${lang}${item.url.startsWith('/') ? item.url : `/${item.url}`}`;
            return (
              <Link key={item.id} href={href} target={item.openInNewTab ? "_blank" : "_self"} onClick={() => setMobileOpen(false)}
                className="text-2xl font-serif text-white/90 hover:text-[#b8860b] transition-colors tracking-wide">
                {item.label}
              </Link>
            );
          })}
          <div className="flex gap-4 mt-8 pt-8 border-t border-white/10">
            <Link href={lang === 'tr' ? pathname : altUrl} className={cn("text-sm", lang === 'tr' ? "text-white font-bold" : "text-white/50 hover:text-white")} onClick={() => setMobileOpen(false)}>TR</Link>
            <span className="text-white/30">|</span>
            <Link href={lang === 'en' ? pathname : altUrl} className={cn("text-sm", lang === 'en' ? "text-white font-bold" : "text-white/50 hover:text-white")} onClick={() => setMobileOpen(false)}>EN</Link>
          </div>
        </nav>
      </div>
    </>
  );
}
