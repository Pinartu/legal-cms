"use client";

import { useState } from 'react';
import { PlayCircle } from 'lucide-react';

const QUALITIES = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', '0'];

function isActualImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) return false;
  return /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i.test(url) || url.includes('img.youtube.com');
}

interface Props {
  videoId: string;
  videoUrl: string;
  alt: string;
  customImageUrl?: string | null;
}

export default function YouTubeThumb({ videoId, videoUrl, alt, customImageUrl }: Props) {
  const validCustom = isActualImageUrl(customImageUrl) ? customImageUrl : null;
  const [useCustom, setUseCustom] = useState(!!validCustom);
  const [qualityIndex, setQualityIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  const autoSrc = `https://img.youtube.com/vi/${videoId}/${QUALITIES[qualityIndex]}.jpg`;
  const src = useCustom && validCustom ? validCustom : autoSrc;

  const handleError = () => {
    if (useCustom) {
      setUseCustom(false);
      return;
    }
    if (qualityIndex < QUALITIES.length - 1) {
      setQualityIndex(q => q + 1);
    } else {
      setAllFailed(true);
    }
  };

  return (
    <div className="sm:w-52 flex-shrink-0 relative bg-zinc-100">
      {!allFailed ? (
        <img
          key={src}
          src={src}
          alt={alt}
          onError={handleError}
          className="w-full h-44 sm:h-full object-cover"
        />
      ) : (
        <div className="w-full h-44 sm:h-full flex items-center justify-center bg-[#ff0000]/10">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#ff0000]/50 fill-current">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      )}

      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition-colors"
      >
        <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
      </a>
    </div>
  );
}
