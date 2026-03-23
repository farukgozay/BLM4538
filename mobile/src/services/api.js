/**
 * ShotForge - API İstemci Yapılandırması
 * 
 * Axios instance oluşturarak tüm API isteklerinde
 * ortak ayarları (base URL, headers, interceptors)
 * merkezi bir noktadan yönetir.
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 saniye zaman aşımı
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * İstek Interceptor - Her istekte token'ı header'a ekle
 * Kullanıcı giriş yaptıysa Authorization header otomatik eklenir.
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token okuma hatası:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Yanıt Interceptor - Hata durumlarını merkezi olarak yakala
 * 401 (Yetkisiz) hatalarında otomatik logout yapılabilir.
 */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuş
      console.warn('Oturum süresi dolmuş, yeniden giriş yapın.');
    }
    return Promise.reject(error);
  }
);

export default api;
