"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/admin/RichTextEditor';
import FileUpload from '@/components/admin/FileUpload';

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

type PostType = 'LEGAL' | 'NEWS' | 'SOCIAL';
type TabId = 'content' | 'source' | 'seo' | 'faq';

interface Category { id: string; name: string; }
interface Tag { id: string; name: string; }
interface FAQ { question: string; answer: string; }
interface UserOption { id: string; name: string; role: string; }

const POST_TYPE_CONFIG: Record<PostType, { label: string; badge: string; desc: string; sourceTab: string }> = {
  LEGAL:  { label: 'Yasal İçerik',  badge: 'bg-amber-100 text-amber-800 ring-amber-400',   desc: 'Kanun, yönetmelik, içtihat veya hukuki belge analizleri',            sourceTab: 'Yasal Kaynak' },
  NEWS:   { label: 'Haber',         badge: 'bg-blue-100 text-blue-800 ring-blue-400',       desc: 'Haber kaynaklarına dayalı hukuki yorum ve analizler',                 sourceTab: 'Haber Kaynağı' },
  SOCIAL: { label: 'Sosyal Medya',  badge: 'bg-purple-100 text-purple-800 ring-purple-400', desc: 'Sosyal medya paylaşımlarına dayalı hukuki yorum ve analizler',        sourceTab: 'Sosyal Medya' },
};

const LEGAL_DOC_TYPES = [
  { value: 'kanun',       label: 'Kanun' },
  { value: 'yönetmelik',  label: 'Yönetmelik' },
  { value: 'tebliğ',      label: 'Tebliğ' },
  { value: 'içtihat',     label: 'İçtihat' },
  { value: 'karar',       label: 'Mahkeme Kararı' },
  { value: 'genelge',     label: 'Genelge' },
  { value: 'act',         label: 'Act (Kanun)' },
  { value: 'regulation',  label: 'Regulation (Yönetmelik)' },
  { value: 'case-law',    label: 'Case Law (Emsal)' },
  { value: 'directive',   label: 'Directive (Direktif)' },
];

