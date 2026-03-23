/**
 * ShotForge - Auth Servis Katmanı
 * 
 * Kullanıcı kimlik doğrulama ile ilgili tüm
 * API isteklerini (login, register) yönetir.
 */

import api from './api';

export const authService = {
  /**
   * Kullanıcı girişi
   * @param {string} email - Kullanıcı e-postası
   * @param {string} password - Kullanıcı şifresi
   * @returns {Promise<{token: string, user: object}>}
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response;
  },

  /**
   * Yeni kullanıcı kaydı
   * @param {string} username - Kullanıcı adı
   * @param {string} email - E-posta adresi
   * @param {string} password - Şifre
   * @returns {Promise<{token: string, user: object}>}
   */
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    return response;
  },
};
