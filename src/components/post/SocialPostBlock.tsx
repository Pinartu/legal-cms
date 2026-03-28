import { ExternalLink, Share2 } from 'lucide-react';
import YouTubeThumb from '@/components/post/YouTubeThumb';

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

interface SocialPostBlockProps {
  sourceUrl?: string | null;
  sourcePlatform?: string | null;
  embedCode?: string | null;
  sourceTitle?: string | null;
  sourceExcerpt?: string | null;
  sourceAuthor?: string | null;
  sourceImageUrl?: string | null;
  sourceDate?: string | null;
}

const PLATFORM_CONFIG: Record<string, { label: string; textColor: string; bgColor: string; borderColor: string }> = {
  twitter:   { label: 'X / Twitter',  textColor: 'text-white',    bgColor: 'bg-black',           borderColor: 'border-black' },
  instagram: { label: 'Instagram',    textColor: 'text-white',    bgColor: 'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400', borderColor: 'border-pink-500' },
  linkedin:  { label: 'LinkedIn',     textColor: 'text-white',    bgColor: 'bg-[#0077b5]',        borderColor: 'border-[#0077b5]' },
  facebook:  { label: 'Facebook',     textColor: 'text-white',    bgColor: 'bg-[#1877f2]',        borderColor: 'border-[#1877f2]' },
  tiktok:    { label: 'TikTok',       textColor: 'text-white',    bgColor: 'bg-black',            borderColor: 'border-black' },
  youtube:   { label: 'YouTube',      textColor: 'text-white',    bgColor: 'bg-[#ff0000]',        borderColor: 'border-[#ff0000]' },
};

function PlatformSvgIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'twitter':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.629L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return <Share2 className="w-4 h-4" />;
  }
}

export default function SocialPostBlock({
  sourceUrl, sourcePlatform, embedCode, sourceTitle,
  sourceExcerpt, sourceAuthor, sourceImageUrl, sourceDate,
}: SocialPostBlockProps) {
  const platform = (sourcePlatform || 'other').toLowerCase();
  const config = PLATFORM_CONFIG[platform] || {
    label: sourcePlatform || 'Sosyal Medya',
    textColor: 'text-white',
    bgColor: 'bg-slate-700',
    borderColor: 'border-slate-700',
  };

  // YouTube için video ID çıkarımı
  const youtubeId = platform === 'youtube' && sourceUrl ? extractYouTubeId(sourceUrl) : null;

  return (
    <div className="border border-zinc-200 overflow-hidden mb-10 shadow-sm">
      {/* Platform header bar */}
      <div className={`flex items-center gap-2.5 px-4 py-3 ${config.bgColor} ${config.textColor}`}>
        <PlatformSvgIcon platform={platform} />
        <span className="text-sm font-bold tracking-wide">{config.label}</span>
        {sourceDate && (
          <span className="ml-auto text-xs opacity-70">{sourceDate}</span>
        )}
      </div>

      {/* Content: embed code takes priority, then preview card */}
      {embedCode ? (
        <div
          className="p-4 bg-[#fafafa] overflow-x-auto [&_iframe]:max-w-full"
          dangerouslySetInnerHTML={{ __html: embedCode }}
        />
      ) : (
        <div className="flex flex-col sm:flex-row bg-white">
          {/* YouTube: özel thumbnail bileşeni (fallback destekli) */}
          {youtubeId && sourceUrl ? (
            <YouTubeThumb
              videoId={youtubeId}
              videoUrl={sourceUrl}
              alt={sourceTitle || 'YouTube Video'}
              customImageUrl={sourceImageUrl}
            />
          ) : sourceImageUrl ? (
            <div className="sm:w-52 flex-shrink-0">
              <img
                src={sourceImageUrl}
                alt={sourceTitle || 'Sosyal Medya Görseli'}
                className="w-full h-44 sm:h-full object-cover"
              />
            </div>
          ) : null}
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              {sourceAuthor && (
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  {sourceAuthor}
                </p>
              )}
              {sourceTitle && (
                <p className="text-base font-semibold text-[#1a2332] leading-snug mb-2">
                  {sourceTitle}
                </p>
              )}
              {sourceExcerpt && (
                <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed">
                  {sourceExcerpt}
                </p>
              )}
            </div>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#b8860b] mt-4 hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Kaynağa Git
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
