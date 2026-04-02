import { Text } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
        <Tabs.Screen name="(tabs)" options={{ href: null }} />
        <Tabs.Screen name="modal" options={{ href: null }} />
        <Tabs.Screen name="+not-found" options={{ href: null }} />
        <Tabs.Screen name="index" options={{ href: null }} />
      </Tabs>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
