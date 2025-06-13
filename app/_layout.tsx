import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider as AppThemeProvider, useTheme } from '@/context/ThemeContext';
import { useInterFont } from '@/hooks/useInterFont';

export default function RootLayout() {
  const [loaded] = useInterFont();

  if (!loaded) {
    return null;
  }

  return (
    <AppThemeProvider>
      <AppThemeContent />
    </AppThemeProvider>
  );
}

function AppThemeContent() {
  const { theme } = useTheme();
  return (
    <ThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
