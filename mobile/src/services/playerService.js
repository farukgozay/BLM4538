/**
 * ShotForge - Player Servis Katmanı
 * 
 * Oyuncu verileri ile ilgili tüm API isteklerini
 * (listeleme, detay, karşılaştırma) yönetir.
 */

import api from './api';
import { DEMO_PLAYERS } from '../utils/demoData';

export const playerService = {
  /**
   * Tüm oyuncuları listele
   * @returns {Promise<Array>} Oyuncu listesi
   */
  getAllPlayers: async () => {
    try {
      const response = await api.get('/players');
      // If DB is empty, use demo data
      if (response && response.length > 0) return response;
      return DEMO_PLAYERS;
    } catch (error) {
      console.warn('API isteği başarısız oldu, demo veriler kullanılıyor.');
      return DEMO_PLAYERS;
    }
  },

  /**
   * Belirli bir oyuncunun detaylarını getir
   * Şut verileri ve istatistikler dahil
   * @param {number} id - Oyuncu ID
   * @returns {Promise<object>} Oyuncu detayları
   */
  getPlayerById: async (id) => {
    try {
      const response = await api.get(`/players/${id}`);
      if (response) return response;
      throw new Error('Bulunamadı');
    } catch (error) {
      const demoPlayer = DEMO_PLAYERS.find(p => p.id === Number(id)) || DEMO_PLAYERS[0];
      return demoPlayer;
    }
  },

  /**
   * İki oyuncuyu karşılaştır
   * @param {number} id1 - İlk oyuncu ID
   * @param {number} id2 - İkinci oyuncu ID
   * @returns {Promise<object>} Karşılaştırma verileri
   */
  comparePlayers: async (id1, id2) => {
    try {
      const response = await api.get(`/players/compare?id1=${id1}&id2=${id2}`);
      if (response && response.player1) return response;
      throw new Error('Bulunamadı');
    } catch (error) {
      const player1 = DEMO_PLAYERS.find(p => p.id === Number(id1)) || DEMO_PLAYERS[0];
      const player2 = DEMO_PLAYERS.find(p => p.id === Number(id2)) || DEMO_PLAYERS[1];
      return { player1, player2 };
    }
  },
};
