/**
 * ShotForge - Dashboard Ekranı
 * 
 * Ana ekran - Oyuncu listesi ve arama.
 * Kullanıcı buradan oyuncu detaylarına,
 * karşılaştırma ekranına geçiş yapabilir.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { playerService } from '../services/playerService';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';
import { getInitials } from '../utils/helpers';
import PlayerCard from '../components/PlayerCard';

const DashboardScreen = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logout, user } = useAuth();

  // Başlangıçta oyuncuları yükle
  useEffect(() => {
    fetchPlayers();
  }, []);

  // Arama filtresi
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPlayers(players);
    } else {
      const filtered = players.filter(
        (player) =>
          player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.team.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlayers(filtered);
    }
  }, [searchQuery, players]);

  /**
   * API'den oyuncu listesini getir
   */
  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      const data = await playerService.getAllPlayers();
      setPlayers(data);
      setFilteredPlayers(data);
    } catch (error) {
      console.error('Oyuncular yüklenemedi:', error);
      // Demo verileri göster (API bağlantısı yokken)
      const demoPlayers = [
        { id: 1, name: 'LeBron James', team: 'LA Lakers', position: 'SF', jerseyNumber: 23 },
        { id: 2, name: 'Stephen Curry', team: 'Golden State Warriors', position: 'PG', jerseyNumber: 30 },
        { id: 3, name: 'Kevin Durant', team: 'Phoenix Suns', position: 'SF', jerseyNumber: 35 },
        { id: 4, name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', position: 'PF', jerseyNumber: 34 },
        { id: 5, name: 'Luka Doncic', team: 'Dallas Mavericks', position: 'PG', jerseyNumber: 77 },
      ];
      setPlayers(demoPlayers);
      setFilteredPlayers(demoPlayers);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Pull-to-refresh
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlayers();
    setRefreshing(false);
  };

  /**
   * Liste başlığı - Arama ve kullanıcı bilgisi
   */
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Kullanıcı bilgisi ve çıkış */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcomeText}>Hoş geldin,</Text>
          <Text style={styles.userName}>{user?.username || 'Oyuncu'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      {/* Arama Kutusu */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Oyuncu veya takım ara..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Hızlı Aksiyonlar */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Comparison')}
        >
          <Text style={styles.actionIcon}>⚖️</Text>
          <Text style={styles.actionText}>Karşılaştır</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ShotMap', { playerId: 1 })}
        >
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionText}>Şut Haritası</Text>
        </TouchableOpacity>
      </View>

      {/* Oyuncu Sayısı */}
      <Text style={styles.sectionTitle}>
        Oyuncular ({filteredPlayers.length})
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Oyuncular yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PlayerCard
            player={item}
            onPress={() => navigation.navigate('PlayerDetail', { playerId: item.id, playerName: item.name })}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏀</Text>
            <Text style={styles.emptyText}>Oyuncu bulunamadı</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  headerContainer: {
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  logoutButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoutText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  actionIcon: {
    fontSize: 18,
    marginRight: SPACING.sm,
  },
  actionText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONT_SIZES.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.lg,
  },
});

export default DashboardScreen;
