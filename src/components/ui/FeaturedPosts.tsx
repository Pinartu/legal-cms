"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export function FeaturedPosts({ posts }: { posts: any[] }) {
  return (
    <section className="bg-[#f8f6f2] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="inline-block w-12 h-[2px] bg-[#b8860b] mb-4"></span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a2332] tracking-tight">
              Güncel Yayınlar
            </h2>
            <p className="text-zinc-500 mt-3 text-base">Son hukuki analiz ve değerlendirmelerimiz</p>
          </div>
          <Link href="/search" className="group flex items-center gap-2 text-[#b8860b] font-medium text-sm uppercase tracking-wider hover:text-[#1a2332] transition-colors">
            Tüm Yayınlar <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-zinc-300 rounded-sm">
            <p className="text-zinc-400 font-serif text-xl">Henüz yayınlanmış makale bulunmamaktadır.</p>
            <p className="text-zinc-400 text-sm mt-2">Admin panelinden yeni makale ekleyebilirsiniz.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Featured (first post large) */}
            {posts[0] && (
              <motion.article 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 group"
              >
                <Link href={`/article/${posts[0].slug}`} className="block bg-white border border-zinc-200 hover:shadow-xl transition-all duration-500 h-full">
                  <div className="p-8 lg:p-10 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                      {posts[0].category && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b] bg-[#b8860b]/10 px-3 py-1">
                          {posts[0].category.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <Calendar className="w-3 h-3" />
                        {posts[0].publishedAt ? new Date(posts[0].publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Taslak'}
                      </span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-serif font-bold text-[#1a2332] group-hover:text-[#b8860b] transition-colors leading-snug mb-4 flex-grow">
                      {posts[0].title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-6">
                      {posts[0].metaDescription || "Detaylı analiz ve değerlendirme için tıklayınız."}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-100">
                      <span className="text-sm font-medium text-zinc-700">{posts[0].author?.name}</span>
                      <span className="text-[#b8860b] text-xs font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                        Devamını Oku <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}

            {/* Right column - smaller posts */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {posts.slice(1, 5).map((post: any, index: number) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link href={`/article/${post.slug}`} className="group block bg-white border border-zinc-200 hover:shadow-lg hover:border-[#b8860b]/20 transition-all duration-300 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {post.category && (
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b8860b]">
                          {post.category.name}
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-400">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Taslak'}
                      </span>
                    </div>
                    <h3 className="text-base font-serif font-semibold text-[#1a2332] group-hover:text-[#b8860b] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
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
