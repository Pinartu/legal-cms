import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === 'all') return { title: 'All Legal Articles' };
  
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: 'Category Not Found' };
  
  return { title: `${category.name} - Legal Articles` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const isAll = slug === 'all';
  const category = !isAll ? await prisma.category.findUnique({ where: { slug } }) : null;

  if (!isAll && !category) notFound();

  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      categoryId: isAll ? undefined : category?.id,
    },
    include: {
      author: true,
      category: true,
    },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="bg-[#fbfbfb] min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
            {isAll ? 'All Publications' : category?.name}
          </h1>
          {!isAll && category?.description && (
            <p className="text-lg text-slate-600 font-light leading-relaxed">
              {category.description}
            </p>
          )}
        </header>

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

          {posts.length === 0 && (
            <div className="col-span-full text-center py-20 bg-slate-50 border border-slate-100 rounded-lg">
               <p className="text-slate-500 font-serif text-xl">No publications found in this category.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
