import { t, Locale } from '@/lib/i18n';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner({
  lang,
  visible = true,
  title,
  text,
}: {
  lang: Locale;
  visible?: boolean;
  title?: string;
  text?: string;
}) {
  if (!visible) return null;

  const displayTitle = title || t(lang, 'disclaimer.title');
  const displayText = text || t(lang, 'disclaimer.text');

  return (
    <div className="w-full bg-[#1a2332] relative z-40 pt-[90px] mb-[-90px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 bg-[#1a2332]">
        <div className="flex items-start gap-3 bg-[#243044] rounded-lg border-l-4 border-[#d4a843] px-4 py-3.5 shadow-md">
          <AlertTriangle className="w-5 h-5 text-[#d4a843] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/80 leading-relaxed">
            <span className="font-semibold text-white/95">{displayTitle}</span>{' '}
            {displayText}
          </p>
        </div>
      </div>
    </div>
  );
}
