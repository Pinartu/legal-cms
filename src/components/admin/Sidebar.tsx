"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Tags, Image as ImageIcon, Settings, FolderTree, Layers, LogOut, Link2, FilePlus } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Sayfalar', href: '/admin/pages', icon: Layers },
  { name: 'Makaleler', href: '/admin/posts', icon: FileText },
  { name: 'Kategoriler', href: '/admin/categories', icon: FolderTree },
  { name: 'Etiketler', href: '/admin/tags', icon: Tags },
  { name: 'Medya', href: '/admin/media', icon: ImageIcon },
  { name: 'Özel Sayfalar', href: '/admin/custom-pages', icon: FilePlus },
  { name: 'Üst Menü Linkleri', href: '/admin/header-links', icon: LayoutDashboard },
  { name: 'Footer Linkleri', href: '/admin/footer-links', icon: Link2 },
  { name: 'Ayarlar', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <h1 className="text-xl font-bold font-serif tracking-wider">LegalCMS</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-2 py-3 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-2 py-3 text-sm font-medium rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
