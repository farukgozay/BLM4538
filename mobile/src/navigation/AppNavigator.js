/**
 * ShotForge - Ana Navigasyon Yapılandırması
 * 
 * Auth durumuna göre kullanıcıyı Auth Stack
 * veya Main Stack'e yönlendirir.
 * 
 * Auth Stack: Login, Register
 * Main Stack: Dashboard, PlayerDetail, ShotMap, Comparison
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/constants';

// Ekranlar
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import PlayerDetailScreen from '../screens/PlayerDetailScreen';
import ShotMapScreen from '../screens/ShotMapScreen';
import ComparisonScreen from '../screens/ComparisonScreen';

const Stack = createNativeStackNavigator();

// Ortak navigasyon stili - koyu tema
const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.background,
  },
  headerTintColor: COLORS.primary,
  headerTitleStyle: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  contentStyle: {
    backgroundColor: COLORS.background,
  },
  animation: 'slide_from_right',
};

/**
 * Auth Stack - Giriş yapmamış kullanıcılar için
 */
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ ...screenOptions, headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

/**
 * Main Stack - Giriş yapmış kullanıcılar için
 */
const MainStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{ title: '🏀 ShotForge', headerLeft: () => null }}
    />
    <Stack.Screen
      name="PlayerDetail"
      component={PlayerDetailScreen}
      options={{ title: 'Oyuncu Detayı' }}
    />
    <Stack.Screen
      name="ShotMap"
      component={ShotMapScreen}
      options={{ title: 'Şut Haritası' }}
    />
    <Stack.Screen
      name="Comparison"
      component={ComparisonScreen}
      options={{ title: 'Karşılaştırma' }}
    />
  </Stack.Navigator>
);

/**
 * AppNavigator - Kök navigasyon bileşeni
 * isAuthenticated durumuna göre stack değiştirir.
 */
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Auth durumu yüklenirken loading göster
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default AppNavigator;
