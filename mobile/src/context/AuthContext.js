/**
 * ShotForge - AuthContext (Kimlik Doğrulama Bağlamı)
 * 
 * Kullanıcı oturum durumunu tüm uygulama genelinde
 * yönetmek için Context API kullanılır.
 * Login, register ve logout işlemlerini barındırır.
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';
import { STORAGE_KEYS } from '../utils/constants';

// Context oluştur
const AuthContext = createContext(null);

/**
 * AuthProvider - Uygulama genelinde auth state sağlayıcı
 * App.js içinde kullanılarak tüm alt bileşenlere
 * auth bilgisini sağlar.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Uygulama başladığında kayıtlı oturumu kontrol et
  useEffect(() => {
    loadStoredAuth();
  }, []);

  /**
   * AsyncStorage'dan kayıtlı token ve kullanıcı bilgisini yükle
   */
  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Auth yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Kullanıcı girişi yap
   * @param {string} email - Kullanıcı e-postası
   * @param {string} password - Kullanıcı şifresi
   */
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token: authToken, user: userData } = response;

      // State güncelle
      setToken(authToken);
      setUser(userData);

      // AsyncStorage'a kaydet
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Giriş başarısız.',
      };
    }
  };

  /**
   * Yeni kullanıcı kaydı oluştur
   * @param {string} username - Kullanıcı adı
   * @param {string} email - E-posta adresi
   * @param {string} password - Şifre
   */
  const register = async (username, email, password) => {
    try {
      const response = await authService.register(username, email, password);
      const { token: authToken, user: userData } = response;

      setToken(authToken);
      setUser(userData);

      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Kayıt başarısız.',
      };
    }
  };

  /**
   * Oturumu kapat ve tüm auth verilerini temizle
   */
  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  // Context değerlerini alt bileşenlere sun
  const contextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook - Auth bilgilerine kolay erişim sağlar
 * Herhangi bir bileşende kullanılabilir:
 * const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.');
  }
  return context;
};

export default AuthContext;
