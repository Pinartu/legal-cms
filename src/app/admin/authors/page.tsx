"use client";

import { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

interface Author {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string | null;
  profileImage: string | null;
}

const EMPTY: Omit<Author, 'id'> = { name: '', email: '', role: 'AUTHOR', bio: '', profileImage: '' };

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAuthors = async () => {
    setLoading(true);
    const res = await fetch('/api/users');
    if (res.ok) setAuthors(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchAuthors(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...EMPTY });
    setError('');
    setShowForm(true);
  };

  const openEdit = (a: Author) => {
    setEditingId(a.id);
    setForm({ name: a.name, email: a.email, role: a.role, bio: a.bio || '', profileImage: a.profileImage || '' });
    setError('');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { name: form.name, email: form.email, role: form.role, bio: form.bio || null, profileImage: form.profileImage || null };
    const res = editingId
      ? await fetch(`/api/users/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setShowForm(false);
      fetchAuthors();
    } else {
      const data = await res.json();
      setError(data.error || 'Bir hata oluştu');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" yazarını silmek istediğinizden emin misiniz?\nBu yazara ait makalelerin yazar alanı boşaltılacak.`)) return;
    await fetch(`/api/users/${id}`, { method: 'DELETE' });
    fetchAuthors();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-slate-700" />
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Yazarlar</h2>
            <p className="text-sm text-slate-500 mt-1">Yazar profillerini yönetin</p>
          </div>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Yazar Ekle
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-800">{editingId ? 'Yazar Düzenle' : 'Yeni Yazar'}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">İsim Soyisim *</label>
                <input
                  type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  placeholder="Ahmet Yılmaz"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">E-posta *</label>
                <input
                  type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  placeholder="ahmet@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kısa Biyografi</label>
              <textarea
                rows={2} value={form.bio || ''}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm text-sm resize-y"
                placeholder="Avukat, göç hukuku uzmanı..."
              />
            </div>
            <div>
              <FileUpload
                label="Profil Fotoğrafı"
                value={form.profileImage || ''}
                onChange={v => setForm(f => ({ ...f, profileImage: v }))}
                accept="image/*"
                preview
                placeholder="URL girin veya görsel yükleyin"
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit" disabled={saving}
                className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                <Check className="w-4 h-4" />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Authors table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-400">Yükleniyor...</div>
        ) : authors.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Henüz yazar eklenmemiş</p>
            <p className="text-sm mt-1">Yukarıdaki "Yazar Ekle" butonunu kullanın</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Yazar</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">E-posta</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {authors.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {a.profileImage ? (
                        <img src={a.profileImage} alt={a.name} className="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-slate-500">{a.name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{a.name}</p>
                        {a.bio && <p className="text-xs text-slate-400 truncate max-w-xs">{a.bio}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{a.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${a.role === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {a.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(a)} className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 hover:bg-slate-100 rounded">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(a.id, a.name)} className="text-slate-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
