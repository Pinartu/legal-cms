"use client";

import { useState, useRef } from 'react';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
  hint?: string;
  placeholder?: string;
  /** Show image preview for the current value */
  preview?: boolean;
}

export default function FileUpload({
  value,
  onChange,
  accept = 'image/*,.pdf',
  label,
  hint,
  placeholder = 'https://... veya dosya yükleyin',
  preview = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Yükleme başarısız');
        return;
      }
      onChange(data.url);
    } catch {
      setError('Yükleme sırasında bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const isPdf = value?.toLowerCase().endsWith('.pdf');
  const isImage = value && !isPdf && (
    value.match(/\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i) || value.startsWith('/uploads/images/')
  );

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}

      {/* URL input + upload button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-slate-300 p-2.5 shadow-sm text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
        />
        <label
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-md cursor-pointer transition-colors whitespace-nowrap ${
            uploading
              ? 'bg-slate-200 text-slate-400 cursor-wait'
              : 'bg-slate-900 text-white hover:bg-slate-800'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Yükleniyor...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Yükle
            </>
          )}
        </label>
      </div>

      {/* Drag & drop zone (only shown when value is empty) */}
      {!value && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-4 text-center text-sm transition-colors ${
            dragOver ? 'border-slate-500 bg-slate-50' : 'border-slate-200 text-slate-400'
          }`}
        >
          Dosyayı buraya sürükleyip bırakın
        </div>
      )}

      {/* Error */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Hint */}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}

      {/* Preview */}
      {preview && isImage && value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Önizleme"
            className="h-20 w-auto rounded border border-slate-200 object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* PDF preview */}
      {isPdf && value && (
        <div className="flex items-center gap-2 text-sm bg-amber-50 border border-amber-200 rounded px-3 py-2">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="text-amber-800 truncate flex-1">{value.split('/').pop()}</span>
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-800 underline text-xs whitespace-nowrap">Görüntüle</a>
          <button type="button" onClick={() => onChange('')} className="text-red-400 hover:text-red-600 text-xs whitespace-nowrap">Kaldır</button>
        </div>
      )}
    </div>
  );
}
