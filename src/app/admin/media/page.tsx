"use client";

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export default function MediaPage() {
  const [mediaList, setMediaList] = useState([]);
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('image/png');
  const [altText, setAltText] = useState('');

  const fetchMedia = async () => {
    const res = await fetch('/api/media');
    if (res.ok) setMediaList(await res.json());
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!altText) {
      alert("Alt text is mandatory for all images.");
      return;
    }
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, fileName, fileType, altText }),
    });
    if (res.ok) {
        setUrl(''); setFileName(''); setAltText('');
        fetchMedia();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 shadow sm:rounded-lg border border-slate-200">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Add Media Link / External File</h3>
        <p className="text-sm text-slate-500 mb-6">Enter external URLs for images or PDF attachments to use in your articles.</p>
        
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">File Name</label>
            <input required type="text" value={fileName} onChange={e => setFileName(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-slate-500 focus:ring-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">URL</label>
            <input required type="url" value={url} onChange={e => setUrl(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-slate-500 focus:ring-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Alt Text (Mandatory)</label>
            <input required type="text" value={altText} onChange={e => setAltText(e.target.value)} placeholder="Describe the image..." className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-slate-500 focus:ring-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">File Type</label>
            <select value={fileType} onChange={e => setFileType(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-slate-500 focus:ring-slate-500">
              <option value="image/png">Image (PNG/JPG)</option>
              <option value="application/pdf">Document (PDF)</option>
            </select>
          </div>
          <div className="md:col-span-2 pt-2">
            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm font-medium">Add Media</button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow sm:rounded-lg border border-slate-200 overflow-hidden">
        <ul className="divide-y divide-slate-200">
          {mediaList.map((m: any) => (
            <li key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
               <div className="flex items-center space-x-4">
                 <div className="flex-shrink-0 h-10 w-10 bg-slate-100 flex items-center justify-center rounded-md border border-slate-200">
                   {m.fileType.includes('image') ? <ImageIcon className="h-5 w-5 text-slate-500" /> : <LinkIcon className="h-5 w-5 text-slate-500" />}
                 </div>
                 <div>
                   <p className="text-sm font-medium text-slate-900">{m.fileName}</p>
                   <p className="text-sm text-slate-500 truncate max-w-sm">{m.altText} • {m.url}</p>
                 </div>
               </div>
               <div className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                 ID: {m.id}
               </div>
            </li>
          ))}
          {mediaList.length === 0 && <li className="p-4 text-center text-slate-500 text-sm">No media added yet.</li>}
        </ul>
      </div>
    </div>
  );
}
