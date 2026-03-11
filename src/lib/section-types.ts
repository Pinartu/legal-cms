// Section type definitions for the Shopify-style page builder
export interface SectionField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'number' | 'color' | 'image' | 'url' | 'select' | 'array';
  placeholder?: string;
  options?: { label: string; value: string }[];
  arrayFields?: SectionField[];
}

export interface SectionTypeDefinition {
  type: string;
  label: string;
  icon: string;
  description: string;
  fields: SectionField[];
  defaultContent: Record<string, any>;
}

export const SECTION_TYPES: SectionTypeDefinition[] = [
  {
    type: 'hero',
    label: 'Hero (Giriş Alanı)',
    icon: 'Monitor',
    description: 'Tam ekran giriş bölümü — başlık, açıklama ve butonlar',
    fields: [
      { key: 'subtitle', label: 'Üst Başlık', type: 'text', placeholder: 'TICARET HUKUKU DANIŞMANLIĞI' },
      { key: 'title', label: 'Ana Başlık', type: 'textarea', placeholder: 'Ticari hayatınıza güçlü hukuki destek.' },
      { key: 'description', label: 'Açıklama', type: 'textarea', placeholder: 'Firma tanıtım metni...' },
      { key: 'buttonText', label: 'Buton 1 Metni', type: 'text', placeholder: 'Uzmanlık Alanlarımız' },
      { key: 'buttonLink', label: 'Buton 1 Linki', type: 'url', placeholder: '/category/all' },
      { key: 'button2Text', label: 'Buton 2 Metni', type: 'text', placeholder: 'İletişim' },
      { key: 'button2Link', label: 'Buton 2 Linki', type: 'url', placeholder: '/contact' },
      { key: 'backgroundImage', label: 'Arka Plan Görseli', type: 'url', placeholder: 'https://images.unsplash.com/...' },
    ],
    defaultContent: {
      subtitle: 'TİCARET HUKUKU DANIŞMANLIĞI',
      title: 'Ticari hayatınıza\ngüçlü hukuki\ndestek.',
      description: 'Türkiye\'nin önde gelen şirketlerine, finansal kurumlarına ve uluslararası yatırımcılarına ticaret hukuku alanında kapsamlı ve stratejik danışmanlık sunuyoruz.',
      buttonText: 'Uzmanlık Alanlarımız',
      buttonLink: '/category/all',
      button2Text: 'İletişim',
      button2Link: '/contact',
      backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2600&auto=format&fit=crop',
    },
  },
  {
    type: 'stats',
    label: 'İstatistikler',
    icon: 'BarChart3',
    description: 'Rakamlarla firma bilgileri çubuğu',
    fields: [
      {
        key: 'items', label: 'İstatistik Öğeleri', type: 'array',
        arrayFields: [
          { key: 'number', label: 'Rakam', type: 'text', placeholder: '25+' },
          { key: 'label', label: 'Etiket', type: 'text', placeholder: 'Yıllık Deneyim' },
        ]
      },
    ],
    defaultContent: {
      items: [
        { number: '25+', label: 'Yıllık Deneyim' },
        { number: '500+', label: 'Başarılı Dava' },
        { number: '120+', label: 'Kurumsal Müvekkil' },
        { number: '15+', label: 'Uzmanlık Alanı' },
      ],
    },
  },
  {
    type: 'practice_areas',
    label: 'Uzmanlık Alanları',
    icon: 'Briefcase',
    description: 'Hizmet alanları grid bölümü',
    fields: [
      { key: 'title', label: 'Bölüm Başlığı', type: 'text', placeholder: 'Uzmanlık Alanlarımız' },
      {
        key: 'areas', label: 'Alanlar', type: 'array',
        arrayFields: [
          { key: 'icon', label: 'İkon', type: 'select', options: [
            { label: 'Çanta', value: 'Briefcase' },
            { label: 'Bina', value: 'Building2' },
            { label: 'Banka', value: 'Landmark' },
            { label: 'Dünya', value: 'Globe' },
            { label: 'Terazi', value: 'Scale' },
            { label: 'Kalkan', value: 'Shield' },
            { label: 'Dosya', value: 'FileText' },
            { label: 'Kullanıcılar', value: 'Users' },
          ]},
          { key: 'title', label: 'Başlık', type: 'text', placeholder: 'Ticaret Hukuku' },
          { key: 'description', label: 'Açıklama', type: 'text', placeholder: 'Kısa açıklama...' },
        ]
      },
    ],
    defaultContent: {
      title: 'Uzmanlık Alanlarımız',
      areas: [
        { icon: 'Briefcase', title: 'Ticaret Hukuku', description: 'Şirketler hukuku, sözleşmeler ve ticari uyuşmazlıklar' },
        { icon: 'Building2', title: 'Birleşme & Devralmalar', description: 'Şirket birleşmeleri, bölünmeleri ve devralma süreçleri' },
        { icon: 'Landmark', title: 'Bankacılık & Finans', description: 'Bankacılık düzenlemeleri ve finansal işlem danışmanlığı' },
        { icon: 'Globe', title: 'Uluslararası Tahkim', description: 'Uluslararası ticari uyuşmazlık çözüm mekanizmaları' },
        { icon: 'Scale', title: 'Rekabet Hukuku', description: 'Rekabet mevzuatı uyumu ve soruşturma süreçleri' },
        { icon: 'Shield', title: 'Fikri Mülkiyet', description: 'Marka, patent ve telif hakları koruması' },
      ],
    },
  },
  {
    type: 'about_text',
    label: 'Tanıtım Bölümü',
    icon: 'FileText',
    description: 'Firma tanıtım metni ve alt hizmet kartları',
    fields: [
      { key: 'title', label: 'Başlık', type: 'textarea', placeholder: 'Ticaret hukuku alanında güvenilir danışmanlık' },
      { key: 'content', label: 'İçerik', type: 'textarea', placeholder: 'Firma açıklaması...' },
      { key: 'buttonText', label: 'Buton Metni', type: 'text', placeholder: 'Bizi Tanıyın' },
      { key: 'buttonLink', label: 'Buton Linki', type: 'url', placeholder: '/about' },
      {
        key: 'subItems', label: 'Alt Kartlar', type: 'array',
        arrayFields: [
          { key: 'title', label: 'Başlık', type: 'text', placeholder: 'Şirketler Hukuku' },
          { key: 'description', label: 'Açıklama', type: 'text', placeholder: 'Kısa açıklama...' },
        ]
      },
    ],
    defaultContent: {
      title: 'Ticaret hukuku alanında güvenilir danışmanlık',
      content: 'Ticaret hukuku alanında uzmanlaşmış ekibimiz, yurt içi ve yurt dışı ticari işlemlerinizde, sözleşme müzakerelerinizde ve uyuşmazlık çözüm süreçlerinizde yanınızda olmaya devam etmektedir.',
      buttonText: 'Bizi Tanıyın',
      buttonLink: '/about',
      subItems: [
        { title: 'Şirketler Hukuku', description: 'Kuruluş, tescil ve yönetim kurulu danışmanlığı' },
        { title: 'Sözleşme Hukuku', description: 'Ticari sözleşmelerin hazırlanması ve müzakeresi' },
        { title: 'İcra & İflas', description: 'Alacak takibi ve iflas süreç yönetimi' },
        { title: 'Dış Ticaret', description: 'Uluslararası ticaret ve gümrük mevzuatı' },
      ],
    },
  },
  {
    type: 'featured_posts',
    label: 'Güncel Yayınlar',
    icon: 'Newspaper',
    description: 'Veritabanından son yayınları otomatik çeker',
    fields: [
      { key: 'title', label: 'Bölüm Başlığı', type: 'text', placeholder: 'Güncel Yayınlar' },
      { key: 'subtitle', label: 'Alt Başlık', type: 'text', placeholder: 'Son hukuki analiz ve değerlendirmelerimiz' },
      { key: 'count', label: 'Gösterilecek Makale Sayısı', type: 'number', placeholder: '6' },
    ],
    defaultContent: {
      title: 'Güncel Yayınlar',
      subtitle: 'Son hukuki analiz ve değerlendirmelerimiz',
      count: 6,
    },
  },
  {
    type: 'newsletter',
    label: 'Bülten Kayıt',
    icon: 'Mail',
    description: 'E-posta bülteni kayıt bölümü',
    fields: [
      { key: 'title', label: 'Başlık', type: 'text', placeholder: 'Bültenimize Kayıt Olun' },
      { key: 'description', label: 'Açıklama', type: 'text', placeholder: 'Güncel hukuki gelişmeler...' },
    ],
    defaultContent: {
      title: 'Bültenimize Kayıt Olun',
      description: 'Güncel hukuki gelişmeler ve yayınlarımızdan haberdar olun.',
    },
  },
  {
    type: 'contact_info',
    label: 'İletişim Bilgileri',
    icon: 'MapPin',
    description: 'Adres, telefon, e-posta ve çalışma saatleri',
    fields: [
      { key: 'address', label: 'Adres', type: 'textarea', placeholder: 'Levent Mah. Büyükdere Cad...' },
      { key: 'phone', label: 'Telefon', type: 'text', placeholder: '+90 (212) 555 00 00' },
      { key: 'email', label: 'E-posta', type: 'text', placeholder: 'info@legalinsights.com' },
      { key: 'hours', label: 'Çalışma Saatleri', type: 'text', placeholder: 'Pazartesi - Cuma: 09:00 - 18:00' },
    ],
    defaultContent: {
      address: 'Levent Mah. Büyükdere Cad.\nNo: 100, Kat: 12\n34394 Beşiktaş / İstanbul',
      phone: '+90 (212) 555 00 00',
      email: 'info@legalinsights.com',
      hours: 'Pazartesi - Cuma: 09:00 - 18:00',
    },
  },
  {
    type: 'contact_form',
    label: 'İletişim Formu',
    icon: 'Send',
    description: 'Mesaj gönderme formu',
    fields: [
      { key: 'title', label: 'Başlık', type: 'text', placeholder: 'Mesaj Gönderin' },
      { key: 'description', label: 'Açıklama', type: 'text', placeholder: 'Formu doldurarak bize ulaşabilirsiniz.' },
    ],
    defaultContent: {
      title: 'Mesaj Gönderin',
      description: 'Formu doldurarak bize ulaşabilirsiniz.',
    },
  },
  {
    type: 'custom_html',
    label: 'Özel İçerik',
    icon: 'Code',
    description: 'Serbest metin veya HTML içerik bloğu',
    fields: [
      { key: 'title', label: 'Başlık (Opsiyonel)', type: 'text', placeholder: '' },
      { key: 'content', label: 'İçerik', type: 'richtext', placeholder: 'İçeriğinizi buraya yazın...' },
      { key: 'bgColor', label: 'Arka Plan Rengi', type: 'select', options: [
        { label: 'Beyaz', value: 'white' },
        { label: 'Krem', value: 'cream' },
        { label: 'Lacivert', value: 'navy' },
      ]},
    ],
    defaultContent: {
      title: '',
      content: '<p>İçeriğinizi buraya ekleyin.</p>',
      bgColor: 'white',
    },
  },
  {
    type: 'cta_banner',
    label: 'Eylem Çağrısı (CTA)',
    icon: 'Megaphone',
    description: 'Dikkat çekici eylem çağrısı banner',
    fields: [
      { key: 'title', label: 'Başlık', type: 'text', placeholder: 'Hukuki danışmanlık için bize ulaşın' },
      { key: 'description', label: 'Açıklama', type: 'textarea', placeholder: 'Açıklama metni...' },
      { key: 'buttonText', label: 'Buton Metni', type: 'text', placeholder: 'İletişime Geçin' },
      { key: 'buttonLink', label: 'Buton Linki', type: 'url', placeholder: '/contact' },
      { key: 'bgColor', label: 'Arka Plan', type: 'select', options: [
        { label: 'Lacivert', value: 'navy' },
        { label: 'Altın', value: 'gold' },
      ]},
    ],
    defaultContent: {
      title: 'Hukuki danışmanlık için bize ulaşın',
      description: 'Ticaret hukuku alanında uzman ekibimiz ile iletişime geçin.',
      buttonText: 'İletişime Geçin',
      buttonLink: '/contact',
      bgColor: 'navy',
    },
  },
  {
    type: 'spacer',
    label: 'Boşluk',
    icon: 'Minus',
    description: 'Bölümler arasına boşluk ekler',
    fields: [
      { key: 'height', label: 'Yükseklik (px)', type: 'number', placeholder: '60' },
    ],
    defaultContent: {
      height: 60,
    },
  },
];

export const MANAGED_PAGES = [
  { id: 'home', label: 'Ana Sayfa', icon: 'Home' },
  { id: 'about', label: 'Hakkımızda', icon: 'Info' },
  { id: 'contact', label: 'İletişim', icon: 'Phone' },
];
