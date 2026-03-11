"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [paramsResolved, setParamsResolved] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setParamsResolved);
  }, [params]);

  const isNew = paramsResolved?.id === 'new';

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  
  // SEO
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  // FAQs
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>([]);

  // Metadata
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    // Fetch taxonomies
    fetch('/api/categories').then(res => res.json()).then(setCategories);
    fetch('/api/tags').then(res => res.json()).then(setTags);

    if (paramsResolved && !isNew) {
      fetch(`/api/posts/${paramsResolved.id}`).then(res => res.json()).then(data => {
        setTitle(data.title);
        setSlug(data.slug);
        setContent(data.content);
        setIsPublished(data.isPublished);
        setCategoryId(data.categoryId || '');
        setTagIds(data.tags.map((t: any) => t.id));
        setMetaTitle(data.metaTitle || '');
        setMetaDescription(data.metaDescription || '');
        setCanonicalUrl(data.canonicalUrl || '');
        setFaqs(data.faqs || []);
      });
    }
  }, [paramsResolved, isNew]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title, slug, content, isPublished, categoryId, tagIds,
      metaTitle, metaDescription, canonicalUrl, faqs,
      authorId: "temp-author-id", // Note: normally we'd get this from session
    };

    const url = isNew ? '/api/posts' : `/api/posts/${paramsResolved?.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      router.push('/admin/posts');
    } else {
      alert('Failed to save post');
    }
  };

  const addFaq = () => setFaqs([...faqs, { question: '', answer: '' }]);
  const updateFaq = (index: number, field: 'question'|'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  if (!paramsResolved) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-white p-4 shadow sm:rounded-lg border border-slate-200">
        <h2 className="text-xl font-bold font-serif text-slate-900">{isNew ? 'Create New Post' : 'Edit Post'}</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4" />
            <span className="ml-2 text-sm text-slate-700">Published</span>
          </label>
          <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800">
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 shadow sm:rounded-lg border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input type="text" required value={title} onChange={e => { setTitle(e.target.value); if(isNew) setSlug(e.target.value.toLowerCase().replace(/[\s\W-]+/g, '-')); }} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-slate-500 focus:ring-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Slug</label>
              <input type="text" required value={slug} onChange={e => setSlug(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-slate-500 focus:ring-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>
          </div>

          <div className="bg-white p-6 shadow sm:rounded-lg border border-slate-200 space-y-4">
            <h3 className="text-lg font-medium text-slate-900">SEO (Search Engine Optimization)</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700">Meta Title</label>
              <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-slate-500 focus:ring-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Meta Description</label>
              <textarea rows={3} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-slate-500 focus:ring-slate-500" />
              <p className="text-xs text-slate-500 mt-1">{metaDescription.length} characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Canonical URL</label>
              <input type="text" value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-slate-500 focus:ring-slate-500" />
            </div>
          </div>

          <div className="bg-white p-6 shadow sm:rounded-lg border border-slate-200">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-medium text-slate-900">FAQ Schema (JSON-LD)</h3>
               <button type="button" onClick={addFaq} className="text-sm bg-slate-100 px-3 py-1 rounded border border-slate-200 hover:bg-slate-200 text-slate-700">Add FAQ</button>
             </div>
             <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 p-4 rounded-md space-y-2 relative">
                    <button type="button" onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-500 text-sm">Remove</button>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Question</label>
                      <input type="text" value={faq.question} onChange={e => updateFaq(idx, 'question', e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Answer</label>
                      <textarea rows={2} value={faq.answer} onChange={e => updateFaq(idx, 'answer', e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 shadow sm:rounded-lg border border-slate-200 space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Taxonomies</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <option value="">Select Category...</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 mt-4">Tags</label>
              <div className="border border-slate-300 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                {tags.map((t: any) => (
                   <label key={t.id} className="flex items-center">
                     <input type="checkbox" checked={tagIds.includes(t.id)} onChange={e => {
                       if (e.target.checked) setTagIds([...tagIds, t.id]);
                       else setTagIds(tagIds.filter(id => id !== t.id));
                     }} className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4" />
                     <span className="ml-2 text-sm text-slate-700">{t.name}</span>
                   </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
