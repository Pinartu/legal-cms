import { prisma } from '@/lib/prisma';

export default async function Footer() {
  const footerSetting = await prisma.siteContent.findUnique({
    where: { key: 'footer_text' }
  });

  const copyright = footerSetting?.value || `© ${new Date().getFullYear()} LegalInsights. All rights reserved.`;

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-white block mb-4">
              Legal<span className="text-slate-400 font-light">Insights</span>
            </span>
            <p className="text-slate-400 max-w-xs leading-relaxed">
              A comprehensive platform for legal knowledge, case law analysis, and professional insights.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-xs">Resources</h4>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white transition-colors">Case Law Articles</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">Professional Bio</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Information</a></li>
              <li><a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-xs">Legal Disclaimer</h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              The information provided on this site does not, and is not intended to, constitute legal advice. All information, content, and materials available on this site are for general informational purposes only.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
