"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Scale, Briefcase, Globe, Building2, Shield, Landmark, FileText, Users, Calendar, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Locale, t } from "@/lib/i18n";

const ICONS: Record<string, any> = { Scale, Briefcase, Globe, Building2, Shield, Landmark, FileText, Users };

function getContent(section: any, lang: Locale) {
  let raw: any;
  try { raw = typeof section.content === 'string' ? JSON.parse(section.content) : section.content; } catch { raw = {}; }
  // Bilingual format: {tr: {...}, en: {...}} or flat format (legacy)
  if (raw.tr && raw.en) return raw[lang] || raw.tr;
  return raw;
}

// ─── HERO ───
function HeroSection({ content, lang }: { content: any; lang: Locale }) {
  const lines = (content.title || '').split('\n');
  return (
    <section className="relative w-full min-h-screen flex items-end overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={content.backgroundImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2600'} alt="" fill className="object-cover" priority sizes="100vw" quality={75} placeholder="blur" blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQIDBAAFEQYSITETQVFh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEEQA/wDK7Xqi6QbtJhvTHnURnlMhLitwUEkjnHvFKUH/2Q==" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/95 via-[#1a2332]/70 to-[#1a2332]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332] via-transparent to-transparent" />
      </div>
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-32 pt-40">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mb-6">
              <span className="inline-block w-16 h-[2px] bg-[#b8860b] mb-6" />
              <p className="text-[#b8860b] text-sm font-semibold tracking-[0.3em] uppercase">{content.subtitle}</p>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-8">
              {lines.map((line: string, i: number) => (<span key={i}>{i === 1 ? <span className="text-[#b8860b] italic font-light">{line}</span> : line}{i < lines.length - 1 && <br />}</span>))}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg text-white/70 font-light max-w-xl leading-relaxed mb-10">{content.description}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap gap-4">
              {content.buttonText && <Link href={`/${lang}${content.buttonLink || ''}`} className="group inline-flex items-center gap-2 bg-[#b8860b] text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-[#d4a843] transition-all">{content.buttonText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></Link>}
              {content.button2Text && <Link href={`/${lang}${content.button2Link || ''}`} className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:border-white hover:bg-white/10 transition-all">{content.button2Text}</Link>}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS ───
function StatsSection({ content }: { content: any; lang: Locale }) {
  const items = content.items || [];
  return (
    <section className="bg-[#1a2332]/80 backdrop-blur-md border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          {items.map((stat: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }} className="py-6 md:py-8 text-center">
              <p className="text-2xl md:text-3xl font-serif font-bold text-[#b8860b]">{stat.number}</p>
              <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PRACTICE AREAS ───
function PracticeAreasSection({ content, lang }: { content: any; lang: Locale }) {
  const areas = content.areas || [];
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div><span className="inline-block w-12 h-[2px] bg-[#b8860b] mb-4" /><h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a2332] tracking-tight">{content.title}</h2></div>
          <Link href={`/${lang}/category/all`} className="group flex items-center gap-2 text-[#b8860b] font-medium text-sm uppercase tracking-wider hover:text-[#1a2332] transition-colors">{t(lang, 'sections.view_all')} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-zinc-200">
          {areas.map((area: any, index: number) => {
            const Icon = ICONS[area.icon] || Briefcase;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08, duration: 0.5 }} className="group cursor-pointer border-b border-r border-zinc-200 p-8 lg:p-10 hover:bg-[#1a2332] transition-all duration-500">
                <div className="text-[#b8860b] mb-6 group-hover:text-[#d4a843] transition-colors"><Icon className="w-7 h-7" /></div>
                <h3 className="text-xl font-serif font-semibold text-[#1a2332] group-hover:text-white transition-colors mb-3">{area.title}</h3>
                <p className="text-sm text-zinc-500 group-hover:text-white/60 transition-colors leading-relaxed mb-6">{area.description}</p>
                <div className="flex items-center gap-2 text-[#b8860b] text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">{t(lang, 'sections.details')} <ArrowRight className="w-3 h-3" /></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT TEXT ───
function AboutTextSection({ content, lang }: { content: any; lang: Locale }) {
  const subItems = content.subItems || [];
  return (
    <section className="bg-[#1a2332] py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-5"><svg viewBox="0 0 400 400" className="w-full h-full"><circle cx="200" cy="200" r="180" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-white" /><circle cx="200" cy="200" r="140" stroke="currentColor" fill="none" strokeWidth="0.5" className="text-white" /></svg></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block w-12 h-[2px] bg-[#b8860b] mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 leading-snug">{content.title}</h2>
            <p className="text-white/60 leading-relaxed mb-8">{content.content}</p>
            {content.buttonText && <Link href={`/${lang}${content.buttonLink || ''}`} className="group inline-flex items-center gap-2 text-[#b8860b] font-semibold text-sm uppercase tracking-wider hover:text-[#d4a843] transition-colors">{content.buttonText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></Link>}
          </div>
          {subItems.length > 0 && (
            <div className="grid grid-cols-2 gap-6">
              {subItems.map((item: any, i: number) => (<div key={i} className="border border-white/10 p-6 hover:border-[#b8860b]/30 transition-colors group"><h4 className="text-white font-serif font-semibold mb-2 group-hover:text-[#b8860b] transition-colors">{item.title}</h4><p className="text-white/40 text-xs leading-relaxed">{item.description}</p></div>))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED POSTS ───
function FeaturedPostsSection({ content, posts, lang }: { content: any; posts?: any[]; lang: Locale }) {
  const displayPosts = posts || [];
  return (
    <section className="bg-[#f8f6f2] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div><span className="inline-block w-12 h-[2px] bg-[#b8860b] mb-4" /><h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a2332] tracking-tight">{content.title}</h2><p className="text-zinc-500 mt-3 text-base">{content.subtitle}</p></div>
          <Link href={`/${lang}/search`} className="group flex items-center gap-2 text-[#b8860b] font-medium text-sm uppercase tracking-wider hover:text-[#1a2332] transition-colors">{t(lang, 'sections.all_publications')} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></Link>
        </div>
        {displayPosts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-zinc-300"><p className="text-zinc-400 font-serif text-xl">{t(lang, 'sections.no_posts')}</p></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {displayPosts[0] && (
              <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-7 group">
                <Link href={`/${lang}/article/${displayPosts[0].slug}`} className="block bg-white border border-zinc-200 hover:shadow-xl transition-all duration-500 h-full">
                  <div className="p-8 lg:p-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                      {displayPosts[0].category && <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b] bg-[#b8860b]/10 px-3 py-1">{displayPosts[0].category.name}</span>}
                      <span className="flex items-center gap-1.5 text-xs text-zinc-400"><Calendar className="w-3 h-3" />{displayPosts[0].publishedAt ? new Date(displayPosts[0].publishedAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : t(lang, 'page.draft')}</span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-serif font-bold text-[#1a2332] group-hover:text-[#b8860b] transition-colors leading-snug mb-4 flex-grow">{displayPosts[0].title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-6">{displayPosts[0].metaDescription || ""}</p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-100">
                      <span className="text-sm font-medium text-zinc-700">{displayPosts[0].author?.name}</span>
                      <span className="text-[#b8860b] text-xs font-semibold uppercase tracking-wider flex items-center gap-1">{t(lang, 'sections.read_more')} <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {displayPosts.slice(1, 5).map((post: any, index: number) => (
                <motion.article key={post.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }}>
                  <Link href={`/${lang}/article/${post.slug}`} className="group block bg-white border border-zinc-200 hover:shadow-lg hover:border-[#b8860b]/20 transition-all duration-300 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {post.category && <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b8860b]">{post.category.name}</span>}
                      <span className="text-[11px] text-zinc-400">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : t(lang, 'page.draft')}</span>
                    </div>
                    <h3 className="text-base font-serif font-semibold text-[#1a2332] group-hover:text-[#b8860b] transition-colors leading-snug line-clamp-2">{post.title}</h3>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── NEWSLETTER ───
function NewsletterSection({ content, lang }: { content: any; lang: Locale }) {
  return (
    <section className="bg-[#1a2332] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div><h3 className="text-xl font-serif font-bold text-white mb-1">{content.title}</h3><p className="text-white/50 text-sm">{content.description}</p></div>
          <div className="flex gap-0 w-full md:w-auto">
            <input type="email" placeholder={t(lang, 'sections.email_placeholder')} className="bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-5 py-3 text-sm focus:outline-none focus:border-[#b8860b] transition-colors flex-grow md:w-72" />
            <button className="bg-[#b8860b] hover:bg-[#d4a843] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors whitespace-nowrap">{t(lang, 'sections.subscribe')}</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT INFO ───
function ContactInfoSection({ content, lang }: { content: any; lang: Locale }) {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {content.address && <div className="flex gap-5"><div className="w-12 h-12 bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-[#b8860b]" /></div><div><h3 className="text-sm font-bold text-[#1a2332] uppercase tracking-wider mb-1">{t(lang, 'contact.address')}</h3><p className="text-zinc-500 text-sm leading-relaxed whitespace-pre-line">{content.address}</p></div></div>}
          {content.phone && <div className="flex gap-5"><div className="w-12 h-12 bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-[#b8860b]" /></div><div><h3 className="text-sm font-bold text-[#1a2332] uppercase tracking-wider mb-1">{t(lang, 'contact.phone')}</h3><a href={`tel:${content.phone}`} className="text-zinc-500 text-sm hover:text-[#b8860b] transition-colors">{content.phone}</a></div></div>}
          {content.email && <div className="flex gap-5"><div className="w-12 h-12 bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-[#b8860b]" /></div><div><h3 className="text-sm font-bold text-[#1a2332] uppercase tracking-wider mb-1">{t(lang, 'contact.email')}</h3><a href={`mailto:${content.email}`} className="text-zinc-500 text-sm hover:text-[#b8860b] transition-colors">{content.email}</a></div></div>}
          {content.hours && <div className="flex gap-5"><div className="w-12 h-12 bg-[#b8860b]/10 flex items-center justify-center flex-shrink-0"><Clock className="w-5 h-5 text-[#b8860b]" /></div><div><h3 className="text-sm font-bold text-[#1a2332] uppercase tracking-wider mb-1">{t(lang, 'contact.hours')}</h3><p className="text-zinc-500 text-sm">{content.hours}</p></div></div>}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT FORM ───
function ContactFormSection({ content, lang }: { content: any; lang: Locale }) {
  return (
    <section className="bg-[#f8f6f2] py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-serif font-bold text-[#1a2332] mb-2">{content.title}</h2>
        <p className="text-zinc-500 text-sm mb-8">{content.description}</p>
        <form className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className="text-xs font-bold text-[#1a2332] uppercase tracking-wider block mb-2">{t(lang, 'form.name')}</label><input type="text" className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-[#b8860b] focus:outline-none transition-colors" placeholder={t(lang, 'form.name_placeholder')} /></div>
            <div><label className="text-xs font-bold text-[#1a2332] uppercase tracking-wider block mb-2">{t(lang, 'form.email')}</label><input type="email" className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-[#b8860b] focus:outline-none transition-colors" placeholder={t(lang, 'form.email_placeholder')} /></div>
          </div>
          <div><label className="text-xs font-bold text-[#1a2332] uppercase tracking-wider block mb-2">{t(lang, 'form.subject')}</label><input type="text" className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-[#b8860b] focus:outline-none transition-colors" placeholder={t(lang, 'form.subject_placeholder')} /></div>
          <div><label className="text-xs font-bold text-[#1a2332] uppercase tracking-wider block mb-2">{t(lang, 'form.message')}</label><textarea rows={5} className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm focus:border-[#b8860b] focus:outline-none transition-colors resize-none" placeholder={t(lang, 'form.message_placeholder')} /></div>
          <button type="submit" className="bg-[#b8860b] hover:bg-[#d4a843] text-white px-8 py-3 text-sm font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto">{t(lang, 'form.send')}</button>
        </form>
      </div>
    </section>
  );
}

// ─── CUSTOM HTML ───
function CustomHtmlSection({ content }: { content: any; lang: Locale }) {
  const bgClasses: Record<string, string> = { white: 'bg-white', cream: 'bg-[#f8f6f2]', navy: 'bg-[#1a2332] text-white' };
  return (
    <section className={`py-20 ${bgClasses[content.bgColor] || 'bg-white'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && <><span className="inline-block w-12 h-[2px] bg-[#b8860b] mb-4" /><h2 className="text-3xl font-serif font-bold mb-8">{content.title}</h2></>}
        <div className="prose prose-lg max-w-none leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.content || '' }} />
      </div>
    </section>
  );
}

// ─── CTA BANNER ───
function CtaBannerSection({ content, lang }: { content: any; lang: Locale }) {
  const isNavy = content.bgColor === 'navy';
  return (
    <section className={`py-20 ${isNavy ? 'bg-[#1a2332]' : 'bg-[#b8860b]'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4 text-white">{content.title}</h2>
        <p className={`mb-8 ${isNavy ? 'text-white/60' : 'text-white/80'}`}>{content.description}</p>
        {content.buttonText && <Link href={`/${lang}${content.buttonLink || ''}`} className={`inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold uppercase tracking-wider transition-all ${isNavy ? 'bg-[#b8860b] text-white hover:bg-[#d4a843]' : 'bg-white text-[#1a2332] hover:bg-zinc-100'}`}>{content.buttonText} <ArrowRight className="w-4 h-4" /></Link>}
      </div>
    </section>
  );
}

// ─── SPACER ───
function SpacerSection({ content }: { content: any; lang: Locale }) {
  return <div style={{ height: `${content.height || 60}px` }} />;
}

// ─── SECTION RENDERER ───
const SECTION_COMPONENTS: Record<string, React.FC<{ content: any; posts?: any[]; lang: Locale }>> = {
  hero: HeroSection, stats: StatsSection, practice_areas: PracticeAreasSection,
  about_text: AboutTextSection, featured_posts: FeaturedPostsSection, newsletter: NewsletterSection,
  contact_info: ContactInfoSection, contact_form: ContactFormSection, custom_html: CustomHtmlSection,
  cta_banner: CtaBannerSection, spacer: SpacerSection,
};

export default function SectionRenderer({ sections, posts, lang = 'tr' }: { sections: any[]; posts?: any[]; lang?: Locale }) {
  return (
    <>
      {sections.map((section: any) => {
        if (!section.isVisible) return null;
        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) return null;
        const content = getContent(section, lang);
        return <Component key={section.id} content={content} posts={section.type === 'featured_posts' ? posts : undefined} lang={lang} />;
      })}
    </>
  );
}
