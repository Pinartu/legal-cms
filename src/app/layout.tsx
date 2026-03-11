import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: {
    default: "LegalInsights — Ticaret Hukuku Danışmanlığı",
    template: "%s | LegalInsights",
  },
  description: "Ticaret hukuku alanında kapsamlı ve stratejik hukuki danışmanlık. Şirketler hukuku, birleşme & devralmalar, bankacılık, rekabet hukuku uzmanları.",
  metadataBase: new URL("https://legalinsights.example.com"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: "en_US",
    siteName: "LegalInsights",
    title: "LegalInsights — Ticaret Hukuku Danışmanlığı",
    description: "Ticaret hukuku alanında kapsamlı ve stratejik hukuki danışmanlık.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LegalInsights — Ticaret Hukuku Danışmanlığı",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LegalInsights — Ticaret Hukuku Danışmanlığı",
    description: "Ticaret hukuku alanında kapsamlı ve stratejik hukuki danışmanlık.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Organization JSON-LD (structured data)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "LegalInsights",
    "description": "Ticaret hukuku alanında uzmanlaşmış, stratejik hukuki danışmanlık sunan bağımsız bir hukuk platformu.",
    "url": "https://legalinsights.example.com",
    "logo": "https://legalinsights.example.com/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Levent Mah. Büyükdere Cad. No: 100, Kat: 12",
      "addressLocality": "Beşiktaş",
      "addressRegion": "İstanbul",
      "postalCode": "34394",
      "addressCountry": "TR"
    },
    "telephone": "+90 (212) 555 00 00",
    "email": "info@legalinsights.com",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "areaServed": "TR",
    "priceRange": "$$$$",
    "sameAs": [] // Will be populated from settings
  };

  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "LegalInsights",
            "url": "https://legalinsights.example.com",
            "inLanguage": ["tr-TR", "en-US"],
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://legalinsights.example.com/tr/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          }) }}
        />
      </head>
      <body className="font-sans bg-[#fbfbfb] text-[#334155] antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
