/**
 * ShotForge - Oyuncu Kartı Bileşeni (PlayerCard)
 * Dashboard'da her oyuncu için gösterilen kart bileşeni.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, POSITIONS } from '../utils/constants';
import { getInitials } from '../utils/helpers';

const PlayerCard = ({ player, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{getInitials(player.name)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={styles.teamName}>{player.team}</Text>
        <View style={styles.metaRow}>
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>{player.position}</Text>
          </View>
          <Text style={styles.jerseyNumber}>#{player.jerseyNumber}</Text>
        </View>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  avatarText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  infoContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  playerName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  teamName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  positionBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  positionText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  jerseyNumber: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 24,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
});

export default PlayerCard;
