import { prisma } from '@/lib/prisma';
import Image from 'next/image';

export const metadata = { title: 'About - LegalInsights' };

export default async function AboutPage() {
  const aboutSetting = await prisma.siteContent.findUnique({
    where: { key: 'about_page' }
  });

  const content = aboutSetting?.value || "Welcome to LegalInsights. We are dedicated to providing clear, concise, and highly analytical perspectives on contemporary case law and legal statutes. Our goal is to serve as a reliable knowledge-sharing hub for legal professionals, students, and informed citizens.";

  // For the professional bio image, we can just use a placeholder or pull from settings if we implemented a specific key for it.
  // Using a stylized minimalist text layout.
  
  return (
    <div className="bg-[#fbfbfb] min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">Professional Bio</h1>
          <div className="w-24 h-1 bg-slate-900 mx-auto rounded-full opacity-20"></div>
        </header>

        <div className="bg-white p-8 md:p-12 shadow-sm rounded-lg border border-slate-100">
           <div className="prose prose-lg prose-slate max-w-none font-sans leading-relaxed text-slate-700 whitespace-pre-wrap">
              {content}
           </div>
        </div>
      </div>
    </div>
  );
}
