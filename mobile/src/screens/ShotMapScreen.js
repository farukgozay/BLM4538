/**
 * ShotForge - Şut Haritası Ekranı (ShotMapScreen)
 * Oyuncunun şut koordinatlarını basketbol sahası üzerinde görselleştirir.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { playerService } from '../services/playerService';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';
import { calculatePercentage } from '../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COURT_WIDTH = SCREEN_WIDTH - SPACING.md * 2;
const COURT_HEIGHT = COURT_WIDTH * 0.85;

const ShotMapScreen = ({ route }) => {
  const { playerId, playerName } = route.params || {};
  const [shots, setShots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchShotData(); }, []);

  const fetchShotData = async () => {
    try {
      const data = await playerService.getPlayerById(playerId);
      setShots(data.shots || []);
    } catch (error) {
      setShots([
        { id: 1, x: 50, y: 20, made: true, shotType: 'TWO_POINT' },
        { id: 2, x: 30, y: 50, made: false, shotType: 'THREE_POINT' },
        { id: 3, x: 70, y: 50, made: true, shotType: 'THREE_POINT' },
        { id: 4, x: 45, y: 35, made: true, shotType: 'TWO_POINT' },
        { id: 5, x: 55, y: 35, made: false, shotType: 'TWO_POINT' },
        { id: 6, x: 50, y: 10, made: true, shotType: 'FREE_THROW' },
        { id: 7, x: 20, y: 60, made: false, shotType: 'THREE_POINT' },
        { id: 8, x: 80, y: 60, made: true, shotType: 'THREE_POINT' },
        { id: 9, x: 40, y: 25, made: true, shotType: 'TWO_POINT' },
        { id: 10, x: 60, y: 25, made: false, shotType: 'TWO_POINT' },
      ]);
    } finally { setIsLoading(false); }
  };

  const madeShots = shots.filter((s) => s.made).length;
  const totalShots = shots.length;
  const percentage = calculatePercentage(madeShots, totalShots);

  if (isLoading) {
    return (<View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>);
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.playerName}>{playerName || 'Oyuncu'}</Text>
      <View style={styles.courtContainer}>
        <View style={styles.court}>
          <View style={styles.paint} />
          <View style={styles.freeThrowCircle} />
          <View style={styles.basket} />
          <View style={styles.threePointLine} />
          {shots.map((shot) => (
            <View key={shot.id} style={[styles.shotDot, {
              left: `${shot.x}%`, top: `${shot.y}%`,
              backgroundColor: shot.made ? COLORS.primary : COLORS.error,
            }]} />
          ))}
        </View>
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendText}>İsabetli ({madeShots})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
          <Text style={styles.legendText}>İsabetsiz ({totalShots - madeShots})</Text>
        </View>
      </View>
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalShots}</Text>
          <Text style={styles.summaryLabel}>Toplam Şut</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{madeShots}</Text>
          <Text style={styles.summaryLabel}>İsabetli</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: COLORS.primary }]}>%{percentage}</Text>
          <Text style={styles.summaryLabel}>Yüzde</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  playerName: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginVertical: SPACING.md },
  courtContainer: { alignItems: 'center', marginBottom: SPACING.md },
  court: { width: COURT_WIDTH, height: COURT_HEIGHT, backgroundColor: COLORS.surfaceLight, borderRadius: 8, borderWidth: 2, borderColor: COLORS.primary + '40', position: 'relative', overflow: 'hidden' },
  paint: { position: 'absolute', top: 0, left: '30%', width: '40%', height: '45%', borderWidth: 1, borderColor: COLORS.primary + '40', borderTopWidth: 0 },
  freeThrowCircle: { position: 'absolute', top: '30%', left: '35%', width: '30%', height: '20%', borderWidth: 1, borderColor: COLORS.primary + '30', borderRadius: 100 },
  basket: { position: 'absolute', top: '2%', left: '47%', width: '6%', height: '4%', backgroundColor: COLORS.warning, borderRadius: 100 },
  threePointLine: { position: 'absolute', top: 0, left: '10%', width: '80%', height: '75%', borderWidth: 1, borderColor: COLORS.primary + '25', borderTopWidth: 0, borderBottomLeftRadius: 200, borderBottomRightRadius: 200 },
  shotDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, marginLeft: -6, marginTop: -6, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.xl, marginBottom: SPACING.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md },
  summaryCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: COLORS.border },
  summaryValue: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  summaryLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
});

export default ShotMapScreen;
