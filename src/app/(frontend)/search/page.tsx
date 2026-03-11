import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Search as SearchIcon } from 'lucide-react';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Search Articles - LegalInsights' };

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || '';

  const posts = q ? await prisma.post.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: q } },
        { content: { contains: q } },
        { metaDescription: { contains: q } }
      ]
    },
    include: { category: true, author: true, tags: true },
    orderBy: { publishedAt: 'desc' },
  }) : [];

  async function searchAction(formData: FormData) {
    "use server";
    const query = formData.get('q');
    if (query) redirect(`/search?q=${encodeURIComponent(query.toString())}`);
  }

  return (
    <div className="bg-[#fbfbfb] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8 text-center tracking-tight">Global Search</h1>
          <form action={searchAction} className="relative flex items-center">
            <SearchIcon className="absolute left-4 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              name="q" 
              defaultValue={q}
              placeholder="Search case law, articles, or author insights..." 
              required
              className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-300 shadow-sm focus:border-slate-900 focus:ring-slate-900 text-lg"
            />
            <button type="submit" className="absolute right-2 px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors">
              Search
            </button>
          </form>
        </div>

        {q && (
          <div className="mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-medium text-slate-700">
              {posts.length} {posts.length === 1 ? 'result' : 'results'} for <span className="font-semibold text-slate-900">"{q}"</span>
            </h2>
          </div>
        )}

        {q && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {posts.map((post) => (
              <article key={post.id} className="group relative flex flex-col items-start justify-between">
                <div className="flex items-center gap-x-4 text-xs mb-4">
                  <time dateTime={post.publishedAt?.toISOString()} className="text-slate-500">
                    {post.publishedAt?.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  {post.category && (
                    <Link href={`/category/${post.category.slug}`} className="relative z-10 rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-200">
                      {post.category.name}
                    </Link>
                  )}
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-2xl font-serif font-semibold leading-relaxed text-slate-900 group-hover:text-slate-600 transition-colors">
                    <Link href={`/article/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                    {post.metaDescription || "Read the full case analysis and overview here."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {q && posts.length === 0 && (
          <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-lg max-w-2xl mx-auto">
            <p className="text-slate-500 font-serif text-xl">We couldn't find anything matching your search query. Please try different keywords or browse our categories.</p>
          </div>
        )}

      </div>
    </div>
  );
}
