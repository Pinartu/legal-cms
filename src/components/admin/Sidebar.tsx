import Link from 'next/link';
import { LayoutDashboard, FileText, Tags, Image as ImageIcon, Settings, FolderTree, Layers } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Sayfalar', href: '/admin/pages', icon: Layers },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Tags', href: '/admin/tags', icon: Tags },
  { name: 'Media', href: '/admin/media', icon: ImageIcon },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Sidebar() {
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
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        LegalCMS v1.0
      </div>
    </div>
  );
}
