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
            Create New Post
          </Link>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg overflow-hidden border border-slate-200">
        <ul role="list" className="divide-y divide-slate-200">
          {posts.map((post: any) => (
            <li key={post.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="truncate">
                  <div className="flex text-sm">
                    <p className="truncate font-medium text-slate-900">{post.title}</p>
                    <p className="ml-1 flex-shrink-0 font-normal text-slate-500">
                      in {post.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-slate-500">
                      <p>
                        {post.isPublished ? 'Published' : 'Draft'}
                        {post.publishedAt ? ` on ${new Date(post.publishedAt).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex gap-4">
                  <Link href={`/admin/posts/${post.id}`} className="text-slate-600 hover:text-slate-900 font-medium text-sm">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="p-4 sm:px-6 text-center text-slate-500">No posts created yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
