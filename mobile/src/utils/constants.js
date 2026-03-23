/**
 * ShotForge - Sabitler ve Yapılandırma
 * 
 * API URL, renk paleti ve uygulama genelinde
 * kullanılan sabit değerler burada tanımlanır.
 */

// API temel URL'si - backend sunucu adresi
export const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android emülatör için
// export const API_BASE_URL = 'http://localhost:5000/api'; // iOS simülatör için

// ShotForge Renk Paleti - Koyu tema, neon yeşil aksanlar
export const COLORS = {
  primary: '#00E676',        // Neon Yeşil (ana aksan rengi)
  primaryDark: '#00C853',    // Koyu yeşil
  primaryLight: '#69F0AE',   // Açık yeşil
  background: '#0D0D0D',    // Ana arka plan (siyah)
  surface: '#1A1A2E',       // Kart/yüzey arka planı
  surfaceLight: '#16213E',  // Daha açık yüzey
  text: '#FFFFFF',          // Ana metin rengi
  textSecondary: '#B0B0B0', // İkincil metin rengi
  textMuted: '#666666',     // Soluk metin
  error: '#FF5252',         // Hata rengi
  warning: '#FFD740',       // Uyarı rengi
  success: '#00E676',       // Başarı rengi
  border: '#2A2A3E',        // Kenarlık rengi
  overlay: 'rgba(0,0,0,0.7)', // Yarı saydam katman
};

// Yazı tipi boyutları
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  title: 40,
};

// Boşluk değerleri
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Basketbol pozisyonları
export const POSITIONS = {
  PG: 'Point Guard',
  SG: 'Shooting Guard',
  SF: 'Small Forward',
  PF: 'Power Forward',
  C: 'Center',
};

// Şut tipleri
export const SHOT_TYPES = {
  TWO_POINT: '2 Sayı',
  THREE_POINT: '3 Sayı',
  FREE_THROW: 'Serbest Atış',
};

// AsyncStorage anahtarları
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@shotforge_auth_token',
  USER_DATA: '@shotforge_user_data',
};
