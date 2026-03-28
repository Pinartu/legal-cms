"use client";

import dynamic from 'next/dynamic';
import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(
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

const DEBOUNCE_MS = 300;

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const onChangeRef = useRef(onChange);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isExternalUpdate = useRef(false);

  onChangeRef.current = onChange;

  useEffect(() => {
    if (value !== localValue) {
      isExternalUpdate.current = true;
      setLocalValue(value);
    }
    // Only sync when parent pushes a genuinely new value (e.g. on load)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = useCallback((v: string) => {
    if (isExternalUpdate.current) {
      isExternalUpdate.current = false;
      return;
    }
    setLocalValue(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChangeRef.current(v), DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

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
      <ReactQuill theme="snow" value={localValue} onChange={handleChange} modules={modules} />
    </div>
  );
}
