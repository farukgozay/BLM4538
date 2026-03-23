/**
 * ShotForge - Karşılaştırma Ekranı (ComparisonScreen)
 * İki oyuncunun istatistiklerini yan yana karşılaştırır.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { playerService } from '../services/playerService';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';
import { getInitials } from '../utils/helpers';

const ComparisonScreen = ({ route }) => {
  const [players, setPlayers] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchPlayers(); }, []);

  const fetchPlayers = async () => {
    try {
      const data = await playerService.getAllPlayers();
      setPlayers(data);
    } catch (error) {
      const demo = [
        { id: 1, name: 'LeBron James', team: 'LA Lakers', position: 'SF', stats: { pointsPerGame: 27.4, assistsPerGame: 8.3, reboundsPerGame: 7.1, fieldGoalPercentage: 51.2, gamesPlayed: 72 }},
        { id: 2, name: 'Stephen Curry', team: 'Warriors', position: 'PG', stats: { pointsPerGame: 29.6, assistsPerGame: 6.3, reboundsPerGame: 5.2, fieldGoalPercentage: 48.7, gamesPlayed: 68 }},
        { id: 3, name: 'Kevin Durant', team: 'Suns', position: 'SF', stats: { pointsPerGame: 28.3, assistsPerGame: 5.4, reboundsPerGame: 6.7, fieldGoalPercentage: 53.1, gamesPlayed: 60 }},
        { id: 4, name: 'Giannis A.', team: 'Bucks', position: 'PF', stats: { pointsPerGame: 31.1, assistsPerGame: 5.8, reboundsPerGame: 11.8, fieldGoalPercentage: 55.3, gamesPlayed: 70 }},
        { id: 5, name: 'Luka Doncic', team: 'Mavs', position: 'PG', stats: { pointsPerGame: 33.9, assistsPerGame: 9.8, reboundsPerGame: 9.2, fieldGoalPercentage: 48.7, gamesPlayed: 66 }},
      ];
      setPlayers(demo);
      setPlayer1(demo[0]);
      setPlayer2(demo[1]);
    } finally { setIsLoading(false); }
  };

  const selectPlayer = (player) => {
    if (selectedSlot === 1) { setPlayer1(player); setSelectedSlot(null); }
    else if (selectedSlot === 2) { setPlayer2(player); setSelectedSlot(null); }
  };

  const renderStatRow = (label, val1, val2) => {
    const v1 = parseFloat(val1) || 0;
    const v2 = parseFloat(val2) || 0;
    return (
      <View style={styles.statRow} key={label}>
        <Text style={[styles.statVal, v1 > v2 && styles.winnerVal]}>{val1 || '-'}</Text>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statVal, v2 > v1 && styles.winnerVal]}>{val2 || '-'}</Text>
      </View>
    );
  };

  if (isLoading) {
    return (<View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Player Headers */}
      <View style={styles.playersRow}>
        <TouchableOpacity style={[styles.playerSlot, selectedSlot === 1 && styles.selectedSlot]} onPress={() => setSelectedSlot(1)}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{player1 ? getInitials(player1.name) : '?'}</Text></View>
          <Text style={styles.playerName}>{player1?.name || 'Oyuncu Seç'}</Text>
          <Text style={styles.teamName}>{player1?.team || '—'}</Text>
        </TouchableOpacity>
        <Text style={styles.vsText}>VS</Text>
        <TouchableOpacity style={[styles.playerSlot, selectedSlot === 2 && styles.selectedSlot]} onPress={() => setSelectedSlot(2)}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{player2 ? getInitials(player2.name) : '?'}</Text></View>
          <Text style={styles.playerName}>{player2?.name || 'Oyuncu Seç'}</Text>
          <Text style={styles.teamName}>{player2?.team || '—'}</Text>
        </TouchableOpacity>
      </View>

      {/* Player Selection List */}
      {selectedSlot && (
        <View style={styles.selectionList}>
          <Text style={styles.selectionTitle}>Oyuncu {selectedSlot} Seç:</Text>
          {players.map((p) => (
            <TouchableOpacity key={p.id} style={styles.selectionItem} onPress={() => selectPlayer(p)}>
              <Text style={styles.selectionItemText}>{p.name}</Text>
              <Text style={styles.selectionTeam}>{p.team}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Stats Comparison */}
      {player1 && player2 && !selectedSlot && (
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>📊 İstatistik Karşılaştırma</Text>
          {renderStatRow('Sayı/Maç', player1.stats?.pointsPerGame, player2.stats?.pointsPerGame)}
          {renderStatRow('Asist/Maç', player1.stats?.assistsPerGame, player2.stats?.assistsPerGame)}
          {renderStatRow('Ribaund/Maç', player1.stats?.reboundsPerGame, player2.stats?.reboundsPerGame)}
          {renderStatRow('FG%', player1.stats?.fieldGoalPercentage, player2.stats?.fieldGoalPercentage)}
          {renderStatRow('Maç', player1.stats?.gamesPlayed, player2.stats?.gamesPlayed)}
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
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm, borderWidth: 2, borderColor: COLORS.primary },
  avatarText: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.primary },
  playerName: { fontSize: FONT_SIZES.md, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  teamName: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, textAlign: 'center' },
  vsText: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.primary, marginHorizontal: SPACING.sm },
  selectionList: { backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  selectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.md },
  selectionItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  selectionItemText: { fontSize: FONT_SIZES.md, color: COLORS.text, fontWeight: '600' },
  selectionTeam: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  statsCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.lg, textAlign: 'center' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  statVal: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.text, width: 60, textAlign: 'center' },
  winnerVal: { color: COLORS.primary },
  statLabel: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, textAlign: 'center', flex: 1 },
});

export default ComparisonScreen;
