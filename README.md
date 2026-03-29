#  ShotForge

HAFTA 1 VİDEO LİNKİ: https://www.youtube.com/watch?v=t55gxae5N-c
HAFTA 2 VİDEO LİNKİ: https://www.youtube.com/watch?v=li7oqD1jaRk

**Basketbol Oyuncu Analiz Mobil Uygulaması**

ShotForge, basketbol oyuncularının şut verilerini takip eden, performans istatistiklerini görselleştiren ve oyuncuları karşılaştırmaya olanak tanıyan bir mobil uygulamadır.

> **BLM4538 — iOS ile Mobil Uygulama Geliştirme II**  




##  Özellikler

-  Kullanıcı girişi ve kayıt sistemi (JWT Authentication)
-  Oyuncu listesi ve detaylı istatistikler
-  İnteraktif Shot Map (şut koordinatları üzerinde görselleştirme)
-  İki oyuncu karşılaştırma ekranı
-  Modern, koyu temalı ve profesyonel arayüz



##  Klasör Yapısı


BLM4538/
├── mobile/                    # React Native (Expo) Mobil Uygulama
│   ├── App.js                 # Ana giriş noktası
│   ├── src/
│   │   ├── components/        # Yeniden kullanılabilir UI bileşenleri
│   │   ├── screens/           # Uygulama ekranları
│   │   ├── navigation/        # Stack Navigator yapılandırması
│   │   ├── services/          # API servis katmanı
│   │   ├── context/           # AuthContext (state management)
│   │   └── utils/             # Sabitler ve yardımcı fonksiyonlar
│   └── package.json
│
├── backend/
│   └── ShotForgeAPI/          # ASP.NET Core Web API
│       ├── Controllers/       # API Controller'ları
│       ├── Models/            # Veri modelleri
│       ├── Data/              # DbContext ve veritabanı yapılandırması
│       ├── Services/          # İş mantığı servisleri
│       └── Program.cs         # Uygulama giriş noktası
│
├── .gitignore
└── README.md







Kurulum

Mobile (React Native)

bash
cd mobile
npm install
npx expo start


 Backend (ASP.NET Core)

bash
cd backend/ShotForgeAPI
dotnet restore
dotnet run






