# 🏀 ShotForge

**Basketbol Oyuncu Analiz Mobil Uygulaması**

ShotForge, basketbol oyuncularının şut verilerini takip eden, performans istatistiklerini görselleştiren ve oyuncuları karşılaştırmaya olanak tanıyan bir mobil uygulamadır.

> **BLM4538 — iOS ile Mobil Uygulama Geliştirme II**  
> Ankara Üniversitesi

---

## 📋 Özellikler

- 🔐 Kullanıcı girişi ve kayıt sistemi (JWT Authentication)
- 📊 Oyuncu listesi ve detaylı istatistikler
- 🗺️ İnteraktif Shot Map (şut koordinatları üzerinde görselleştirme)
- ⚖️ İki oyuncu karşılaştırma ekranı
- 📱 Modern, koyu temalı ve profesyonel arayüz

---

## 🛠️ Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | React Native (Expo) — JavaScript |
| **Backend** | ASP.NET Core Web API (.NET 8) |
| **Veritabanı** | SQLite (Entity Framework Core) |
| **State Management** | React Context API |
| **HTTP Client** | Axios |
| **Navigasyon** | React Navigation |

---

## 📁 Klasör Yapısı

```
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
```

---

## 🔌 API Endpoint'leri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `POST` | `/api/auth/register` | Yeni kullanıcı kaydı |
| `POST` | `/api/auth/login` | Kullanıcı girişi |
| `GET` | `/api/players` | Tüm oyuncuları listele |
| `GET` | `/api/players/{id}` | Oyuncu detayları (istatistik + şutlar) |
| `GET` | `/api/players/compare?id1={}&id2={}` | İki oyuncuyu karşılaştır |

---

## 🚀 Kurulum

### Mobile (React Native)

```bash
cd mobile
npm install
npx expo start
```

### Backend (ASP.NET Core)

```bash
cd backend/ShotForgeAPI
dotnet restore
dotnet run
```

---

## 📸 Veritabanı Şeması

| Tablo | Alanlar |
|-------|---------|
| **Users** | Id, Username, Email, PasswordHash, CreatedAt |
| **Players** | Id, Name, Team, Position, JerseyNumber, ImageUrl |
| **Shots** | Id, PlayerId, X, Y, Made, ShotType, CreatedAt |
| **Stats** | Id, PlayerId, GamesPlayed, PointsPerGame, AssistsPerGame, ReboundsPerGame, FieldGoalPercentage |

---

## 👤 Geliştirici

**BLM4538 Öğrencisi** — Ankara Üniversitesi

---

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
