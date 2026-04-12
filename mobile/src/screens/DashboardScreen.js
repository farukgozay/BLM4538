import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { playerService } from '../services/playerService';
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants';
import PlayerCard from '../components/PlayerCard';

const DEMO_PLAYERS = [
  {
    id: 1, name: 'LeBron James', team: 'LA Lakers', position: 'SF', jerseyNumber: 23,
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png',
    stats: { pointsPerGame: 27.4, assistsPerGame: 8.3, reboundsPerGame: 7.1, fieldGoalPercentage: 51.2, gamesPlayed: 72 },
  },
  {
    id: 2, name: 'Stephen Curry', team: 'Golden State Warriors', position: 'PG', jerseyNumber: 30,
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png',
    stats: { pointsPerGame: 29.6, assistsPerGame: 6.3, reboundsPerGame: 5.2, fieldGoalPercentage: 48.7, gamesPlayed: 68 },
  },
  {
    id: 3, name: 'Kevin Durant', team: 'Phoenix Suns', position: 'SF', jerseyNumber: 35,
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png',
    stats: { pointsPerGame: 28.3, assistsPerGame: 5.4, reboundsPerGame: 6.7, fieldGoalPercentage: 53.1, gamesPlayed: 60 },
  },
  {
    id: 4, name: 'Giannis Antetokounmpo', team: 'Milwaukee Bucks', position: 'PF', jerseyNumber: 34,
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png',
    stats: { pointsPerGame: 31.1, assistsPerGame: 5.8, reboundsPerGame: 11.8, fieldGoalPercentage: 55.3, gamesPlayed: 70 },
  },
  {
    id: 5, name: 'Luka Doncic', team: 'Dallas Mavericks', position: 'PG', jerseyNumber: 77,
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png',
    stats: { pointsPerGame: 33.9, assistsPerGame: 9.8, reboundsPerGame: 9.2, fieldGoalPercentage: 48.7, gamesPlayed: 66 },
  },
  {
    id: 6, name: 'Joel Embiid', team: 'Philadelphia 76ers', position: 'C', jerseyNumber: 21,
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png',
    stats: { pointsPerGame: 34.7, assistsPerGame: 5.6, reboundsPerGame: 11.0, fieldGoalPercentage: 52.8, gamesPlayed: 39 },
  },
  {
    id: 7, name: 'Nikola Jokic', team: 'Denver Nuggets', position: 'C', jerseyNumber: 15,
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png',
    stats: { pointsPerGame: 26.4, assistsPerGame: 9.0, reboundsPerGame: 12.4, fieldGoalPercentage: 58.3, gamesPlayed: 69 },
  },
  {
    id: 8, name: 'Jayson Tatum', team: 'Boston Celtics', position: 'SF', jerseyNumber: 0,
    photo: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png',
    stats: { pointsPerGame: 26.9, assistsPerGame: 4.9, reboundsPerGame: 8.1, fieldGoalPercentage: 46.6, gamesPlayed: 74 },
  },
];

const DashboardScreen = ({ navigation }) => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logout, user } = useAuth();

  useEffect(() => { fetchPlayers(); }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPlayers(players);
    } else {
      setFilteredPlayers(players.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.team.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    }
  }, [searchQuery, players]);

  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      const data = await playerService.getAllPlayers();
      const enriched = data.map((p, i) => ({
        ...p,
        photo: p.photo || DEMO_PLAYERS[i % DEMO_PLAYERS.length].photo,
        stats: p.stats || DEMO_PLAYERS[i % DEMO_PLAYERS.length].stats,
      }));
      setPlayers(enriched);
      setFilteredPlayers(enriched);
    } catch (error) {
      setPlayers(DEMO_PLAYERS);
      setFilteredPlayers(DEMO_PLAYERS);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlayers();
    setRefreshing(false);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcomeText}>Hoş geldin,</Text>
          <Text style={styles.userName}>{user?.username || 'Oyuncu'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>
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
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Comparison')}>
          <Text style={styles.actionIcon}>⚖️</Text>
          <Text style={styles.actionText}>Karşılaştır</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ShotMap', { playerId: 1, playerName: 'LeBron James' })}>
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionText}>Şut Haritası</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Oyuncular ({filteredPlayers.length})</Text>
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
            onPress={() => navigation.navigate('PlayerDetail', { playerId: item.id, playerName: item.name, playerData: item })}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
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
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { color: COLORS.textSecondary, marginTop: SPACING.md, fontSize: FONT_SIZES.md },
  listContent: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl },
  headerContainer: { paddingTop: SPACING.md, marginBottom: SPACING.md },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  welcomeText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary },
  userName: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  logoutButton: { backgroundColor: COLORS.surface, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  logoutText: { color: COLORS.error, fontWeight: '600', fontSize: FONT_SIZES.sm },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: SPACING.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.md },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: { flex: 1, paddingVertical: SPACING.md, fontSize: FONT_SIZES.md, color: COLORS.text },
  quickActions: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.lg },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface, borderRadius: 12, paddingVertical: SPACING.md, borderWidth: 1, borderColor: COLORS.primary + '30' },
  actionIcon: { fontSize: 18, marginRight: SPACING.sm },
  actionText: { color: COLORS.primary, fontWeight: '600', fontSize: FONT_SIZES.md },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.sm },
  emptyContainer: { alignItems: 'center', paddingVertical: SPACING.xxl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { color: COLORS.textSecondary, fontSize: FONT_SIZES.lg },
});

export default DashboardScreen;
