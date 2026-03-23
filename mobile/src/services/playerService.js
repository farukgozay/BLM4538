/**
 * ShotForge - Player Servis Katmanı
 * 
 * Oyuncu verileri ile ilgili tüm API isteklerini
 * (listeleme, detay, karşılaştırma) yönetir.
 */

import api from './api';

export const playerService = {
  /**
   * Tüm oyuncuları listele
   * @returns {Promise<Array>} Oyuncu listesi
   */
  getAllPlayers: async () => {
    const response = await api.get('/players');
    return response;
  },

  /**
   * Belirli bir oyuncunun detaylarını getir
   * Şut verileri ve istatistikler dahil
   * @param {number} id - Oyuncu ID
   * @returns {Promise<object>} Oyuncu detayları
   */
  getPlayerById: async (id) => {
    const response = await api.get(`/players/${id}`);
    return response;
  },

  /**
   * İki oyuncuyu karşılaştır
   * @param {number} id1 - İlk oyuncu ID
   * @param {number} id2 - İkinci oyuncu ID
   * @returns {Promise<object>} Karşılaştırma verileri
   */
  comparePlayers: async (id1, id2) => {
    const response = await api.get(`/players/compare?id1=${id1}&id2=${id2}`);
    return response;
  },
};
