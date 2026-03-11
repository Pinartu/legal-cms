import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  
  if (!post) return { title: 'Not Found' };
  
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription,
    alternates: {
      canonical: post.canonicalUrl,
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, isPublished: true },
    include: {
      author: true,
      category: true,
      tags: true,
      faqs: true,
    }
  });

  if (!post) notFound();

  // Generate FAQ Schema if FAQs exist
  const faqSchema = post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <article className="bg-[#fbfbfb] min-h-screen">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Modern, minimalist header */}
      <header className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center border-b border-slate-200">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6 font-medium uppercase tracking-widest">
           {post.category && <span>{post.category.name}</span>}
           <span>•</span>
           <time dateTime={post.publishedAt?.toISOString()}>
             {post.publishedAt?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
           </time>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 leading-tight mb-8">
          {post.title}
        </h1>

        <div className="flex items-center justify-center text-sm text-slate-600">
             <span>By <strong className="font-semibold text-slate-900">{post.author.name}</strong></span>
        </div>
      </header>

      {/* Reading-centric, distraction-free content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div 
           className="prose prose-lg prose-slate max-w-none font-sans leading-relaxed text-slate-700
                      prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900
                      prose-a:text-slate-900 prose-a:font-semibold hover:prose-a:text-slate-600
                      prose-blockquote:border-l-4 prose-blockquote:border-slate-900 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-800 prose-blockquote:bg-slate-50 prose-blockquote:py-2"
           dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap gap-2">
            <span className="text-sm font-medium text-slate-900 mr-2 items-center flex">Tags:</span>
            {post.tags.map(tag => (
              <span key={tag.id} className="bg-slate-100 px-3 py-1 rounded text-xs font-medium text-slate-600">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* FAQ Visual Render (Optional, usually FAQs are just visible alongside the schema) */}
        {post.faqs.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
            <div className="space-y-6">
               {post.faqs.map(faq => (
                 <div key={faq.id}>
                   <h4 className="text-lg font-semibold text-slate-900">{faq.question}</h4>
                   <p className="mt-2 text-slate-600">{faq.answer}</p>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
