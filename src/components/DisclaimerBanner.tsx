import { t, Locale } from '@/lib/i18n';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner({
  lang,
  visible = true,
}: {
  lang: Locale;
  visible?: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="w-full bg-[#1a2332] z-[60] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-start gap-3 bg-[#243044] rounded-lg border-l-4 border-[#d4a843] px-4 py-3.5">
          <AlertTriangle className="w-5 h-5 text-[#d4a843] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/80 leading-relaxed">
            <span className="font-semibold text-white/95">{t(lang, 'disclaimer.title')}</span>{' '}
            {t(lang, 'disclaimer.text')}
          </p>
        </div>
      </div>
    </div>
  );
}
