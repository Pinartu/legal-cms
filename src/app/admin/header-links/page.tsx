"use client";

import { useState, useEffect } from 'react';
import { Menu, Plus, Trash2, GripVertical, ExternalLink } from 'lucide-react';

interface HeaderLink {
  id: string;
  label: string;
  url: string;
  locale: string;
  order: number;
  openInNewTab: boolean;
}

export default function HeaderLinksPage() {
  const [links, setLinks] = useState<HeaderLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeLocale, setActiveLocale] = useState<'tr' | 'en'>('tr');
  const [form, setForm] = useState({ label: '', url: '', locale: 'tr', order: 0, openInNewTab: false });

  const fetchLinks = async () => {
    const res = await fetch('/api/header-links');
    if (res.ok) setLinks(await res.json());
  };

  useEffect(() => { fetchLinks(); }, []);

  const resetForm = () => {
    setForm({ label: '', url: '', locale: activeLocale, order: 0, openInNewTab: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.label || !form.url) return alert('Başlık ve URL zorunludur');
    setSaving(true);
    try {
      if (editingId) {
        await fetch(`/api/header-links/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('/api/header-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      await fetchLinks();
      resetForm();
    } catch (err) {
      alert('Kaydetme hatası');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu linki silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/header-links/${id}`, { method: 'DELETE' });
    await fetchLinks();
  };

  const handleEdit = (link: HeaderLink) => {
    setForm({ label: link.label, url: link.url, locale: link.locale, order: link.order, openInNewTab: link.openInNewTab });
    setEditingId(link.id);
    setShowForm(true);
  };

  const filteredLinks = links.filter(l => l.locale === activeLocale).sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Menu className="w-8 h-8 text-slate-700" />
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Üst Menü Linkleri</h2>
            <p className="text-sm text-slate-500 mt-1">Sitenin ana menüsündeki navigasyon linklerini dil bazında yönetin</p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setForm(f => ({ ...f, locale: activeLocale })); setShowForm(true); }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Yeni Link
        </button>
      </div>

      <div className="flex border-b border-slate-200 mb-6">
        <button onClick={() => setActiveLocale('tr')} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeLocale === 'tr' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
          🇹🇷 Türkçe
        </button>
        <button onClick={() => setActiveLocale('en')} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeLocale === 'en' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
          🇬🇧 English
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{editingId ? 'Link Düzenle' : 'Yeni Link Ekle'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Başlık</label>
              <input type="text" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder={activeLocale === 'tr' ? 'Hakkımızda' : 'About Us'} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">URL</label>
              <input type="text" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="/about veya https://..." className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Dil</label>
              <select value={form.locale} onChange={e => setForm({ ...form, locale: e.target.value })} className="w-full p-3 border border-slate-300 rounded-lg text-sm">
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Sıra (Soldan Sağa)</label>
              <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="w-full p-3 border border-slate-300 rounded-lg text-sm" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="openInNewTab" checked={form.openInNewTab} onChange={e => setForm({ ...form, openInNewTab: e.target.checked })} className="rounded" />
              <label htmlFor="openInNewTab" className="text-sm text-slate-700">Yeni sekmede aç</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors">
              {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Ekle'}
            </button>
            <button onClick={resetForm} className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">İptal</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Mevcut Linkler ({activeLocale.toUpperCase()})</h3>
        </div>
        <div className="p-2">
          {filteredLinks.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">Henüz üst menüye link eklenmemiş</p>
          ) : (
            <ul className="space-y-1">
              {filteredLinks.map(link => (
                <li key={link.id} className="flex items-center justify-between p-3 rounded hover:bg-slate-50 group border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded w-8 text-center">{link.order}</span>
                    <div className="min-w-0">
                      <span className="text-sm font-semibold text-slate-700 block truncate">{link.label}</span>
                      <span className="text-xs text-slate-400 block truncate flex items-center gap-1">
                        {link.url}
                        {link.openInNewTab && <ExternalLink className="w-3 h-3 inline" />}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button onClick={() => handleEdit(link)} className="p-2 text-slate-400 hover:text-slate-700"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                    <button onClick={() => handleDelete(link.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
