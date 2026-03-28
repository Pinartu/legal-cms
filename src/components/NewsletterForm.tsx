"use client";

import { useState } from 'react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';

export default function NewsletterForm({ lang }: { lang: Locale }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('success');
    setEmail('');
  };

  if (status === 'success') {
    return (
      <p className="text-[#b8860b] text-sm font-semibold">
        ✓ {lang === 'tr' ? 'Kaydınız alındı, teşekkürler!' : 'You\'ve been subscribed, thank you!'}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-0 w-full md:w-auto" suppressHydrationWarning>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={t(lang, 'sections.email_placeholder')}
        required
        suppressHydrationWarning
        className="bg-white/10 border border-white/20 text-white placeholder:text-white/30 px-5 py-3 text-sm focus:outline-none focus:border-[#b8860b] transition-colors flex-grow md:w-72"
      />
      <button
        type="submit"
        suppressHydrationWarning
        className="bg-[#b8860b] hover:bg-[#d4a843] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
      >
        {t(lang, 'sections.subscribe')}
      </button>
    </form>
  );
}
