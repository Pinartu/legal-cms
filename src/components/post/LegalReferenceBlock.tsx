import { ExternalLink, Scale, BookOpen, FileDown } from 'lucide-react';

interface LegalReferenceBlockProps {
  sourceUrl?: string | null;
  sourceTitle?: string | null;
  sourceExcerpt?: string | null;
  sourceAuthor?: string | null;
  sourceDate?: string | null;
  legalDocType?: string | null;
  legalJurisdiction?: string | null;
  legalRefNumber?: string | null;
  legalPdfUrl?: string | null;
  legalPdfTitle?: string | null;
}

const DOC_TYPE_LABELS: Record<string, string> = {
  kanun:       'Kanun',
  yönetmelik:  'Yönetmelik',
  tebliğ:      'Tebliğ',
  içtihat:     'İçtihat',
  karar:       'Mahkeme Kararı',
  genelge:     'Genelge',
  act:         'Act (Kanun)',
  regulation:  'Regulation (Yönetmelik)',
  'case-law':  'Case Law (Emsal)',
  directive:   'Direktif',
};

export default function LegalReferenceBlock({
  sourceUrl, sourceTitle, sourceExcerpt, sourceAuthor, sourceDate,
  legalDocType, legalJurisdiction, legalRefNumber,
  legalPdfUrl, legalPdfTitle,
}: LegalReferenceBlockProps) {
  const docTypeLabel = legalDocType
    ? (DOC_TYPE_LABELS[legalDocType.toLowerCase()] || legalDocType)
    : null;

  return (
    <div className="border border-[#b8860b]/30 overflow-hidden mb-10 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-3 bg-[#b8860b]/10 border-b border-[#b8860b]/20">
        <Scale className="w-4 h-4 text-[#b8860b] flex-shrink-0" />
        <span className="text-sm font-bold text-[#1a2332] uppercase tracking-wider">
          Yasal Referans
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {legalJurisdiction && (
            <span className="text-xs bg-[#1a2332] text-white px-2.5 py-0.5 font-semibold">
              {legalJurisdiction}
            </span>
          )}
          {docTypeLabel && (
            <span className="text-xs bg-[#b8860b] text-white px-2.5 py-0.5 font-semibold">
              {docTypeLabel}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#fdf9f0] p-6">
        <div className="flex items-start gap-4">
          <BookOpen className="w-5 h-5 text-[#b8860b] flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            {legalRefNumber && (
              <p className="text-xs text-[#b8860b] font-mono font-bold mb-1 tracking-wider">
                Ref: {legalRefNumber}
              </p>
            )}
            {sourceTitle && (
              <h3 className="text-lg font-serif font-bold text-[#1a2332] leading-snug mb-2">
                {sourceTitle}
              </h3>
            )}
            {(sourceAuthor || sourceDate) && (
              <p className="text-sm text-zinc-500 mb-3">
                {sourceAuthor}
                {sourceAuthor && sourceDate ? ' · ' : ''}
                {sourceDate}
              </p>
            )}
            {sourceExcerpt && (
              <blockquote className="text-sm text-zinc-600 leading-relaxed border-l-2 border-[#b8860b]/50 pl-4 py-2 bg-white/70 italic">
                {sourceExcerpt}
              </blockquote>
            )}
          </div>
        </div>
        {(sourceUrl || legalPdfUrl) && (
          <div className="mt-5 pt-4 border-t border-[#b8860b]/20 flex flex-wrap items-center gap-4">
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[#b8860b] font-bold hover:text-[#9a7209] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Belgeye Git
              </a>
            )}
            {legalPdfUrl && (
              <a
                href={legalPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 bg-[#1a2332] hover:bg-[#243044] text-white text-sm font-semibold px-4 py-2 transition-colors"
              >
                <FileDown className="w-4 h-4" />
                {legalPdfTitle || sourceTitle || 'PDF İndir'}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
