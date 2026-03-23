/**
 * ShotForge - Oyuncu Detay Ekranı (PlayerDetailScreen)
 * 
 * Seçilen oyuncunun detaylı istatistiklerini,
 * şut verilerini ve performans bilgilerini gösterir.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { playerService } from '../services/playerService';
import { COLORS, SPACING, FONT_SIZES, POSITIONS } from '../utils/constants';
import { getInitials, calculatePercentage } from '../utils/helpers';

const PlayerDetailScreen = ({ route, navigation }) => {
  const { playerId, playerName } = route.params;
  const [player, setPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlayerDetail();
  }, []);

  /**
   * Oyuncu detay verisini API'den getir
   */
  const fetchPlayerDetail = async () => {
    try {
      const data = await playerService.getPlayerById(playerId);
      setPlayer(data);
    } catch (error) {
      console.error('Oyuncu detayı yüklenemedi:', error);
      // Demo veri
      setPlayer({
        id: playerId,
        name: playerName || 'Demo Oyuncu',
        team: 'Demo Takım',
        position: 'PG',
        jerseyNumber: 23,
        stats: {
          gamesPlayed: 72,
          pointsPerGame: 27.4,
          assistsPerGame: 8.3,
          reboundsPerGame: 7.1,
          fieldGoalPercentage: 51.2,
        },
        shots: [
          { x: 50, y: 30, made: true, shotType: 'TWO_POINT' },
          { x: 70, y: 60, made: false, shotType: 'THREE_POINT' },
          { x: 30, y: 40, made: true, shotType: 'TWO_POINT' },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const stats = player?.stats || {};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Oyuncu Profil Kartı */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{getInitials(player?.name)}</Text>
        </View>
        <Text style={styles.playerName}>{player?.name}</Text>
        <Text style={styles.teamName}>{player?.team}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              #{player?.jerseyNumber}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {POSITIONS[player?.position] || player?.position}
            </Text>
          </View>
        </View>
      </View>

      {/* İstatistik Kartları */}
      <Text style={styles.sectionTitle}>📊 İstatistikler</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.pointsPerGame || '-'}</Text>
          <Text style={styles.statLabel}>Sayı/Maç</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.assistsPerGame || '-'}</Text>
          <Text style={styles.statLabel}>Asist/Maç</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.reboundsPerGame || '-'}</Text>
          <Text style={styles.statLabel}>Ribaund/Maç</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.gamesPlayed || '-'}</Text>
          <Text style={styles.statLabel}>Maç Sayısı</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>
            %{stats.fieldGoalPercentage || '-'}
          </Text>
          <Text style={styles.statLabel}>FG%</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {player?.shots?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Şut Verisi</Text>
        </View>
      </View>

      {/* Aksiyon Butonları */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('ShotMap', { playerId: player.id, playerName: player.name })}
        >
          <Text style={styles.primaryButtonText}>🗺️ Şut Haritasını Gör</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Comparison', { player1Id: player.id })}
        >
          <Text style={styles.secondaryButtonText}>⚖️ Karşılaştır</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.xl,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  playerName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  teamName: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  badge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
  },
  badgeText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  statCard: {
    width: '31%',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xxl,
    gap: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default PlayerDetailScreen;
