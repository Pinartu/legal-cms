"use client";

import { useState, useEffect } from 'react';
import { Settings, Globe, Share2, Type } from 'lucide-react';
import FileUpload from '@/components/admin/FileUpload';

const GENERAL_KEYS = [
  'site_title',
  'site_tagline_tr',
  'site_tagline_en',
  'site_logo_url',
  'site_logo_url_tr',
  'site_logo_url_en',
  'site_description',
  'site_canonical_base_url',
  'site_og_image_url',
  'site_twitter_handle',
  'contact_email',
  'contact_phone',
  'contact_address',
];
const APPEARANCE_KEYS = ['disclaimer_visible', 'disclaimer_title_tr', 'disclaimer_text_tr', 'disclaimer_title_en', 'disclaimer_text_en', 'footer_description', 'footer_description_en', 'footer_text', 'footer_text_en', 'about_page'];
const SOCIAL_KEYS = ['social_linkedin', 'social_youtube', 'social_x', 'social_facebook'];
const ALL_KEYS = [...GENERAL_KEYS, ...APPEARANCE_KEYS, ...SOCIAL_KEYS];

const LABELS: Record<string, string> = {
  site_title: 'Site Başlığı / Logo Metni',
  site_tagline_tr: 'Alt Başlık / Slogan (TR)',
  site_tagline_en: 'Alt Başlık / Slogan (EN)',
  site_logo_url: 'Logo Görsel URL (varsayılan)',
  site_logo_url_tr: 'Logo (TR) — görsel yükleme',
  site_logo_url_en: 'Logo (EN) — görsel yükleme',
  site_description: 'Site Açıklaması (varsayılan meta description)',
  site_canonical_base_url: 'Canonical / site kök URL',
  site_og_image_url: 'Open Graph görseli (sosyal paylaşım)',
  site_twitter_handle: 'Twitter / X kullanıcı adı',
  contact_email: 'İletişim E-posta',
  contact_phone: 'İletişim Telefon',
  contact_address: 'İletişim Adresi',
  disclaimer_visible: 'Yasal Uyarı Kutusu Görünürlüğü',
  disclaimer_title_tr: 'Yasal Uyarı Başlığı (TR)',
  disclaimer_text_tr: 'Yasal Uyarı Metni (TR)',
  disclaimer_title_en: 'Yasal Uyarı Başlığı (EN)',
  disclaimer_text_en: 'Yasal Uyarı Metni (EN)',
  footer_description: 'Footer Açıklama (Türkçe)',
  footer_description_en: 'Footer Açıklama (English)',
  footer_text: 'Footer Ek Metin (Türkçe)',
  footer_text_en: 'Footer Ek Metin (English)',
  about_page: 'Hakkımızda Sayfası Metni',
  social_linkedin: 'LinkedIn URL',
  social_youtube: 'YouTube URL',
  social_x: 'X (Twitter) URL',
  social_facebook: 'Facebook URL',
};

const PLACEHOLDERS: Record<string, string> = {
  site_title: 'LEGALINSIGHTS',
  site_tagline_tr: 'Ticaret Hukuku Danışmanlığı',
  site_tagline_en: 'Commercial Law Advisory',
  site_logo_url: 'https://example.com/logo.png',
  site_logo_url_tr: '',
  site_logo_url_en: '',
  site_canonical_base_url: 'https://auinsight.com',
  site_og_image_url: 'https://example.com/og-1200x630.jpg',
  site_twitter_handle: 'hesabiniz',
  contact_email: 'info@legalinsights.com',
  contact_phone: '+90 (212) 555 00 00',
  contact_address: 'Levent Mah. Büyükdere Cad.\nNo: 100, Kat: 12\n34394 Beşiktaş / İstanbul',
  disclaimer_title_tr: 'Yasal uyarı:',
  disclaimer_text_tr: 'Bu sitedeki içerikler yalnızca genel bilgi amaçlıdır...',
  disclaimer_title_en: 'Legal disclaimer:',
  disclaimer_text_en: 'The content on this site is for general informational purposes only...',
  footer_description: 'Ticaret hukuku alanında uzmanlaşmış bir hukuk platformu.',
  footer_description_en: 'An independent legal platform specializing in commercial law.',
  site_description: 'Ticaret hukuku alanında kapsamlı hukuki danışmanlık',
  social_linkedin: 'https://linkedin.com/company/firmaniz',
  social_youtube: 'https://youtube.com/@kanaliniz',
  social_x: 'https://x.com/hesabiniz',
  social_facebook: 'https://facebook.com/sayfaniz',
};