const SOCIAL_PLATFORMS = [
  { value: 'twitter',   label: 'X / Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin',  label: 'LinkedIn' },
  { value: 'facebook',  label: 'Facebook' },
  { value: 'tiktok',    label: 'TikTok' },
  { value: 'youtube',   label: 'YouTube' },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1 ${checked ? 'bg-slate-900' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
      <span className="text-sm text-slate-600">{label}</span>
    </label>
  );
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [paramsResolved, setParamsResolved] = useState<{ id: string } | null>(null);

  useEffect(() => { params.then(setParamsResolved); }, [params]);

  const isNew = paramsResolved?.id === 'new';
  const [activeTab, setActiveTab] = useState<TabId>('content');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [locale, setLocale] = useState('tr');
  const [categoryId, setCategoryId] = useState('');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [postType, setPostType] = useState<PostType>('LEGAL');

  // Content is stored in a ref so Quill typing doesn't re-render the rest of the form.
  // The ref is always up-to-date; a state setter is only used on initial load.
  const contentRef = useRef('');
  const [contentForEditor, setContentForEditor] = useState('');

  const handleContentChange = useCallback((v: string) => {
    contentRef.current = v;
  }, []);

  const [sourceUrl, setSourceUrl] = useState('');
  const [sourcePlatform, setSourcePlatform] = useState('twitter');
  const [embedCode, setEmbedCode] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceExcerpt, setSourceExcerpt] = useState('');
  const [sourceAuthor, setSourceAuthor] = useState('');
  const [sourceImageUrl, setSourceImageUrl] = useState('');
  const [sourceDate, setSourceDate] = useState('');

  const [coverImageUrl, setCoverImageUrl] = useState('');

  const [legalDocType, setLegalDocType] = useState('kanun');
  const [legalJurisdiction, setLegalJurisdiction] = useState('Avustralya');
  const [legalRefNumber, setLegalRefNumber] = useState('');
  const [legalPdfUrl, setLegalPdfUrl] = useState('');
  const [legalPdfTitle, setLegalPdfTitle] = useState('');

  const [showSourceBlock, setShowSourceBlock] = useState(true);
  const [showCommentary, setShowCommentary] = useState(true);

  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const [authorId, setAuthorId] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
    fetch('/api/tags').then(r => r.json()).then(setTags);
    fetch('/api/users').then(r => r.json()).then(setUsers);

    if (paramsResolved && !isNew) {
      fetch(`/api/posts/${paramsResolved.id}`).then(r => r.json()).then((data) => {
        setTitle(data.title || '');
        setSlug(data.slug || '');
        const c = data.content || '';
        contentRef.current = c;
        setContentForEditor(c);
        setIsPublished(data.isPublished || false);
        setLocale(data.locale || 'tr');
        setCategoryId(data.categoryId || '');
        setTagIds((data.tags || []).map((t: Tag) => t.id));
        setPostType(data.postType || 'LEGAL');
        setAuthorId(data.authorId || '');
        setCoverImageUrl(data.coverImageUrl || '');
        setSourceUrl(data.sourceUrl || '');
        setSourcePlatform(data.sourcePlatform || 'twitter');
        setEmbedCode(data.embedCode || '');
        setSourceTitle(data.sourceTitle || '');
        setSourceExcerpt(data.sourceExcerpt || '');
        setSourceAuthor(data.sourceAuthor || '');
        let imgUrl = data.sourceImageUrl || '';
        if (imgUrl && (imgUrl.includes('youtube.com/watch') || imgUrl.includes('youtu.be/'))) {
          imgUrl = getYouTubeThumbnail(data.sourceUrl || imgUrl) || '';
        }
        setSourceImageUrl(imgUrl);
        setSourceDate(data.sourceDate || '');
        setLegalDocType(data.legalDocType || 'kanun');
        setLegalJurisdiction(data.legalJurisdiction || 'Avustralya');
        setLegalRefNumber(data.legalRefNumber || '');
        setLegalPdfUrl(data.legalPdfUrl || '');
        setLegalPdfTitle(data.legalPdfTitle || '');
        setShowSourceBlock(data.showSourceBlock !== false);
        setShowCommentary(data.showCommentary !== false);
        setMetaTitle(data.metaTitle || '');
        setMetaDescription(data.metaDescription || '');
        setCanonicalUrl(data.canonicalUrl || '');
        setFaqs(data.faqs || []);
      });
    }
  }, [paramsResolved, isNew]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setTitle(v);
    if (isNew) {
      setSlug(
        v.toLowerCase()
          .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
          .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
          .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
      );
    }
  }, [isNew]);

  const updateFaqField = useCallback((idx: number, field: 'question' | 'answer', value: string) => {
    setFaqs(prev => prev.map((faq, i) => i === idx ? { ...faq, [field]: value } : faq));
  }, []);

  const removeFaq = useCallback((idx: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const addFaq = useCallback(() => {
    setFaqs(prev => [...prev, { question: '', answer: '' }]);
  }, []);

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title, slug, content: contentRef.current, isPublished, locale, categoryId, tagIds,
      postType,
      coverImageUrl: coverImageUrl || null,
      sourceUrl: sourceUrl || null,
      sourcePlatform: sourcePlatform || null,
      embedCode: embedCode || null,
      sourceTitle: sourceTitle || null,
      sourceExcerpt: sourceExcerpt || null,
      sourceAuthor: sourceAuthor || null,
      sourceImageUrl: sourceImageUrl || null,
      sourceDate: sourceDate || null,
      legalDocType: legalDocType || null,
      legalJurisdiction: legalJurisdiction || null,
      legalRefNumber: legalRefNumber || null,
      legalPdfUrl: legalPdfUrl || null,
      legalPdfTitle: legalPdfTitle || null,
      showSourceBlock,
      showCommentary,
      metaTitle, metaDescription, canonicalUrl, faqs,
      authorId: authorId || undefined,
    };

    const url = isNew ? '/api/posts' : `/api/posts/${paramsResolved?.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) router.push('/admin/posts');
    else alert('Kaydetme başarısız oldu. Lütfen tekrar deneyin.');
  }, [
    title, slug, isPublished, locale, categoryId, tagIds, postType,
    coverImageUrl, sourceUrl, sourcePlatform, embedCode, sourceTitle, sourceExcerpt,
    sourceAuthor, sourceImageUrl, sourceDate, legalDocType, legalJurisdiction,
    legalRefNumber, legalPdfUrl, legalPdfTitle, showSourceBlock, showCommentary,
    metaTitle, metaDescription, canonicalUrl, faqs, authorId, isNew, paramsResolved, router,
  ]);

  if (!paramsResolved) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Yükleniyor...</div>;
  }

  const cfg = POST_TYPE_CONFIG[postType];
  const tabs: { id: TabId; label: string }[] = [
    { id: 'content', label: 'İçerik & Görünürlük' },
    { id: 'source',  label: cfg.sourceTab },
    { id: 'seo',     label: 'SEO' },
    { id: 'faq',     label: `SSS (${faqs.length})` },
  ];

  return (
    <form onSubmit={handleSave} className="pb-24">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm px-4 py-3 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold font-serif text-slate-900 mr-2">
            {isNew ? 'Yeni Yazı' : 'Yazı Düzenle'}
          </h2>
          {(Object.keys(POST_TYPE_CONFIG) as PostType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPostType(type)}
              className={`px-3 py-1 text-xs font-bold rounded-full ring-1 transition-all ${
                postType === type
                  ? `${POST_TYPE_CONFIG[type].badge} ring-offset-1`
                  : 'bg-slate-100 text-slate-500 ring-transparent hover:bg-slate-200'
              }`}
            >
              {POST_TYPE_CONFIG[type].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Toggle checked={isPublished} onChange={setIsPublished} label="Yayınlansın" />
          <select
            value={locale}
            onChange={e => setLocale(e.target.value)}
            className="rounded border border-slate-300 text-sm p-1.5 text-slate-700 bg-white"
          >
            <option value="tr">🇹🇷 TR</option>
            <option value="en">🇦🇺 EN</option>
          </select>
          {!isNew && slug && (
            <a
              href={`/${locale}/article/${slug}${!isPublished ? '?preview=true' : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-300 text-slate-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Önizle ↗
            </a>
          )}
          <button type="submit" className="bg-slate-900 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors">
            Kaydet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Title & Slug */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Başlık *</label>
              <input
                type="text"
                required
                value={title}
                onChange={handleTitleChange}
                className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500 text-slate-900"
                placeholder="Yazı başlığı..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Slug (URL)</label>
              <div className="flex items-center rounded-md border border-slate-300 overflow-hidden shadow-sm">
                <span className="px-3 py-2.5 bg-slate-50 text-slate-400 text-sm border-r border-slate-300 select-none">/article/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="flex-1 p-2.5 font-mono text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Tabbed section */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-200 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-slate-900 text-slate-900 bg-white'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Tab: Content & Visibility */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {postType === 'LEGAL'  && 'Yasal Analiz İçeriği'}
                      {postType === 'NEWS'   && 'Haber Yorumu & Hukuki Analiz'}
                      {postType === 'SOCIAL' && 'Sosyal Medya Yorumu & Hukuki Analiz'}
                    </label>
                    <RichTextEditor value={contentForEditor} onChange={handleContentChange} />
                  </div>

                  {/* Cover image */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-slate-50">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Kapak Görseli</h4>
                    <FileUpload
                      value={coverImageUrl}
                      onChange={setCoverImageUrl}
                      accept="image/*"
                      preview
                      placeholder="URL girin veya görsel yükleyin"
                      hint="Ana sayfada ve listelemelerde yazının önizleme görseli olarak gösterilir."
                    />
                  </div>

                  {/* Visibility toggles */}
                  <div className="border border-slate-200 rounded-lg p-5 bg-slate-50 space-y-4">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Görünürlük Kontrolleri</h4>
                    <Toggle
                      checked={showSourceBlock}
                      onChange={setShowSourceBlock}
                      label={
                        postType === 'SOCIAL' ? 'Sosyal Medya Kaynak Bölümünü Göster' :
                        postType === 'NEWS'   ? 'Haber Kaynağı Bölümünü Göster' :
                                                'Yasal Referans Bölümünü Göster'
                      }
                    />
                    <Toggle
                      checked={showCommentary}
                      onChange={setShowCommentary}
                      label="Yorum & Analiz Bölümünü Göster"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Source (type-specific) */}
              {activeTab === 'source' && (
                <div className="space-y-5">
                  {/* SOCIAL */}
                  {postType === 'SOCIAL' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Platform *</label>
                          <select
                            value={sourcePlatform}
                            onChange={e => {
                              setSourcePlatform(e.target.value);
                              if (e.target.value === 'youtube' && sourceUrl) {
                                const thumb = getYouTubeThumbnail(sourceUrl);
                                if (thumb) setSourceImageUrl(thumb);
                              }
                            }}
                            className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm text-slate-700"
                          >
                            {SOCIAL_PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Hesap / Kullanıcı</label>
                          <input type="text" value={sourceAuthor} onChange={e => setSourceAuthor(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="@hesapadi veya Kurum Adı" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Paylaşım URL</label>
                        <input
                          type="url"
                          value={sourceUrl}
                          onChange={e => {
                            const val = e.target.value;
                            setSourceUrl(val);
                            if (sourcePlatform === 'youtube') {
                              const thumb = getYouTubeThumbnail(val);
                              if (thumb) setSourceImageUrl(thumb);
                            }
                          }}
                          className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm"
                          placeholder="https://twitter.com/user/status/..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Paylaşım İçeriği / Başlık</label>
                        <textarea rows={3} value={sourceTitle} onChange={e => setSourceTitle(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm resize-y" placeholder="Paylaşımın metni veya başlığı..." />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Embed Kodu
                          <span className="ml-1 text-xs text-slate-400 font-normal">(Platform&apos;dan kopyalanan oEmbed/iframe kodu)</span>
                        </label>
                        <textarea rows={6} value={embedCode} onChange={e => setEmbedCode(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 font-mono text-xs shadow-sm resize-y" placeholder={'<blockquote class="twitter-tweet">...</blockquote>\n<script async src="https://platform.twitter.com/widgets.js"></script>'} />
                        <p className="text-xs text-slate-400 mt-1">Embed kodu girilirse platformun resmi görünümü kullanılır. Girilmezse önizleme kartı gösterilir.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <FileUpload
                            label={`Önizleme Görseli${sourcePlatform === 'youtube' ? ' (YouTube URL girilince otomatik doldurulur)' : ''}`}
                            value={sourceImageUrl}
                            onChange={val => {
                              if (val && (val.includes('youtube.com/watch') || val.includes('youtu.be/'))) {
                                const thumb = getYouTubeThumbnail(val);
                                if (thumb) val = thumb;
                              }
                              setSourceImageUrl(val);
                            }}
                            accept="image/*"
                            preview
                            placeholder="URL girin veya görsel yükleyin"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Paylaşım Tarihi</label>
                          <input type="text" value={sourceDate} onChange={e => setSourceDate(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="15 Mart 2026" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* NEWS */}
                  {postType === 'NEWS' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Haber Kaynağı URL *</label>
                        <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="https://abc.net.au/news/..." />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Haber Başlığı</label>
                        <input type="text" value={sourceTitle} onChange={e => setSourceTitle(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="Haberin orijinal başlığı..." />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Yayın / Gazete</label>
                          <input type="text" value={sourceAuthor} onChange={e => setSourceAuthor(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="ABC News, The Australian..." />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Yayın Tarihi</label>
                          <input type="text" value={sourceDate} onChange={e => setSourceDate(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="28 Mart 2026" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Haber Özeti</label>
                        <textarea rows={4} value={sourceExcerpt} onChange={e => setSourceExcerpt(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm resize-y" placeholder="Haberin kısa özeti (2-3 cümle)..." />
                      </div>
                      <FileUpload
                        label="Haber Görseli"
                        value={sourceImageUrl}
                        onChange={setSourceImageUrl}
                        accept="image/*"
                        preview
                        placeholder="URL girin veya görsel yükleyin"
                      />
                    </>
                  )}

                  {/* LEGAL */}
                  {postType === 'LEGAL' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Yasal Belge URL</label>
                        <input type="url" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="https://legislation.gov.au/..." />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Belge / Kanun Adı</label>
                        <input type="text" value={sourceTitle} onChange={e => setSourceTitle(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="Migration Act 1958" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Belge Türü</label>
                          <select value={legalDocType} onChange={e => setLegalDocType(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm text-slate-700">
                            {LEGAL_DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Yargı Çevresi</label>
                          <input type="text" value={legalJurisdiction} onChange={e => setLegalJurisdiction(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="Avustralya" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Referans No</label>
                          <input type="text" value={legalRefNumber} onChange={e => setLegalRefNumber(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm font-mono text-sm" placeholder="Act No. 62 of 1958" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Yasal Kurum / Yayınlayan</label>
                          <input type="text" value={sourceAuthor} onChange={e => setSourceAuthor(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="Australian Government" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">Yürürlük / Yayın Tarihi</label>
                          <input type="text" value={sourceDate} onChange={e => setSourceDate(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="1 Ocak 2024" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Kısa Açıklama / Belge Önemi</label>
                        <textarea rows={4} value={sourceExcerpt} onChange={e => setSourceExcerpt(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm resize-y" placeholder="Bu belgenin önemi, kapsamı ve göç hukuku açısından değeri..." />
                      </div>

                      {/* İndirilebilir PDF */}
                      <div className="border border-amber-200 rounded-lg p-5 bg-amber-50/50 space-y-4 mt-2">
                        <h4 className="text-sm font-bold text-amber-800 uppercase tracking-wider flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          İndirilebilir PDF Belgesi
                        </h4>
                        <FileUpload
                          label="PDF Dosyası"
                          value={legalPdfUrl}
                          onChange={setLegalPdfUrl}
                          accept=".pdf,application/pdf"
                          placeholder="URL girin veya PDF yükleyin"
                          hint="Kullanıcıların indirebileceği PDF dosyası"
                        />
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1">PDF Başlığı</label>
                          <input
                            type="text"
                            value={legalPdfTitle}
                            onChange={e => setLegalPdfTitle(e.target.value)}
                            className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm"
                            placeholder="Migration Act 1958 — Tam Metin (PDF)"
                          />
                          <p className="text-xs text-slate-400 mt-1">Boş bırakılırsa kaynak başlığı kullanılır</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Tab: SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Meta Başlık</label>
                    <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="Arama motorlarında görünecek başlık (maks. 60 karakter)" />
                    <p className={`text-xs mt-1 ${metaTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>{metaTitle.length}/60 karakter</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Meta Açıklama</label>
                    <textarea rows={3} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm resize-y" placeholder="Arama sonuçlarında görünecek kısa açıklama (maks. 160 karakter)..." />
                    <p className={`text-xs mt-1 ${metaDescription.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>{metaDescription.length}/160 karakter</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Canonical URL</label>
                    <input type="url" value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} className="block w-full rounded-md border border-slate-300 p-2.5 shadow-sm" placeholder="https://..." />
                  </div>

                  {postType === 'NEWS' && !metaTitle && sourceTitle && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
                      <strong>İpucu:</strong> Meta başlık olarak haber başlığını kullanabilirsiniz:
                      <button type="button" onClick={() => setMetaTitle(sourceTitle.slice(0, 60))} className="ml-2 underline font-semibold">Uygula</button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: FAQ */}
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">Google SSS snippet&apos;i için yapılandırılmış veri (JSON-LD)</p>
                    <button
                      type="button"
                      onClick={addFaq}
                      className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-md font-medium hover:bg-slate-800 transition-colors"
                    >
                      + Soru Ekle
                    </button>
                  </div>
                  {faqs.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg">
                      <p className="text-slate-400 text-sm">Henüz soru eklenmedi</p>
                    </div>
                  )}
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-slate-200 p-4 rounded-lg space-y-3 relative bg-slate-50">
                      <button
                        type="button"
                        onClick={() => removeFaq(idx)}
                        className="absolute top-3 right-3 text-red-400 text-xs font-medium hover:text-red-600 transition-colors"
                      >
                        Kaldır
                      </button>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Soru</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={e => updateFaqField(idx, 'question', e.target.value)}
                          className="block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">Cevap</label>
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={e => updateFaqField(idx, 'answer', e.target.value)}
                          className="block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Post type info card */}
          <div className={`rounded-lg border p-4 ${
            postType === 'LEGAL'  ? 'bg-amber-50 border-amber-200' :
            postType === 'NEWS'   ? 'bg-blue-50 border-blue-200' :
                                    'bg-purple-50 border-purple-200'
          }`}>
            <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full mb-2 ${cfg.badge}`}>
              {cfg.label}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">{cfg.desc}</p>
            <div className="mt-3 space-y-1 text-xs text-slate-500">
              <p className={`flex items-center gap-1.5 ${showSourceBlock ? 'text-green-700' : 'text-slate-400 line-through'}`}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${showSourceBlock ? 'bg-green-500' : 'bg-slate-300'}`} />
                Kaynak bölümü {showSourceBlock ? 'görünür' : 'gizli'}
              </p>
              <p className={`flex items-center gap-1.5 ${showCommentary ? 'text-green-700' : 'text-slate-400 line-through'}`}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${showCommentary ? 'bg-green-500' : 'bg-slate-300'}`} />
                Analiz bölümü {showCommentary ? 'görünür' : 'gizli'}
              </p>
            </div>
          </div>

          {/* Author */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Yazar</h3>
            <select
              value={authorId}
              onChange={e => setAuthorId(e.target.value)}
              className="block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm text-slate-700"
            >
              <option value="">Yazar seçin...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
            {!authorId && (
              <p className="text-xs text-amber-600">Yazar seçilmezse yazı yazarsız kaydedilir.</p>
            )}
          </div>

          {/* Category & Tags */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Taksonomi</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Kategori</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm text-slate-700"
              >
                <option value="">Kategori seçin...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Etiketler</label>
              <div className="border border-slate-300 rounded-md p-3 max-h-48 overflow-y-auto space-y-1.5">
                {tags.map(tag => (
                  <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tagIds.includes(tag.id)}
                      onChange={e => {
                        if (e.target.checked) setTagIds(prev => [...prev, tag.id]);
                        else setTagIds(prev => prev.filter(id => id !== tag.id));
                      }}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
                    />
                    <span className="text-sm text-slate-700">{tag.name}</span>
                  </label>
                ))}
                {tags.length === 0 && <p className="text-xs text-slate-400">Etiket bulunamadı</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
