import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { playerService } from '../services/playerService';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';
import { calculatePercentage } from '../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COURT_WIDTH = SCREEN_WIDTH - SPACING.md * 2;
const COURT_HEIGHT = COURT_WIDTH * 0.9;

// 40 adet demo atış verisi - gerçekçi basketbol pozisyonları
const DEMO_SHOTS = [
  // Serbest atış çizgisi
  { id: 1, x: 50, y: 22, made: true,  shotType: 'FREE_THROW' },
  { id: 2, x: 50, y: 22, made: true,  shotType: 'FREE_THROW' },
  { id: 3, x: 50, y: 22, made: false, shotType: 'FREE_THROW' },
  { id: 4, x: 50, y: 22, made: true,  shotType: 'FREE_THROW' },
  // Boya içi kısa atışlar
  { id: 5, x: 48, y: 8,  made: true,  shotType: 'TWO_POINT' },
  { id: 6, x: 52, y: 8,  made: true,  shotType: 'TWO_POINT' },
  { id: 7, x: 44, y: 12, made: false, shotType: 'TWO_POINT' },
  { id: 8, x: 56, y: 12, made: true,  shotType: 'TWO_POINT' },
  { id: 9, x: 50, y: 6,  made: false, shotType: 'TWO_POINT' },
  // Sol boya kenarı
  { id: 10, x: 32, y: 15, made: true,  shotType: 'TWO_POINT' },
  { id: 11, x: 32, y: 22, made: false, shotType: 'TWO_POINT' },
  { id: 12, x: 32, y: 30, made: true,  shotType: 'TWO_POINT' },
  // Sağ boya kenarı
  { id: 13, x: 68, y: 15, made: false, shotType: 'TWO_POINT' },
  { id: 14, x: 68, y: 22, made: true,  shotType: 'TWO_POINT' },
  { id: 15, x: 68, y: 30, made: true,  shotType: 'TWO_POINT' },
  // Orta mesafe sol
  { id: 16, x: 25, y: 35, made: true,  shotType: 'TWO_POINT' },
  { id: 17, x: 28, y: 42, made: false, shotType: 'TWO_POINT' },
  { id: 18, x: 22, y: 48, made: true,  shotType: 'TWO_POINT' },
  // Orta mesafe sağ
  { id: 19, x: 75, y: 35, made: false, shotType: 'TWO_POINT' },
  { id: 20, x: 72, y: 42, made: true,  shotType: 'TWO_POINT' },
  { id: 21, x: 78, y: 48, made: false, shotType: 'TWO_POINT' },
  // Orta top nokta
  { id: 22, x: 50, y: 38, made: true,  shotType: 'TWO_POINT' },
  { id: 23, x: 45, y: 32, made: false, shotType: 'TWO_POINT' },
  { id: 24, x: 55, y: 32, made: true,  shotType: 'TWO_POINT' },
  // Sol köşe 3'lük (corner 3)
  { id: 25, x: 5,  y: 28, made: true,  shotType: 'THREE_POINT' },
  { id: 26, x: 5,  y: 38, made: false, shotType: 'THREE_POINT' },
  { id: 27, x: 8,  y: 48, made: true,  shotType: 'THREE_POINT' },
  // Sağ köşe 3'lük (corner 3)
  { id: 28, x: 95, y: 28, made: false, shotType: 'THREE_POINT' },
  { id: 29, x: 95, y: 38, made: true,  shotType: 'THREE_POINT' },
  { id: 30, x: 92, y: 48, made: true,  shotType: 'THREE_POINT' },
  // Sol kanat 3'lük
  { id: 31, x: 12, y: 58, made: false, shotType: 'THREE_POINT' },
  { id: 32, x: 18, y: 65, made: true,  shotType: 'THREE_POINT' },
  // Sağ kanat 3'lük
  { id: 33, x: 88, y: 58, made: true,  shotType: 'THREE_POINT' },
  { id: 34, x: 82, y: 65, made: false, shotType: 'THREE_POINT' },
  // Üst top 3'lük yay
  { id: 35, x: 30, y: 72, made: true,  shotType: 'THREE_POINT' },
  { id: 36, x: 38, y: 76, made: false, shotType: 'THREE_POINT' },
  { id: 37, x: 50, y: 78, made: true,  shotType: 'THREE_POINT' },
  { id: 38, x: 62, y: 76, made: true,  shotType: 'THREE_POINT' },
  { id: 39, x: 70, y: 72, made: false, shotType: 'THREE_POINT' },
  { id: 40, x: 50, y: 55, made: true,  shotType: 'TWO_POINT' },
];

