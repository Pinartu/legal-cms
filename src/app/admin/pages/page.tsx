"use client";

import Link from 'next/link';
import { Home, Info, Phone, ArrowRight, Layers } from 'lucide-react';

const PAGES = [
  { id: 'home', label: 'Ana Sayfa', description: 'Hero, uzmanlık alanları, yayınlar ve daha fazlası', icon: Home },
  { id: 'about', label: 'Hakkımızda', description: 'Firma tanıtımı, istatistikler ve CTA', icon: Info },
  { id: 'contact', label: 'İletişim', description: 'İletişim bilgileri ve iletişim formu', icon: Phone },
];

export default function PagesListPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Layers className="w-8 h-8 text-slate-700" />
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Sayfa Yönetimi</h2>
          <p className="text-sm text-slate-500 mt-1">Shopify tarzı bölüm düzenleyici ile sayfalarınızı özelleştirin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PAGES.map((page) => {
          const Icon = page.icon;
          return (
            <Link
              key={page.id}
              href={`/admin/pages/${page.id}`}
              className="group bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-900 transition-colors">
                  <Icon className="w-6 h-6 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{page.label}</h3>
              <p className="text-sm text-slate-500">{page.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
