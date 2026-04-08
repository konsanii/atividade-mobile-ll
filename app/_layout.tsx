import { useEffect } from 'react';
import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#0066cc',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eee',
            paddingBottom: 5,
          },
          headerStyle: {
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="cadastro"
          options={{
            title: 'Cadastro',
            tabBarLabel: 'Cadastro',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>➕</Text>,
            headerTitle: 'Cadastrar Usuário',
          }}
        />
        <Tabs.Screen
          name="lista"
          options={{
            title: 'Lista',
            tabBarLabel: 'Usuários',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👥</Text>,
            headerTitle: 'Usuários Cadastrados',
          }}
        />
        <Tabs.Screen
          name="produtos"
          options={{
            title: 'Produtos',
            tabBarLabel: 'Produtos',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🛍️</Text>,
            headerTitle: 'Loja de Produtos',
          }}
        />
        <Tabs.Screen
          name="avaliacoes"
          options={{
            title: 'Avaliações',
            tabBarLabel: 'Avaliações',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⭐</Text>,
            headerTitle: 'Avaliações',
          }}
        />
      </Tabs>
      <StatusBar style="auto" />
    </>
  );
}
