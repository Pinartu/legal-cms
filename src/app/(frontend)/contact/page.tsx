import { prisma } from '@/lib/prisma';
import { Mail, Phone } from 'lucide-react';

export const metadata = { title: 'Contact - LegalInsights' };

export default async function ContactPage() {
  const emailSetting = await prisma.siteContent.findUnique({ where: { key: 'contact_email' }});
  const phoneSetting = await prisma.siteContent.findUnique({ where: { key: 'contact_phone' }});

  const email = emailSetting?.value || "contact@legalinsights.example.com";
  const phone = phoneSetting?.value || "+1 (555) 123-4567";

  return (
    <div className="bg-[#fbfbfb] min-h-screen py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">Get in Touch</h1>
          <p className="text-lg text-slate-600 font-light leading-relaxed">
            For professional inquiries, speaking engagements, or legal research collaboration, please reach out via the channels below.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 shadow-sm rounded-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
             <div className="h-14 w-14 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mb-6">
               <Mail className="h-6 w-6" />
             </div>
             <h3 className="text-xl font-serif font-semibold text-slate-900 mb-2">Email</h3>
             <p className="text-slate-600 mb-6 text-sm">Our primary method of communication.</p>
             <a href={`mailto:${email}`} className="text-slate-900 font-medium border-b border-slate-900 hover:text-slate-600 hover:border-slate-600 transition-colors pb-1">
               {email}
             </a>
          </div>

          <div className="bg-white p-8 shadow-sm rounded-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
             <div className="h-14 w-14 bg-slate-50 text-slate-900 rounded-full flex items-center justify-center mb-6">
               <Phone className="h-6 w-6" />
             </div>
             <h3 className="text-xl font-serif font-semibold text-slate-900 mb-2">Phone</h3>
             <p className="text-slate-600 mb-6 text-sm">For urgent inquiries during business hours.</p>
             <a href={`tel:${phone}`} className="text-slate-900 font-medium border-b border-slate-900 hover:text-slate-600 hover:border-slate-600 transition-colors pb-1">
               {phone}
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
