import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { playerService } from '../services/playerService';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';
import { getInitials } from '../utils/helpers';

const DEMO_PLAYERS = [
  {
    id: 1, name: 'LeBron James', team: 'LA Lakers', position: 'SF',
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    stats: { pointsPerGame: 27.4, assistsPerGame: 8.3, reboundsPerGame: 7.1, fieldGoalPercentage: 51.2, gamesPlayed: 72 },
  },
  {
    id: 2, name: 'Stephen Curry', team: 'Warriors', position: 'PG',
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',
    stats: { pointsPerGame: 29.6, assistsPerGame: 6.3, reboundsPerGame: 5.2, fieldGoalPercentage: 48.7, gamesPlayed: 68 },
  },
  {
    id: 3, name: 'Kevin Durant', team: 'Suns', position: 'SF',
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png',
    stats: { pointsPerGame: 28.3, assistsPerGame: 5.4, reboundsPerGame: 6.7, fieldGoalPercentage: 53.1, gamesPlayed: 60 },
  },
  {
    id: 4, name: 'Giannis A.', team: 'Bucks', position: 'PF',
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png',
    stats: { pointsPerGame: 31.1, assistsPerGame: 5.8, reboundsPerGame: 11.8, fieldGoalPercentage: 55.3, gamesPlayed: 70 },
  },
  {
    id: 5, name: 'Luka Doncic', team: 'Mavs', position: 'PG',
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png',
    stats: { pointsPerGame: 33.9, assistsPerGame: 9.8, reboundsPerGame: 9.2, fieldGoalPercentage: 48.7, gamesPlayed: 66 },
  },
  {
    id: 6, name: 'Nikola Jokic', team: 'Nuggets', position: 'C',
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png',
    stats: { pointsPerGame: 26.4, assistsPerGame: 9.0, reboundsPerGame: 12.4, fieldGoalPercentage: 58.3, gamesPlayed: 69 },
  },
];

const ComparisonScreen = () => {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchPlayers(); }, []);

  const fetchPlayers = async () => {
    try {
      const data = await playerService.getAllPlayers();
      const enriched = data.map((p, i) => ({
        ...p,
        photo: p.photo || DEMO_PLAYERS[i % DEMO_PLAYERS.length].photo,
        stats: p.stats || DEMO_PLAYERS[i % DEMO_PLAYERS.length].stats,
      }));
      setPlayers(enriched);
      setPlayer1(enriched[0]);
      setPlayer2(enriched[1]);
    } catch {
      setPlayers(DEMO_PLAYERS);
      setPlayer1(DEMO_PLAYERS[0]);
      setPlayer2(DEMO_PLAYERS[1]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectPlayer = (player) => {
    if (selectedSlot === 1) setPlayer1(player);
    else if (selectedSlot === 2) setPlayer2(player);
    setSelectedSlot(null);
  };

  const renderStatRow = (label, val1, val2) => {
    const v1 = parseFloat(val1) || 0;
    const v2 = parseFloat(val2) || 0;
    return (
      <View style={styles.statRow} key={label}>
        <Text style={[styles.statVal, v1 > v2 && styles.winnerVal]}>{val1 ?? '-'}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statVal, v2 > v1 && styles.winnerVal]}>{val2 ?? '-'}</Text>
      </View>
    );
  };

  const PlayerSlot = ({ player, slot }) => (
    <TouchableOpacity
      style={[styles.playerSlot, selectedSlot === slot && styles.selectedSlot]}
      onPress={() => setSelectedSlot(slot)}
    >
      <View style={styles.avatar}>
        {player?.photo
          ? <Image source={{ uri: player.photo }} style={styles.avatarImage} resizeMode="cover" />
          : <Text style={styles.avatarText}>{player ? getInitials(player.name) : '?'}</Text>
        }
      </View>
      <Text style={styles.playerName} numberOfLines={1}>{player?.name || 'Oyuncu Seç'}</Text>
      <Text style={styles.teamName}>{player?.team || '—'}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Oyuncu seçim başlıkları */}
      <View style={styles.playersRow}>
        <PlayerSlot player={player1} slot={1} />
        <Text style={styles.vsText}>VS</Text>
        <PlayerSlot player={player2} slot={2} />
      </View>

      {/* Oyuncu seçim listesi */}
      {selectedSlot && (
        <View style={styles.selectionList}>
          <Text style={styles.selectionTitle}>Oyuncu {selectedSlot} Seç:</Text>
          {players.map((p) => (
            <TouchableOpacity key={p.id} style={styles.selectionItem} onPress={() => selectPlayer(p)}>
              {p.photo
                ? <Image source={{ uri: p.photo }} style={styles.selectionAvatar} resizeMode="cover" />
                : <View style={[styles.selectionAvatar, styles.selectionAvatarFallback]}><Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{getInitials(p.name)}</Text></View>
              }
              <View style={{ flex: 1 }}>
                <Text style={styles.selectionItemText}>{p.name}</Text>
                <Text style={styles.selectionTeam}>{p.team}</Text>
              </View>
              <Text style={styles.selectionPpg}>{p.stats?.pointsPerGame} PPG</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* İstatistik karşılaştırma */}
      {player1 && player2 && !selectedSlot && (
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>📊 İstatistik Karşılaştırma</Text>
          {renderStatRow('Sayı/Maç', player1.stats?.pointsPerGame, player2.stats?.pointsPerGame)}
          {renderStatRow('Asist/Maç', player1.stats?.assistsPerGame, player2.stats?.assistsPerGame)}
          {renderStatRow('Ribaund/Maç', player1.stats?.reboundsPerGame, player2.stats?.reboundsPerGame)}
          {renderStatRow('FG%', player1.stats?.fieldGoalPercentage, player2.stats?.fieldGoalPercentage)}
          {renderStatRow('Maç Sayısı', player1.stats?.gamesPlayed, player2.stats?.gamesPlayed)}
        </View>
      )}

      {/* Oyuncu seçilmemişse uyarı */}
      {(!player1 || !player2) && !selectedSlot && (
        <View style={styles.hintCard}>
          <Text style={styles.hintText}>👆 Yukarıdan oyuncu seçerek karşılaştırma yap</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  playersRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.lg, marginBottom: SPACING.md },
  playerSlot: { flex: 1, alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  selectedSlot: { borderColor: COLORS.primary, borderWidth: 2 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm, borderWidth: 2, borderColor: COLORS.primary, overflow: 'hidden' },
  avatarImage: { width: 72, height: 72 },
  avatarText: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.primary },
  playerName: { fontSize: FONT_SIZES.sm, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  teamName: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, textAlign: 'center' },
  vsText: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.primary, marginHorizontal: SPACING.sm },
  selectionList: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  selectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.md },
  selectionItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  selectionAvatar: { width: 40, height: 40, borderRadius: 20 },
  selectionAvatarFallback: { backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center' },
  selectionItemText: { fontSize: FONT_SIZES.md, color: COLORS.text, fontWeight: '600' },
  selectionTeam: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  selectionPpg: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: 'bold' },
  statsCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.lg, textAlign: 'center' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  statVal: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.text, width: 60, textAlign: 'center' },
  winnerVal: { color: COLORS.primary },
  statLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, textAlign: 'center', flex: 1 },
  hintCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.xxl },
  hintText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md },
});

export default ComparisonScreen;
