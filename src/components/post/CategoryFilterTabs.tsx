"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Props {
  lang: string;
  categorySlug: string;
  counts: { all: number; social: number; news: number; legal: number };
}

const TABS = [
  { key: '',       label: 'Tümü',          activeClass: 'bg-[#1a2332] text-white',   inactiveClass: 'text-slate-600 hover:text-[#1a2332]' },
  { key: 'SOCIAL', label: 'Sosyal Medya',  activeClass: 'bg-purple-600 text-white',  inactiveClass: 'text-slate-600 hover:text-purple-700' },
  { key: 'NEWS',   label: 'Haberler',      activeClass: 'bg-blue-600 text-white',    inactiveClass: 'text-slate-600 hover:text-blue-700' },
  { key: 'LEGAL',  label: 'Yasal İçerik',  activeClass: 'bg-[#b8860b] text-white',  inactiveClass: 'text-slate-600 hover:text-[#b8860b]' },
] as const;

function getCount(key: string, counts: Props['counts']) {
  if (key === '')       return counts.all;
  if (key === 'SOCIAL') return counts.social;
  if (key === 'NEWS')   return counts.news;
  if (key === 'LEGAL')  return counts.legal;
  return 0;
}

export default function CategoryFilterTabs({ lang, categorySlug, counts }: Props) {
  const searchParams = useSearchParams();
  const currentType = searchParams.get('type') || '';

  return (
    <div className="flex flex-wrap gap-2 px-4 sm:px-6 lg:px-8 py-5 bg-white border-b border-zinc-100">
      {TABS.map(tab => {
        const count = getCount(tab.key, counts);
        if (count === 0 && tab.key !== '') return null;

        const href = tab.key
          ? `/${lang}/category/${categorySlug}?type=${tab.key}`
          : `/${lang}/category/${categorySlug}`;
        const isActive = currentType === tab.key;

        return (
          <Link
            key={tab.key}
            href={href}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
              isActive ? tab.activeClass : `bg-zinc-100 ${tab.inactiveClass}`
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              isActive ? 'bg-white/25 text-white' : 'bg-zinc-200 text-zinc-500'
            }`}>
              {count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
