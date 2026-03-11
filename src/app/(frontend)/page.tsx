import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    include: {
      category: true,
      author: { select: { name: true } }
    },
    orderBy: { publishedAt: 'desc' },
    take: 6
  });

  return (
    <div className="bg-[#fbfbfb]">
      {/* Hero Section */}
      <section className="bg-slate-900 border-b border-slate-800 relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white mb-6">
            Sharpening Legal Insight.
          </h1>
          <p className="mt-4 text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Expert analysis, relevant case law, and contemporary legal perspectives shared for professionals and students alike.
          </p>
          <div className="mt-10">
            <Link href="#latest-insights" className="bg-white text-slate-900 px-8 py-3 rounded-sm font-medium hover:bg-slate-100 transition-colors">
              Read Latest Insights
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Articles Grid */}
      <section id="latest-insights" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-between items-end border-b border-slate-200 pb-4">
          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Recent Publications</h2>
          <Link href="/category/all" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {posts.map((post) => (
            <article key={post.id} className="group relative flex flex-col items-start justify-between">
              <div className="flex items-center gap-x-4 text-xs mb-4">
                <time dateTime={post.publishedAt?.toISOString()} className="text-slate-500">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft'}
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
                  {post.metaDescription || "Click to read the full analysis and insights."}
                </p>
              </div>
              <div className="relative mt-6 flex items-center gap-x-4">
                <div className="text-sm leading-6">
                  <p className="font-semibold text-slate-900">
                    By {post.author.name}
                  </p>
                </div>
              </div>
            </article>
          ))}
          
          {posts.length === 0 && (
            <div className="col-span-3 text-center py-20 bg-slate-50 border border-slate-100 rounded-lg">
              <p className="text-slate-500 font-serif text-xl">No articles published yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
