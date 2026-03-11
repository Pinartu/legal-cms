"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import react-quill to avoid SSR errors
export const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new');
    return function ForwardedQuill(props: any) {
      return <RQ {...props} />;
    };
  },
  { ssr: false, loading: () => <div className="h-64 bg-slate-100 animate-pulse rounded-md" /> }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  // Advanced requirements: H1-H6 hierarchy, bold/italic/underline, lists, custom blockquotes, inline hyperlinking
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'link'],
      ['clean'] 
    ],
  }), []);

  return (
    <div className="bg-white">
       <ReactQuill theme="snow" value={value} onChange={onChange} modules={modules} />
    </div>
  );
}
