# 💼 GelirGider - Finansal Takip Uygulaması

Modern, kullanıcı dostu gelir-gider takip uygulaması. Çoklu para birimi desteği, otomatik kur çevirimi ve düzenli ödeme yönetimi.

![GelirGider Screenshot](https://via.placeholder.com/800x400?text=GelirGider+App)

## ✨ Özellikler

- 📊 **Dashboard** - Anlık gelir/gider özeti ve grafikler
- 💰 **Çoklu Para Birimi** - TRY, USD, EUR, GBP desteği
- 🔄 **Otomatik Kur Çevirimi** - Anlık TRY karşılığı hesaplama
- 📅 **Düzenli Ödemeler** - Aylık tekrarlayan işlemler
- 📈 **Raporlar** - Yıllık özet ve kar marjı analizi
- 📱 **Responsive** - Mobil ve desktop uyumlu
- 🔐 **Güvenli** - Supabase Auth ile kullanıcı yönetimi

## 🚀 Hızlı Başlangıç

### 1. Vercel'e Deploy (Tek Tık)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/gelir-gider-app)

### 2. Manuel Kurulum

```bash
# Repoyu klonla
git clone https://github.com/YOUR_USERNAME/gelir-gider-app.git
cd gelir-gider-app

# Bağımlılıkları yükle
npm install

# Environment variables
cp .env.example .env.local
# .env.local dosyasını düzenle

# Development server
npm run dev
```

## 🔧 Ortam Değişkenleri

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🗄️ Supabase Kurulumu

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. SQL Editor'e gidin
4. `supabase/migration.sql` dosyasının içeriğini yapıştırın ve çalıştırın
5. Project Settings > API'den URL ve anon key'i alın
6. `.env.local` dosyasına ekleyin

## 📁 Proje Yapısı

```
gelir-gider-app/
├── app/
│   ├── globals.css      # Global stiller
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Ana sayfa
├── components/
│   ├── ui/              # UI bileşenleri
│   │   ├── modal.tsx
│   │   ├── badges.tsx
│   │   └── stat-card.tsx
│   ├── dashboard.tsx
│   ├── transaction-form.tsx
│   ├── transaction-item.tsx
│   ├── transactions-page.tsx
│   ├── recurring-page.tsx
│   ├── reports-page.tsx
│   ├── settings-page.tsx
│   ├── sidebar.tsx
│   └── mobile-nav.tsx
├── lib/
│   ├── store.ts         # Zustand state management
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Utility fonksiyonlar
├── types/
│   └── index.ts         # TypeScript tipleri
├── supabase/
│   └── migration.sql    # Veritabanı şeması
└── public/
    └── ...
```

## 🛠️ Teknolojiler

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State**: Zustand + Persist
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📱 Ekran Görüntüleri

### Dashboard
- Özet kartları (Gelir, Gider, Net Kar, Bekleyen)
- Yıllık grafik
- Son işlemler listesi

### İşlemler
- Filtreleme (Tümü, Gelirler, Giderler)
- Arama
- Ekleme/Düzenleme/Silme

### Düzenli Ödemeler
- Aktif/Pasif toggle
- Otomatik aylık oluşturma

### Raporlar
- Yıllık özet tablosu
- Kar marjı analizi

## 🔒 Güvenlik

- Row Level Security (RLS) ile veri izolasyonu
- Her kullanıcı sadece kendi verilerini görür
- Supabase Auth ile güvenli kimlik doğrulama

## 📝 Lisans

MIT License

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

Made with ❤️ using Next.js and Supabase
