import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { playerService } from '../services/playerService';
import { COLORS, SPACING, FONT_SIZES, POSITIONS } from '../utils/constants';
import { getInitials, calculatePercentage } from '../utils/helpers';

const DEMO_DATA = {
  1: { photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',    stats: { gamesPlayed: 72, pointsPerGame: 27.4, assistsPerGame: 8.3,  reboundsPerGame: 7.1,  fieldGoalPercentage: 51.2, threePointPercentage: 41.0, blocksPerGame: 0.8, stealsPerGame: 1.3 } },
  2: { photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',  stats: { gamesPlayed: 68, pointsPerGame: 29.6, assistsPerGame: 6.3,  reboundsPerGame: 5.2,  fieldGoalPercentage: 48.7, threePointPercentage: 42.7, blocksPerGame: 0.4, stealsPerGame: 1.4 } },
  3: { photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png',  stats: { gamesPlayed: 60, pointsPerGame: 28.3, assistsPerGame: 5.4,  reboundsPerGame: 6.7,  fieldGoalPercentage: 53.1, threePointPercentage: 40.2, blocksPerGame: 1.1, stealsPerGame: 0.9 } },
  4: { photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png',  stats: { gamesPlayed: 70, pointsPerGame: 31.1, assistsPerGame: 5.8,  reboundsPerGame: 11.8, fieldGoalPercentage: 55.3, threePointPercentage: 27.5, blocksPerGame: 1.4, stealsPerGame: 1.2 } },
  5: { photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png', stats: { gamesPlayed: 66, pointsPerGame: 33.9, assistsPerGame: 9.8,  reboundsPerGame: 9.2,  fieldGoalPercentage: 48.7, threePointPercentage: 38.0, blocksPerGame: 0.5, stealsPerGame: 1.4 } },
};

const PlayerDetailScreen = ({ route, navigation }) => {
  const { playerId, playerName, playerData } = route.params;
  const [player, setPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchPlayerDetail(); }, []);

  const fetchPlayerDetail = async () => {
    try {
      const data = await playerService.getPlayerById(playerId);
      const demo = DEMO_DATA[playerId] || DEMO_DATA[1];
      setPlayer({
        ...data,
        photo: data.photo || playerData?.photo || demo.photo,
        stats: data.stats || playerData?.stats || demo.stats,
      });
    } catch {
      const demo = DEMO_DATA[playerId] || DEMO_DATA[1];
      setPlayer({
        id: playerId,
        name: playerName || playerData?.name || 'Oyuncu',
        team: playerData?.team || 'NBA',
        position: playerData?.position || 'PG',
        jerseyNumber: playerData?.jerseyNumber || 0,
        photo: playerData?.photo || demo.photo,
        stats: playerData?.stats || demo.stats,
        shots: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  const stats = player?.stats || {};

  const statItems = [
    { label: 'Sayı/Maç',    value: stats.pointsPerGame,          color: COLORS.primary },
    { label: 'Asist/Maç',   value: stats.assistsPerGame,         color: COLORS.text },
    { label: 'Ribaund/Maç', value: stats.reboundsPerGame,        color: COLORS.text },
    { label: 'Maç Sayısı',  value: stats.gamesPlayed,            color: COLORS.text },
    { label: 'FG%',         value: stats.fieldGoalPercentage ? `%${stats.fieldGoalPercentage}` : '-', color: COLORS.primary },
    { label: '3P%',         value: stats.threePointPercentage ? `%${stats.threePointPercentage}` : '-', color: COLORS.text },
    { label: 'Blok/Maç',   value: stats.blocksPerGame,           color: COLORS.text },
    { label: 'Çalma/Maç',  value: stats.stealsPerGame,           color: COLORS.text },
    { label: 'Şut Verisi',  value: player?.shots?.length || 0,   color: COLORS.text },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {player?.photo
            ? <Image source={{ uri: player.photo }} style={styles.avatarImage} resizeMode="cover" />
            : <Text style={styles.avatarText}>{getInitials(player?.name)}</Text>
          }
        </View>
        <Text style={styles.playerName}>{player?.name}</Text>
        <Text style={styles.teamName}>{player?.team}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>#{player?.jerseyNumber}</Text></View>
          <View style={styles.badge}><Text style={styles.badgeText}>{POSITIONS[player?.position] || player?.position}</Text></View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>📊 İstatistikler</Text>
      <View style={styles.statsGrid}>
        {statItems.map((item, idx) => (
          <View key={idx} style={styles.statCard}>
            <Text style={[styles.statValue, { color: item.color }]}>{item.value ?? '-'}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('ShotMap', { playerId: player.id, playerName: player.name })}
        >
          <Text style={styles.primaryButtonText}>🗺️ Şut Haritasını Gör</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Comparison')}
        >
          <Text style={styles.secondaryButtonText}>⚖️ Karşılaştır</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  profileCard: { alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 20, padding: SPACING.xl, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md, borderWidth: 2, borderColor: COLORS.primary, overflow: 'hidden' },
  avatarImage: { width: 100, height: 100 },
  avatarText: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.primary },
  playerName: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  teamName: { fontSize: FONT_SIZES.lg, color: COLORS.textSecondary, marginBottom: SPACING.md },
  badgeRow: { flexDirection: 'row', gap: SPACING.sm },
  badge: { backgroundColor: COLORS.primary + '20', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20 },
  badgeText: { color: COLORS.primary, fontWeight: '600', fontSize: FONT_SIZES.sm },
  sectionTitle: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.text, marginTop: SPACING.lg, marginBottom: SPACING.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  statCard: { width: '31%', backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', marginBottom: SPACING.xs },
  statLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, textAlign: 'center' },
  actionButtons: { marginTop: SPACING.lg, marginBottom: SPACING.xxl, gap: SPACING.sm },
  primaryButton: { backgroundColor: COLORS.primary, borderRadius: 12, padding: SPACING.md, alignItems: 'center' },
  primaryButtonText: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.background },
  secondaryButton: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary },
  secondaryButtonText: { fontSize: FONT_SIZES.lg, fontWeight: '600', color: COLORS.primary },
});

export default PlayerDetailScreen;
