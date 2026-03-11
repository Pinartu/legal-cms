"use client";

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { SECTION_TYPES, MANAGED_PAGES } from '@/lib/section-types';
import { ArrowUp, ArrowDown, Eye, EyeOff, Trash2, Plus, Save, GripVertical, X, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type Lang = 'tr' | 'en';

export default function PageBuilderPage() {
  const params = useParams();
  const pageId = params.pageId as string;
  const pageLabel = MANAGED_PAGES.find(p => p.id === pageId)?.label || pageId;

  const [sections, setSections] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<Lang>('tr');

  const fetchSections = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/sections?pageId=${pageId}`);
    if (res.ok) {
      const data = await res.json();
      setSections(data.map((s: any) => ({
        ...s,
        content: typeof s.content === 'string' ? JSON.parse(s.content) : s.content,
      })));
    }
    setLoading(false);
  }, [pageId]);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const selectedSection = sections.find(s => s.id === selectedId);
  const selectedType = selectedSection ? SECTION_TYPES.find(t => t.type === selectedSection.type) : null;

  // Get content for active language (bilingual format: {tr: {...}, en: {...}})
  const getContent = (section: any): any => {
    if (section.content?.tr && section.content?.en) return section.content[activeLang];
    return section.content; // legacy flat format
  };

  const moveSection = async (id: string, direction: 'up' | 'down') => {
    const idx = sections.findIndex(s => s.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sections.length - 1)) return;
    const newSections = [...sections];
    const swap = direction === 'up' ? idx - 1 : idx + 1;
    [newSections[idx], newSections[swap]] = [newSections[swap], newSections[idx]];
    setSections(newSections);
    await fetch('/api/sections/reorder', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderedIds: newSections.map(s => s.id) }) });
  };

  const toggleVisibility = async (id: string) => {
    const section = sections.find(s => s.id === id);
    if (!section) return;
    const newVisible = !section.isVisible;
    setSections(prev => prev.map(s => s.id === id ? { ...s, isVisible: newVisible } : s));
    await fetch(`/api/sections/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isVisible: newVisible }) });
  };

  const deleteSection = async (id: string) => {
    if (!confirm('Bu bölümü silmek istediğinize emin misiniz?')) return;
    await fetch(`/api/sections/${id}`, { method: 'DELETE' });
    setSections(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addSection = async (type: string) => {
    const typeDef = SECTION_TYPES.find(t => t.type === type);
    if (!typeDef) return;
    // Create bilingual content with default values for both languages
    const bilingualContent = { tr: typeDef.defaultContent, en: { ...typeDef.defaultContent } };
    const res = await fetch('/api/sections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageId, type, content: bilingualContent }) });
    if (res.ok) { setShowAddModal(false); await fetchSections(); }
  };

  const saveSection = async () => {
    if (!selectedSection) return;
    setSaving(true);
    await fetch(`/api/sections/${selectedSection.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: selectedSection.content }) });
    setSaving(false);
  };

  // Update field for active language
  const updateField = (key: string, value: any) => {
    setSections(prev => prev.map(s => {
      if (s.id !== selectedId) return s;
      if (s.content?.tr && s.content?.en) {
        return { ...s, content: { ...s.content, [activeLang]: { ...s.content[activeLang], [key]: value } } };
      }
      return { ...s, content: { ...s.content, [key]: value } };
    }));
  };

  const updateArrayItem = (arrayKey: string, index: number, fieldKey: string, value: any) => {
    setSections(prev => prev.map(s => {
      if (s.id !== selectedId) return s;
      const langContent = s.content?.tr && s.content?.en ? s.content[activeLang] : s.content;
      const arr = [...(langContent[arrayKey] || [])];
      arr[index] = { ...arr[index], [fieldKey]: value };
      if (s.content?.tr && s.content?.en) {
        return { ...s, content: { ...s.content, [activeLang]: { ...langContent, [arrayKey]: arr } } };
      }
      return { ...s, content: { ...s.content, [arrayKey]: arr } };
    }));
  };

  const addArrayItem = (arrayKey: string, fields: any[]) => {
    setSections(prev => prev.map(s => {
      if (s.id !== selectedId) return s;
      const langContent = s.content?.tr && s.content?.en ? s.content[activeLang] : s.content;
      const arr = [...(langContent[arrayKey] || [])];
      const newItem: Record<string, string> = {};
      fields.forEach(f => { newItem[f.key] = ''; });
      arr.push(newItem);
      if (s.content?.tr && s.content?.en) {
        return { ...s, content: { ...s.content, [activeLang]: { ...langContent, [arrayKey]: arr } } };
      }
      return { ...s, content: { ...s.content, [arrayKey]: arr } };
    }));
  };

  const removeArrayItem = (arrayKey: string, index: number) => {
    setSections(prev => prev.map(s => {
      if (s.id !== selectedId) return s;
      const langContent = s.content?.tr && s.content?.en ? s.content[activeLang] : s.content;
      const arr = [...(langContent[arrayKey] || [])];
      arr.splice(index, 1);
      if (s.content?.tr && s.content?.en) {
        return { ...s, content: { ...s.content, [activeLang]: { ...langContent, [arrayKey]: arr } } };
      }
      return { ...s, content: { ...s.content, [arrayKey]: arr } };
    }));
  };

  const currentContent = selectedSection ? getContent(selectedSection) : null;

  return (
    <div className="h-[calc(100vh-64px)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages" className="text-slate-400 hover:text-slate-600 transition-colors"><ChevronLeft className="w-5 h-5" /></Link>
          <h2 className="text-2xl font-serif font-bold text-slate-900">{pageLabel} — Bölüm Düzenleyici</h2>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          <Plus className="w-4 h-4" /> Bölüm Ekle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left: Section List */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg overflow-auto" style={{maxHeight: 'calc(100vh - 180px)'}}>
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Sayfa Bölümleri ({sections.length})</p>
            </div>
            {sections.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <p className="mb-2">Henüz bölüm eklenmemiş.</p>
                <button onClick={() => setShowAddModal(true)} className="text-slate-900 underline text-sm">İlk bölümü ekleyin</button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sections.map((section) => {
                  const typeDef = SECTION_TYPES.find(t => t.type === section.type);
                  const isSelected = selectedId === section.id;
                  return (
                    <div key={section.id} className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${isSelected ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`} onClick={() => setSelectedId(section.id)}>
                      <GripVertical className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-slate-400' : 'text-slate-300'}`} />
                      <div className="flex-grow min-w-0">
                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{typeDef?.label || section.type}</p>
                        <p className={`text-xs truncate ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>{typeDef?.description || ''}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'up'); }} className={`p-1 rounded ${isSelected ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} transition-colors`}><ArrowUp className="w-3.5 h-3.5" /></button>
                        <button onClick={(e) => { e.stopPropagation(); moveSection(section.id, 'down'); }} className={`p-1 rounded ${isSelected ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} transition-colors`}><ArrowDown className="w-3.5 h-3.5" /></button>
                        <button onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id); }} className={`p-1 rounded ${isSelected ? 'hover:bg-slate-700' : 'hover:bg-slate-200'} transition-colors`}>{section.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 opacity-50" />}</button>
                        <button onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }} className={`p-1 rounded ${isSelected ? 'hover:bg-red-600' : 'hover:bg-red-50 text-red-500'} transition-colors`}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Section Editor */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg overflow-auto" style={{maxHeight: 'calc(100vh - 180px)'}}>
            {!selectedSection ? (
              <div className="flex items-center justify-center h-full text-slate-400 p-8"><p className="text-center">Düzenlemek için sol panelden<br />bir bölüm seçin</p></div>
            ) : (
              <div>
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selectedType?.label}</p>
                    <p className="text-xs text-slate-400">{selectedType?.description}</p>
                  </div>
                  <button onClick={saveSection} disabled={saving} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-50">
                    <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>

                {/* Language Tabs */}
                <div className="flex border-b border-slate-200">
                  {(['tr', 'en'] as Lang[]).map((l) => (
                    <button key={l} onClick={() => setActiveLang(l)} className={`flex-1 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${activeLang === l ? 'text-slate-900 border-b-2 border-slate-900 bg-white' : 'text-slate-400 hover:text-slate-600 bg-slate-50'}`}>
                      {l === 'tr' ? '🇹🇷 Türkçe' : '🇬🇧 English'}
                    </button>
                  ))}
                </div>

                <div className="p-6 space-y-5">
                  {selectedType?.fields.map(field => {
                    if (field.type === 'array') {
                      const items = currentContent?.[field.key] || [];
                      return (
                        <div key={field.key}>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">{field.label}</label>
                          <div className="space-y-3">
                            {items.map((item: any, i: number) => (
                              <div key={i} className="border border-slate-200 rounded-lg p-4 relative group">
                                <button onClick={() => removeArrayItem(field.key, i)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {field.arrayFields?.map(af => (
                                    <div key={af.key}>
                                      <label className="block text-[10px] font-medium text-slate-500 mb-1">{af.label}</label>
                                      {af.type === 'select' ? (
                                        <select value={item[af.key] || ''} onChange={e => updateArrayItem(field.key, i, af.key, e.target.value)} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-slate-500 focus:outline-none">
                                          {af.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                        </select>
                                      ) : (
                                        <input type="text" value={item[af.key] || ''} onChange={e => updateArrayItem(field.key, i, af.key, e.target.value)} placeholder={af.placeholder} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => addArrayItem(field.key, field.arrayFields || [])} className="mt-2 text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Yeni Ekle</button>
                        </div>
                      );
                    }

                    return (
                      <div key={field.key}>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">{field.label}</label>
                        {field.type === 'textarea' || field.type === 'richtext' ? (
                          <textarea rows={field.type === 'richtext' ? 8 : 3} value={currentContent?.[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} placeholder={field.placeholder} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-slate-500 focus:outline-none resize-none" />
                        ) : field.type === 'select' ? (
                          <select value={currentContent?.[field.key] || ''} onChange={e => updateField(field.key, e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-slate-500 focus:outline-none">
                            {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                          </select>
                        ) : (
                          <input type={field.type === 'number' ? 'number' : 'text'} value={currentContent?.[field.key] || ''} onChange={e => updateField(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)} placeholder={field.placeholder} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-slate-500 focus:outline-none" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-auto m-4">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-slate-900">Yeni Bölüm Ekle</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECTION_TYPES.map(type => (
                <button key={type.type} onClick={() => addSection(type.type)} className="text-left p-4 border border-slate-200 rounded-lg hover:border-slate-400 hover:shadow-md transition-all group">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 mb-1">{type.label}</p>
                  <p className="text-xs text-slate-400">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
