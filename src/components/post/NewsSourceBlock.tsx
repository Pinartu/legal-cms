import { ExternalLink, Newspaper, Calendar } from 'lucide-react';

interface NewsSourceBlockProps {
  sourceUrl?: string | null;
  sourceTitle?: string | null;
  sourceExcerpt?: string | null;
  sourceAuthor?: string | null;
  sourceImageUrl?: string | null;
  sourceDate?: string | null;
}

export default function NewsSourceBlock({
  sourceUrl, sourceTitle, sourceExcerpt, sourceAuthor, sourceImageUrl, sourceDate,
}: NewsSourceBlockProps) {
  return (
    <div className="border border-zinc-200 overflow-hidden mb-10 shadow-sm">
      {/* Header bar */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[#1a2332]">
        <Newspaper className="w-4 h-4 text-[#b8860b]" />
        <span className="text-sm font-bold text-white tracking-wide">Haber Kaynağı</span>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row bg-white">
        {sourceImageUrl && (
          <div className="md:w-72 flex-shrink-0">
            <img
              src={sourceImageUrl}
              alt={sourceTitle || 'Haber Görseli'}
              className="w-full h-52 md:h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {sourceAuthor && (
                <span className="text-xs font-bold uppercase tracking-widest text-[#b8860b]">
                  {sourceAuthor}
                </span>
              )}
              {sourceDate && (
                <span className="flex items-center gap-1 text-xs text-zinc-400">
                  <Calendar className="w-3 h-3" />
                  {sourceDate}
                </span>
              )}
            </div>
            {sourceTitle && (
              <h3 className="text-xl font-serif font-bold text-[#1a2332] leading-snug mb-3">
                {sourceTitle}
              </h3>
            )}
            {sourceExcerpt && (
              <p className="text-sm text-zinc-500 leading-relaxed line-clamp-4">
                {sourceExcerpt}
              </p>
            )}
          </div>
          {sourceUrl && (
            <div className="mt-5 pt-4 border-t border-zinc-100">
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white bg-[#b8860b] px-5 py-2.5 font-semibold hover:bg-[#9a7209] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Haberi Oku
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
