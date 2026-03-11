"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Scale, Briefcase, Globe, Building2, Shield, Landmark } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2600&auto=format&fit=crop" 
          alt="Profesyonel Hukuk Bürosu" 
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332]/95 via-[#1a2332]/70 to-[#1a2332]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-32 pt-40">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-block w-16 h-[2px] bg-[#b8860b] mb-6"></span>
              <p className="text-[#b8860b] text-sm font-semibold tracking-[0.3em] uppercase">
                Ticaret Hukuku Danışmanlığı
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-8"
            >
              Ticari hayatınıza
              <br />
              <span className="text-[#b8860b] italic font-light">güçlü hukuki</span>
              <br />
              destek.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-white/70 font-light max-w-xl leading-relaxed mb-10"
            >
              Türkiye'nin önde gelen şirketlerine, finansal kurumlarına ve uluslararası yatırımcılarına ticaret hukuku alanında kapsamlı ve stratejik danışmanlık sunuyoruz.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/category/all"
                className="group inline-flex items-center gap-2 bg-[#b8860b] text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:bg-[#d4a843] transition-all"
              >
                Uzmanlık Alanlarımız
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase hover:border-white hover:bg-white/10 transition-all"
              >
                İletişim
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="bg-[#1a2332]/80 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {[
                { number: "25+", label: "Yıllık Deneyim" },
                { number: "500+", label: "Başarılı Dava" },
                { number: "120+", label: "Kurumsal Müvekkil" },
                { number: "15+", label: "Uzmanlık Alanı" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + i * 0.1 }}
                  className="py-6 md:py-8 text-center"
                >
                  <p className="text-2xl md:text-3xl font-serif font-bold text-[#b8860b]">{stat.number}</p>
                  <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PracticeAreasSection() {
  const areas = [
    { title: "Ticaret Hukuku", description: "Şirketler hukuku, sözleşmeler ve ticari uyuşmazlıklar", icon: <Briefcase className="w-7 h-7" /> },
    { title: "Birleşme & Devralmalar", description: "Şirket birleşmeleri, bölünmeleri ve devralma süreçleri", icon: <Building2 className="w-7 h-7" /> },
    { title: "Bankacılık & Finans", description: "Bankacılık düzenlemeleri ve finansal işlem danışmanlığı", icon: <Landmark className="w-7 h-7" /> },
    { title: "Uluslararası Tahkim", description: "Uluslararası ticari uyuşmazlık çözüm mekanizmaları", icon: <Globe className="w-7 h-7" /> },
    { title: "Rekabet Hukuku", description: "Rekabet mevzuatı uyumu ve soruşturma süreçleri", icon: <Scale className="w-7 h-7" /> },
    { title: "Fikri Mülkiyet", description: "Marka, patent ve telif hakları koruması", icon: <Shield className="w-7 h-7" /> },
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="inline-block w-12 h-[2px] bg-[#b8860b] mb-4"></span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a2332] tracking-tight">
              Uzmanlık Alanlarımız
            </h2>
          </div>
          <Link href="/category/all" className="group flex items-center gap-2 text-[#b8860b] font-medium text-sm uppercase tracking-wider hover:text-[#1a2332] transition-colors">
            Tümünü Gör <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-zinc-200">
          {areas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group cursor-pointer border-b border-r border-zinc-200 p-8 lg:p-10 hover:bg-[#1a2332] transition-all duration-500"
            >
              <div className="text-[#b8860b] mb-6 group-hover:text-[#d4a843] transition-colors">
                {area.icon}
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#1a2332] group-hover:text-white transition-colors mb-3">
                {area.title}
              </h3>
              <p className="text-sm text-zinc-500 group-hover:text-white/60 transition-colors leading-relaxed mb-6">
                {area.description}
              </p>
              <div className="flex items-center gap-2 text-[#b8860b] text-xs font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                Detaylar <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
