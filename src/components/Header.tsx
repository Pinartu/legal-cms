import Link from 'next/link';
import { Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function Header() {
  const categories = await prisma.category.findMany({
    take: 5,
    orderBy: { name: 'asc' }
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-slate-900">
              Legal<span className="text-slate-500 font-light">Insights</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">Home</Link>
            {categories.map(c => (
              <Link key={c.id} href={`/category/${c.slug}`} className="text-sm font-medium text-slate-700 hover:text-slate-900">
                {c.name}
              </Link>
            ))}
            <Link href="/about" className="text-sm font-medium text-slate-700 hover:text-slate-900">About</Link>
            <Link href="/contact" className="text-sm font-medium text-slate-700 hover:text-slate-900">Contact</Link>
          </nav>

          <div className="flex items-center">
            <Link href="/search" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" />
            </Link>
          </div>
          
        </div>
      </div>
    </header>
  );
}
