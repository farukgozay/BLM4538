import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Image, Dimensions,
} from 'react-native';
import { playerService } from '../services/playerService';
import { DEMO_PLAYERS } from '../utils/demoData';
import { COLORS, SPACING, FONT_SIZES, POSITIONS } from '../utils/constants';
import { getInitials } from '../utils/helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MINI_COURT_W = SCREEN_WIDTH - SPACING.md * 4;
const MINI_COURT_H = MINI_COURT_W * 0.55;

const PREVIEW_SHOTS = [
  { id: 1,  x: 50, y: 18, made: true,  type: 'ft'    },
  { id: 2,  x: 48, y: 7,  made: true,  type: 'two'   },
  { id: 3,  x: 52, y: 7,  made: false, type: 'two'   },
  { id: 4,  x: 32, y: 20, made: true,  type: 'two'   },
  { id: 5,  x: 68, y: 20, made: false, type: 'two'   },
  { id: 6,  x: 25, y: 35, made: true,  type: 'two'   },
  { id: 7,  x: 75, y: 35, made: true,  type: 'two'   },
  { id: 8,  x: 5,  y: 28, made: true,  type: 'three' },
  { id: 9,  x: 95, y: 28, made: false, type: 'three' },
  { id: 10, x: 50, y: 75, made: true,  type: 'three' },
  { id: 11, x: 30, y: 68, made: false, type: 'three' },
  { id: 12, x: 70, y: 68, made: true,  type: 'three' },
  { id: 13, x: 50, y: 40, made: true,  type: 'two'   },
  { id: 14, x: 38, y: 30, made: false, type: 'two'   },
  { id: 15, x: 62, y: 30, made: true,  type: 'two'   },
];

