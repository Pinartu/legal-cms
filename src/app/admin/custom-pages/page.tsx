"use client";

import { useState, useEffect } from 'react';
import { FileText, Plus, ArrowLeft, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  locale: string;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}

export default function CustomPagesAdmin() {
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [editingPage, setEditingPage] = useState<Partial<CustomPage> | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchPages = async () => {
    const res = await fetch('/api/custom-pages');
    if (res.ok) setPages(await res.json());
  };

  useEffect(() => { fetchPages(); }, []);

  const handleNew = () => {
    setEditingPage({ title: '', slug: '', content: '', locale: 'tr', isPublished: true, metaTitle: '', metaDescription: '' });
    setView('edit');
  };

  const handleEdit = async (id: string) => {
    const res = await fetch(`/api/custom-pages/${id}`);
    if (res.ok) {
      setEditingPage(await res.json());
      setView('edit');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sayfayı silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/custom-pages/${id}`, { method: 'DELETE' });
    await fetchPages();
  };

  const handleSave = async () => {
    if (!editingPage?.title || !editingPage?.slug) return alert('Başlık ve slug zorunludur');
    setSaving(true);
    try {
      const method = editingPage.id ? 'PUT' : 'POST';
      const url = editingPage.id ? `/api/custom-pages/${editingPage.id}` : '/api/custom-pages';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPage),
      });
      if (res.ok) {
        await fetchPages();
        setView('list');
        setEditingPage(null);
      }
    } catch (err) {
      alert('Kaydetme hatası');
    }
    setSaving(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  if (view === 'edit' && editingPage) {
    return (
      <div>
        <button onClick={() => { setView('list'); setEditingPage(null); }} className="flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Sayfa Listesine Dön
        </button>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-serif font-bold text-slate-900">{editingPage.id ? 'Sayfa Düzenle' : 'Yeni Sayfa'}</h2>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors">
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sayfa Başlığı</label>
              <input type="text" value={editingPage.title || ''} onChange={e => {
                const title = e.target.value;
                setEditingPage(p => ({ ...p, title, slug: p?.id ? p.slug : generateSlug(title) }));
              }} placeholder="Gizlilik Politikası" className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Slug (URL)</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">/page/</span>
                <input type="text" value={editingPage.slug || ''} onChange={e => setEditingPage(p => ({ ...p, slug: e.target.value }))} placeholder="gizlilik-politikasi" className="flex-1 p-3 border border-slate-300 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Dil</label>
              <select value={editingPage.locale || 'tr'} onChange={e => setEditingPage(p => ({ ...p, locale: e.target.value }))} className="w-full p-3 border border-slate-300 rounded-lg text-sm">
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="isPublished" checked={editingPage.isPublished !== false} onChange={e => setEditingPage(p => ({ ...p, isPublished: e.target.checked }))} className="rounded" />
              <label htmlFor="isPublished" className="text-sm text-slate-700 font-medium">Yayında</label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">İçerik (HTML)</label>
            <textarea value={editingPage.content || ''} onChange={e => setEditingPage(p => ({ ...p, content: e.target.value }))} rows={12} placeholder="<h2>Başlık</h2><p>İçerik buraya...</p>" className="w-full p-3 border border-slate-300 rounded-lg text-sm font-mono" />
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-700 mb-4">SEO Ayarları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Meta Başlık</label>
                <input type="text" value={editingPage.metaTitle || ''} onChange={e => setEditingPage(p => ({ ...p, metaTitle: e.target.value }))} placeholder="Sayfa başlığı" className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Meta Açıklama</label>
                <input type="text" value={editingPage.metaDescription || ''} onChange={e => setEditingPage(p => ({ ...p, metaDescription: e.target.value }))} placeholder="Sayfa açıklaması" className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-slate-700" />
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Özel Sayfalar</h2>
            <p className="text-sm text-slate-500 mt-1">Yeni sayfalar oluşturun ve footer&apos;dan linkleyin</p>
          </div>
        </div>
        <button onClick={handleNew} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> Yeni Sayfa
        </button>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Henüz sayfa oluşturulmadı</h3>
          <p className="text-sm text-slate-500 mb-6">Gizlilik Politikası, Kullanım Koşulları gibi sayfalar oluşturabilirsiniz</p>
          <button onClick={handleNew} className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            <Plus className="w-4 h-4" /> İlk Sayfanızı Oluşturun
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Başlık</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Slug</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Dil</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Durum</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pages.map(page => (
                <tr key={page.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{page.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">/{page.locale}/page/{page.slug}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{page.locale === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}</td>
                  <td className="px-6 py-4">
                    {page.isPublished ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded"><Eye className="w-3 h-3" /> Yayında</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded"><EyeOff className="w-3 h-3" /> Taslak</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/${page.locale}/page/${page.slug}`} target="_blank" rel="noopener" className="p-1 text-slate-400 hover:text-blue-600" title="Sayfayı görüntüle"><ExternalLink className="w-4 h-4" /></a>
                      <button onClick={() => handleEdit(page.id)} className="p-1 text-slate-400 hover:text-slate-700" title="Düzenle"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                      <button onClick={() => handleDelete(page.id)} className="p-1 text-slate-400 hover:text-red-600" title="Sil"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
