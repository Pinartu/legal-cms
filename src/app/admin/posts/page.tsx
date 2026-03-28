"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    if (res.ok) {
      const data = await res.json();
      setPosts(data);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post permanently?')) return;
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) fetchPosts();
  };

  return (
    <div className="space-y-6">
      <div className="flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold font-serif leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Articles & Posts
          </h2>
        </div>
        <div className="mt-4 flex sm:ml-4 sm:mt-0">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Yeni Yazı Ekle
          </Link>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {posts.map((post: any) => (
            <li key={post.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="truncate">
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <p className="truncate font-medium text-slate-900">{post.title}</p>
                    <p className="flex-shrink-0 font-normal text-slate-500">
                      — {post.category?.name || 'Kategorisiz'}
                    </p>
                    {post.postType && (
                      <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        post.postType === 'SOCIAL' ? 'bg-purple-100 text-purple-700' :
                        post.postType === 'NEWS'   ? 'bg-blue-100 text-blue-700' :
                                                     'bg-amber-100 text-amber-700'
                      }`}>
                        {post.postType === 'SOCIAL' ? 'Sosyal Medya' : post.postType === 'NEWS' ? 'Haber' : 'Yasal İçerik'}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center text-sm text-slate-500">
                      <p>
                        {post.isPublished ? 'Yayında' : 'Taslak'}
                        {post.publishedAt ? ` · ${new Date(post.publishedAt).toLocaleDateString('tr-TR')}` : ''}
                      </p>
                    </div>
                    <span className="text-slate-300">·</span>
                    <p className="text-xs text-slate-400">{post.locale?.toUpperCase() || 'TR'}</p>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex gap-4">
                  <Link
                    href={`/${post.locale || 'tr'}/article/${post.slug}${!post.isPublished ? '?preview=true' : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 font-medium text-sm"
                  >
                    Görüntüle
                  </Link>
                  <Link href={`/admin/posts/${post.id}`} className="text-slate-600 hover:text-slate-900 font-medium text-sm">
                    Düzenle
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">
                    Sil
                  </button>
                </div>
              </div>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="p-4 sm:px-6 text-center text-slate-500">Henüz yazı eklenmedi.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