const PlayerDetailScreen = ({ route, navigation }) => {
  const { playerId, playerName, playerData } = route.params;
  const [player, setPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchPlayerDetail(); }, []);

  const fetchPlayerDetail = async () => {
    try {
      const data = await playerService.getPlayerById(playerId);
      const fallback = DEMO_PLAYERS.find(p => p.id === Number(playerId)) || DEMO_PLAYERS[0];
      setPlayer({
        ...data,
        photo: data.photo || playerData?.photo || fallback.photo,
        stats: data.stats || playerData?.stats || fallback.stats,
        shots: data.shots || fallback.shots || [],
      });
    } catch {
      const fallback = DEMO_PLAYERS.find(p => p.id === Number(playerId)) || DEMO_PLAYERS[0];
      setPlayer({
        id: playerId,
        name: playerName || fallback.name,
        team: playerData?.team || fallback.team,
        position: playerData?.position || fallback.position,
        jerseyNumber: playerData?.jerseyNumber || fallback.jerseyNumber,
        photo: playerData?.photo || fallback.photo,
        stats: playerData?.stats || fallback.stats,
        shots: fallback.shots || [],
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
  const shots = PREVIEW_SHOTS;
  const madeCount = shots.filter(s => s.made).length;
  const shotPct = Math.round((madeCount / shots.length) * 100);

  const shootingZones = [
    {
      label: '2 Sayılık',
      pct: stats.fieldGoalPercentage || 0,
      made: Math.round((stats.totalShots || 800) * 0.6 * (stats.fieldGoalPercentage || 50) / 100),
      total: Math.round((stats.totalShots || 800) * 0.6),
      color: COLORS.primary,
    },
    {
      label: '3 Sayılık',
      pct: stats.threePointPercentage || 0,
      made: Math.round((stats.totalShots || 800) * 0.35 * (stats.threePointPercentage || 35) / 100),
      total: Math.round((stats.totalShots || 800) * 0.35),
      color: '#00B0FF',
    },
    {
      label: 'Serbest Atış',
      pct: stats.freeThrowPercentage || 0,
      made: Math.round((stats.totalShots || 800) * 0.05 * (stats.freeThrowPercentage || 75) / 100),
      total: Math.round((stats.totalShots || 800) * 0.05),
      color: COLORS.warning,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── Profil Kartı ── */}
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          {player?.photo
            ? <Image source={{ uri: player.photo }} style={styles.avatarImg} resizeMode="cover" />
            : <Text style={styles.avatarInitials}>{getInitials(player?.name)}</Text>
          }
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.playerName}>{player?.name}</Text>
          <Text style={styles.teamName}>{player?.team}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>#{player?.jerseyNumber}</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>{POSITIONS[player?.position] || player?.position}</Text></View>
          </View>
        </View>
      </View>

      {/* ── Season Stats ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>📊</Text>
        <Text style={styles.sectionTitle}>SEASON STATS</Text>
      </View>

      <View style={styles.efgHero}>
        <View style={styles.efgMain}>
          <Text style={styles.efgLabel}>EFG%</Text>
          <Text style={styles.efgValue}>{stats.efgPercentage ?? stats.fieldGoalPercentage ?? '-'}%</Text>
          <Text style={styles.efgSub}>Effective Field Goal</Text>
        </View>
        <View style={styles.efgDivider} />
        <View style={styles.efgSide}>
          <View style={styles.efgSideItem}>
            <Text style={styles.efgSideVal}>{stats.pointsPerGame ?? '-'}</Text>
            <Text style={styles.efgSideLabel}>PPG</Text>
          </View>
          <View style={styles.efgSideItem}>
            <Text style={styles.efgSideVal}>{stats.totalShots ?? '-'}</Text>
            <Text style={styles.efgSideLabel}>TOPLAM ŞUT</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {[
          { label: 'ASİST/MAÇ',   value: stats.assistsPerGame,  icon: '🎯' },
          { label: 'RİBAUND/MAÇ', value: stats.reboundsPerGame, icon: '💪' },
          { label: 'FAUL/MAÇ',    value: stats.foulsPerGame,    icon: '✋' },
          { label: 'BLOK/MAÇ',    value: stats.blocksPerGame,   icon: '🛡️' },
          { label: 'ÇALMA/MAÇ',   value: stats.stealsPerGame,   icon: '⚡' },
          { label: 'MAÇ SAYISI',  value: stats.gamesPlayed,     icon: '🏀' },
        ].map((item, idx) => (
          <View key={idx} style={styles.statCard}>
            <Text style={styles.statIcon}>{item.icon}</Text>
            <Text style={styles.statVal}>{item.value ?? '-'}</Text>
            <Text style={styles.statLbl}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Shot Chart Önizleme ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>🎯</Text>
        <Text style={styles.sectionTitle}>SHOT CHART</Text>
      </View>

      <TouchableOpacity
        style={styles.miniCourtWrap}
        onPress={() => navigation.navigate('ShotMap', { playerId: player.id, playerName: player.name })}
        activeOpacity={0.85}
      >
        <View style={styles.miniCourt}>
          <View style={styles.miniPaint} />
          <View style={styles.miniBasket} />
          <View style={styles.miniThreeLine} />
          <View style={styles.miniCornerL} />
          <View style={styles.miniCornerR} />
          {shots.map(shot => (
            <View
              key={shot.id}
              style={[
                styles.shotDot,
                { left: `${shot.x}%`, top: `${shot.y}%`, backgroundColor: shot.made ? COLORS.primary : COLORS.error },
              ]}
            />
          ))}
          <View style={styles.courtOverlay}>
            <Text style={styles.courtOverlayText}>Tam Görünüm →</Text>
          </View>
        </View>
        <View style={styles.miniLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.legendTxt}>İsabetli ({madeCount})</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.error }]} />
            <Text style={styles.legendTxt}>İsabetsiz ({shots.length - madeCount})</Text>
          </View>
          <Text style={styles.legendPct}>{shotPct}%</Text>
        </View>
      </TouchableOpacity>

      {/* ── Shooting Zones ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>📈</Text>
        <Text style={styles.sectionTitle}>SHOOTING ZONES</Text>
      </View>

      <View style={styles.zonesCard}>
        {shootingZones.map((zone, idx) => (
          <View key={idx} style={styles.zoneRow}>
            <View style={styles.zoneLeft}>
              <Text style={styles.zoneLabel}>{zone.label}</Text>
              <Text style={styles.zoneSub}>{zone.made}/{zone.total} şut</Text>
            </View>
            <View style={styles.zoneBarWrap}>
              <View style={styles.zoneBarBg}>
                <View style={[styles.zoneBarFill, { width: `${Math.min(zone.pct, 100)}%`, backgroundColor: zone.color }]} />
              </View>
              <Text style={[styles.zonePct, { color: zone.color }]}>%{zone.pct}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ── Aksiyon Butonları ── */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ShotMap', { playerId: player.id, playerName: player.name })}
        >
          <Text style={styles.primaryBtnText}>🗺️ Şut Haritasını Aç</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Comparison')}
        >
          <Text style={styles.secondaryBtnText}>⚖️ Oyuncu Karşılaştır</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.md },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },

  // Profil
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 20, padding: SPACING.md, marginTop: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
  avatarWrap: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: COLORS.primary, overflow: 'hidden' },
  avatarImg: { width: 90, height: 90 },
  avatarInitials: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.primary },
  profileInfo: { flex: 1, marginLeft: SPACING.md },
  playerName: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', color: COLORS.text },
  teamName: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2, marginBottom: SPACING.sm },
  badgeRow: { flexDirection: 'row', gap: SPACING.sm },
  badge: { backgroundColor: COLORS.primary + '20', paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: 20 },
  badgeText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZES.xs },

  // Bölüm başlığı
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  sectionIcon: { fontSize: 18 },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: 'bold', color: COLORS.text, letterSpacing: 1.5 },

  // EFG Hero
  efgHero: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.primary + '50', marginBottom: SPACING.md },
  efgMain: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  efgLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, letterSpacing: 2, fontWeight: '700' },
  efgValue: { fontSize: 40, fontWeight: 'bold', color: COLORS.primary, lineHeight: 48 },
  efgSub: { fontSize: FONT_SIZES.xs, color: COLORS.textMuted },
  efgDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.md },
  efgSide: { flex: 1, justifyContent: 'space-around' },
  efgSideItem: { alignItems: 'center' },
  efgSideVal: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  efgSideLabel: { fontSize: 10, color: COLORS.textSecondary, letterSpacing: 1 },

  // Stats grid
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.sm },
  statCard: { width: (SCREEN_WIDTH - SPACING.md * 2 - SPACING.sm * 2) / 3, backgroundColor: COLORS.surface, borderRadius: 12, padding: SPACING.sm, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statIcon: { fontSize: 18, marginBottom: 4 },
  statVal: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  statLbl: { fontSize: 9, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2, letterSpacing: 0.5 },

  // Mini court önizleme
  miniCourtWrap: { marginBottom: SPACING.md },
  miniCourt: { width: MINI_COURT_W, height: MINI_COURT_H, backgroundColor: '#0e2a0e', borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.primary + '40', position: 'relative', overflow: 'hidden', alignSelf: 'center' },
  miniPaint: { position: 'absolute', top: 0, left: '30%', width: '40%', height: '45%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderTopWidth: 0 },
  miniBasket: { position: 'absolute', top: '4%', left: '43%', width: '14%', height: '10%', borderWidth: 2, borderColor: COLORS.warning, borderRadius: 100 },
  miniThreeLine: { position: 'absolute', top: 0, left: '8%', width: '84%', height: '75%', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderTopWidth: 0, borderBottomLeftRadius: 999, borderBottomRightRadius: 999 },
  miniCornerL: { position: 'absolute', top: 0, left: '8%', width: 0, height: '25%', borderLeftWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  miniCornerR: { position: 'absolute', top: 0, right: '8%', width: 0, height: '25%', borderLeftWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  shotDot: { position: 'absolute', width: 8, height: 8, borderRadius: 4, marginLeft: -4, marginTop: -4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  courtOverlay: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary + 'CC', paddingHorizontal: SPACING.sm, paddingVertical: 4, borderTopLeftRadius: 8 },
  courtOverlayText: { color: COLORS.background, fontSize: FONT_SIZES.xs, fontWeight: '700' },
  miniLegend: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, paddingHorizontal: SPACING.xs, gap: SPACING.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendTxt: { color: COLORS.textSecondary, fontSize: FONT_SIZES.xs },
  legendPct: { marginLeft: 'auto', color: COLORS.primary, fontWeight: 'bold', fontSize: FONT_SIZES.md },

  // Shooting zones
  zonesCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md, gap: SPACING.md },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  zoneLeft: { width: 90 },
  zoneLabel: { fontSize: FONT_SIZES.sm, color: COLORS.text, fontWeight: '600' },
  zoneSub: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  zoneBarWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  zoneBarBg: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  zoneBarFill: { height: '100%', borderRadius: 4 },
  zonePct: { fontSize: FONT_SIZES.sm, fontWeight: 'bold', width: 42, textAlign: 'right' },

  // Aksiyon butonları
  actionButtons: { gap: SPACING.sm, marginBottom: SPACING.xxl },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: SPACING.md, alignItems: 'center' },
  primaryBtnText: { fontSize: FONT_SIZES.md, fontWeight: 'bold', color: COLORS.background },
  secondaryBtn: { backgroundColor: COLORS.surface, borderRadius: 14, padding: SPACING.md, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.primary + '60' },
  secondaryBtnText: { fontSize: FONT_SIZES.md, fontWeight: '600', color: COLORS.primary },
});

export default PlayerDetailScreen;