const ShotMapScreen = ({ route }) => {
  const { playerId, playerName } = route?.params || {};
  const [shots, setShots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, TWO_POINT, THREE_POINT, FREE_THROW

  useEffect(() => { fetchShotData(); }, []);

  const fetchShotData = async () => {
    try {
      const data = await playerService.getPlayerById(playerId);
      setShots(data.shots?.length > 0 ? data.shots : DEMO_SHOTS);
    } catch {
      setShots(DEMO_SHOTS);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredShots = filter === 'ALL' ? shots : shots.filter(s => s.shotType === filter);
  const madeShots = filteredShots.filter(s => s.made).length;
  const totalShots = filteredShots.length;
  const percentage = calculatePercentage(madeShots, totalShots);

  const FILTERS = [
    { key: 'ALL', label: 'Tümü' },
    { key: 'TWO_POINT', label: '2 Sayı' },
    { key: 'THREE_POINT', label: '3 Sayı' },
    { key: 'FREE_THROW', label: 'Serbest' },
  ];

  if (isLoading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.playerName}>{playerName || 'Oyuncu'}</Text>

      {/* Filtre butonları */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterBtnText, filter === f.key && styles.filterBtnTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Basketbol sahası */}
      <View style={styles.courtContainer}>
        <View style={styles.court}>
          {/* Boya (paint) */}
          <View style={styles.paint} />
          {/* Serbest atış çemberi */}
          <View style={styles.freeThrowCircle} />
          {/* Basket */}
          <View style={styles.basket} />
          {/* Basket çemberi */}
          <View style={styles.rim} />
          {/* 3'lük yay */}
          <View style={styles.threePointLine} />
          {/* Sol köşe 3'lük çizgisi */}
          <View style={styles.cornerLeft} />
          {/* Sağ köşe 3'lük çizgisi */}
          <View style={styles.cornerRight} />
          {/* Orta saha çizgisi */}
          <View style={styles.halfCourt} />

          {/* Atış noktaları */}
          {filteredShots.map(shot => (
            <View
              key={shot.id}
              style={[
                styles.shotDot,
                {
                  left: `${shot.x}%`,
                  top: `${shot.y}%`,
                  backgroundColor: shot.made ? COLORS.primary : COLORS.error,
                  width: shot.shotType === 'THREE_POINT' ? 14 : 12,
                  height: shot.shotType === 'THREE_POINT' ? 14 : 12,
                  borderRadius: shot.shotType === 'THREE_POINT' ? 7 : 6,
                  marginLeft: shot.shotType === 'THREE_POINT' ? -7 : -6,
                  marginTop: shot.shotType === 'THREE_POINT' ? -7 : -6,
                }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.legendText}>İsabetli ({filteredShots.filter(s => s.made).length})</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
          <Text style={styles.legendText}>İsabetsiz ({filteredShots.filter(s => !s.made).length})</Text>
        </View>
      </View>

      {/* Özet istatistikler */}
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
          <Text style={styles.summaryLabel}>İsabet %</Text>
        </View>
      </View>

      {/* Tip bazlı özet */}
      <View style={styles.typeCard}>
        <Text style={styles.typeTitle}>Şut Tipi Dağılımı</Text>
        {['TWO_POINT', 'THREE_POINT', 'FREE_THROW'].map(type => {
          const typeShots = shots.filter(s => s.shotType === type);
          const typeMade = typeShots.filter(s => s.made).length;
          const labels = { TWO_POINT: '2 Sayılık', THREE_POINT: '3 Sayılık', FREE_THROW: 'Serbest Atış' };
          return (
            <View key={type} style={styles.typeRow}>
              <Text style={styles.typeLabel}>{labels[type]}</Text>
              <Text style={styles.typeStats}>{typeMade}/{typeShots.length}</Text>
              <Text style={styles.typePct}>%{calculatePercentage(typeMade, typeShots.length)}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  playerName: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginVertical: SPACING.md },
  filterRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  filterBtn: { flex: 1, paddingVertical: SPACING.sm, borderRadius: 8, backgroundColor: COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterBtnText: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontWeight: '600' },
  filterBtnTextActive: { color: COLORS.background },
  courtContainer: { alignItems: 'center', marginBottom: SPACING.md },
  court: { width: COURT_WIDTH, height: COURT_HEIGHT, backgroundColor: '#1a3a1a', borderRadius: 8, borderWidth: 2, borderColor: COLORS.primary + '60', position: 'relative', overflow: 'hidden' },
  paint: { position: 'absolute', top: 0, left: '30%', width: '40%', height: '40%', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', borderTopWidth: 0 },
  freeThrowCircle: { position: 'absolute', top: '25%', left: '35%', width: '30%', height: '20%', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 100 },
  basket: { position: 'absolute', top: '3%', left: '44%', width: '12%', height: '6%', borderWidth: 2, borderColor: COLORS.warning, borderRadius: 100 },
  rim: { position: 'absolute', top: '3.5%', left: '46%', width: '8%', height: '4%', backgroundColor: COLORS.warning + '40', borderRadius: 100 },
  threePointLine: { position: 'absolute', top: 0, left: '8%', width: '84%', height: '72%', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)', borderTopWidth: 0, borderBottomLeftRadius: 999, borderBottomRightRadius: 999 },
  cornerLeft: { position: 'absolute', top: 0, left: '8%', width: 0, height: '28%', borderLeftWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)' },
  cornerRight: { position: 'absolute', top: 0, right: '8%', width: 0, height: '28%', borderLeftWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)' },
  halfCourt: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  shotDot: { position: 'absolute', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', elevation: 2 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.xl, marginBottom: SPACING.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.sm },
  summaryCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: COLORS.border },
  summaryValue: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.xs },
  summaryLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  typeCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.xxl, borderWidth: 1, borderColor: COLORS.border },
  typeTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.md },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  typeLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, flex: 1 },
  typeStats: { fontSize: FONT_SIZES.sm, color: COLORS.text, fontWeight: '600', marginRight: SPACING.md },
  typePct: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontWeight: 'bold', width: 50, textAlign: 'right' },
});

export default ShotMapScreen;
