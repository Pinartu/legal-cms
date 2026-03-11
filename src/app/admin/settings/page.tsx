"use client";

import { useState, useEffect } from 'react';
import { Settings, Globe, Share2, Mail } from 'lucide-react';

const GENERAL_KEYS = ['site_title', 'site_description', 'contact_email', 'contact_phone', 'footer_text', 'about_page'];
const SOCIAL_KEYS = ['social_linkedin', 'social_youtube', 'social_x', 'social_facebook'];
const ALL_KEYS = [...GENERAL_KEYS, ...SOCIAL_KEYS];

const LABELS: Record<string, string> = {
  site_title: 'Site Başlığı',
  site_description: 'Site Açıklaması (SEO)',
  contact_email: 'İletişim E-posta',
  contact_phone: 'İletişim Telefon',
  footer_text: 'Footer Metni',
  about_page: 'Hakkımızda Sayfası Metni',
  social_linkedin: 'LinkedIn URL',
  social_youtube: 'YouTube URL',
  social_x: 'X (Twitter) URL',
  social_facebook: 'Facebook URL',
};

const PLACEHOLDERS: Record<string, string> = {
  social_linkedin: 'https://linkedin.com/company/firmaniz',
  social_youtube: 'https://youtube.com/@kanaliniz',
  social_x: 'https://x.com/hesabiniz',
  social_facebook: 'https://facebook.com/sayfaniz',
  site_description: 'Ticaret hukuku alanında kapsamlı hukuki danışmanlık',
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'social'>('general');

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const settingsMap: Record<string, string> = {};
        data.forEach((s: any) => { settingsMap[s.key] = s.value; });
        setSettings(settingsMap);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      for (const key of ALL_KEYS) {
        if (settings[key] !== undefined) {
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, value: settings[key] || '' })
          });
        }
      }
      alert('Ayarlar başarıyla kaydedildi!');
    } catch (err) {
      alert('Ayarlar kaydedilirken hata oluştu.');
    }
    setSaving(false);
  };

  const currentKeys = activeTab === 'general' ? GENERAL_KEYS : SOCIAL_KEYS;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-slate-700" />
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Ayarlar</h2>
          <p className="text-sm text-slate-500 mt-1">Site geneli ayarlar ve sosyal medya bilgileri</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button onClick={() => setActiveTab('general')} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'general' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
          <Globe className="w-4 h-4" /> Genel Ayarlar
        </button>
        <button onClick={() => setActiveTab('social')} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'social' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
          <Share2 className="w-4 h-4" /> Sosyal Medya
        </button>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6 border border-slate-200">
        <form onSubmit={handleSave} className="space-y-6">
          {currentKeys.map(key => (
            <div key={key}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {LABELS[key] || key}
              </label>
              {key === 'about_page' || key === 'footer_text' ? (
                <textarea
                  rows={4}
                  value={settings[key] || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-3 border"
                />
              ) : (
                <input
                  type={key.startsWith('social_') ? 'url' : 'text'}
                  value={settings[key] || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  placeholder={PLACEHOLDERS[key] || ''}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-3 border"
                />
              )}
              {key.startsWith('social_') && (
                <p className="text-xs text-slate-400 mt-1">Boş bırakırsanız footer'da gösterilmez</p>
              )}
            </div>
          ))}

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center rounded-lg border border-transparent bg-slate-900 py-3 px-6 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
