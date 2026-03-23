/**
 * ShotForge - Basketball Player Analysis App
 * Ana giriş noktası (Entry Point)
 *
 * Bu dosya uygulamanın kök bileşenidir.
 * AuthProvider ile state yönetimini ve Navigation ile
 * ekranlar arası geçişi sağlar.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AuthProvider>
  );
}