const HINTS: Record<string, string> = {
  site_title: 'Header ve footer\'da görünen logo metni (örn: LEGALINSIGHTS)',
  site_tagline_tr: 'Logo altında görünen kısa açıklama (Türkçe)',
  site_tagline_en: 'Logo altında görünen kısa açıklama (English)',
  site_logo_url: 'Tüm diller için varsayılan logo. TR/EN için ayrı logo yoksa bu kullanılır.',
  site_logo_url_tr: 'Türkçe sitede header/footer’da gösterilir; boşsa varsayılan logo kullanılır.',
  site_logo_url_en: 'İngilizce sitede header/footer’da gösterilir; boşsa varsayılan logo kullanılır.',
  site_canonical_base_url: 'metadataBase ve JSON-LD URL’leri için (sonunda / olmadan, örn: https://auinsight.com)',
  site_og_image_url: 'Facebook, LinkedIn vb. paylaşımlarda kullanılır. Önerilen boyut 1200×630 px.',
  site_twitter_handle: '@ işareti olmadan yazın (örn: hesabiniz). Twitter/X kart meta verilerinde kullanılır.',
  site_description: 'Tüm sayfalarda varsayılan meta description; yazıda özel açıklama yoksa kullanılır.',
  contact_email: 'Header üst çubuğunda ve footer\'da gösterilir',
  contact_phone: 'Header üst çubuğunda ve footer\'da gösterilir',
  contact_address: 'Footer\'daki iletişim bölümünde gösterilir. Her satır için yeni satır kullanın.',
  disclaimer_visible: 'Tüm sayfalarda header üstünde yasal uyarı kutusu gösterir. "true" = göster, "false" = gizle.',
  disclaimer_title_tr: 'Boş bırakılırsa varsayılan metin kullanılır',
  disclaimer_text_tr: 'Boş bırakılırsa varsayılan metin kullanılır',
  disclaimer_title_en: 'Boş bırakılırsa varsayılan metin kullanılır',
  disclaimer_text_en: 'Boş bırakılırsa varsayılan metin kullanılır',
  footer_description: 'Footer\'da logo altında görünen açıklama metni (Türkçe site için)',
  footer_description_en: 'Footer\'da logo altında görünen açıklama metni (İngilizce site için)',
  footer_text: 'Footer\'da ek metin alanı (Türkçe)',
  footer_text_en: 'Footer\'da ek metin alanı (İngilizce)',
};

const TEXTAREA_KEYS = ['about_page', 'footer_text', 'footer_text_en', 'footer_description', 'footer_description_en', 'contact_address', 'site_description', 'disclaimer_text_tr', 'disclaimer_text_en'];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'social'>('general');

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
    setSaved(false);
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
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Ayarlar kaydedilirken hata oluştu.');
    }
    setSaving(false);
  };

  const currentKeys = activeTab === 'general' ? GENERAL_KEYS : activeTab === 'appearance' ? APPEARANCE_KEYS : SOCIAL_KEYS;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-slate-700" />
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">Ayarlar</h2>
          <p className="text-sm text-slate-500 mt-1">Site geneli ayarlar, görünüm ve sosyal medya bilgileri</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button onClick={() => setActiveTab('general')} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'general' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
          <Globe className="w-4 h-4" /> Genel Ayarlar
        </button>
        <button onClick={() => setActiveTab('appearance')} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
          <Type className="w-4 h-4" /> Görünüm
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
              {['site_logo_url', 'site_logo_url_tr', 'site_logo_url_en', 'site_og_image_url'].includes(key) ? (
                <FileUpload
                  value={settings[key] || ''}
                  onChange={v => handleChange(key, v)}
                  accept="image/*"
                  preview
                  hint={HINTS[key]}
                  placeholder={PLACEHOLDERS[key] || ''}
                />
              ) : key === 'disclaimer_visible' ? (
                <select
                  value={settings[key] || 'true'}
                  onChange={e => handleChange(key, e.target.value)}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm p-3 border bg-white"
                >
                  <option value="true">Göster (Visible)</option>
                  <option value="false">Gizle (Hidden)</option>
                </select>
              ) : TEXTAREA_KEYS.includes(key) ? (
                <textarea
                  rows={key === 'about_page' ? 6 : 3}
                  value={settings[key] || ''}
                  onChange={e => handleChange(key, e.target.value)}
                  placeholder={PLACEHOLDERS[key] || ''}
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
              {HINTS[key] && (
                <p className="text-xs text-slate-400 mt-1">{HINTS[key]}</p>
              )}
              {key.startsWith('social_') && (
                <p className="text-xs text-slate-400 mt-1">Boş bırakırsanız footer&apos;da gösterilmez</p>
              )}
            </div>
          ))}

          <div className="pt-4 flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center rounded-lg border border-transparent bg-slate-900 py-3 px-6 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            {saved && (
              <span className="text-sm text-green-600 font-medium">✓ Ayarlar başarıyla kaydedildi!</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
