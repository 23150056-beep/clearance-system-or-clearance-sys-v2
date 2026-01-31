import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DataProvider } from '../context/DataContext';

export default function RootLayout() {
  return (
    <DataProvider>
      <StatusBar style="light" backgroundColor="#1a1a2e" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
          animation: 'slide_from_right',
        }}
      />
    </DataProvider>
  );
}
