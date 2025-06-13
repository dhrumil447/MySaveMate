import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

const TAB_ICONS: Record<string, any> = {
  index: 'house.fill',
  addmoney: 'plus.circle.fill',
  history: 'clock.fill',
  profile: 'person.crop.circle.fill',
};

const TABS = [
  { name: 'index', title: 'Home' },
  { name: 'addmoney', title: 'Add Money' },
  { name: 'history', title: 'History' },
  { name: 'profile', title: 'Profile' },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault;
  const activeIconColor = '#4d8dfd';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#4d8dfd',
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
        tabBarIcon: ({ focused }) => (
          <IconSymbol
            size={28}
            name={TAB_ICONS[route.name] || 'house.fill'}
            color={focused ? activeIconColor : iconColor}
          />
        ),
      })}
    >
      {TABS.map(tab => (
        <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title }} />
      ))}
    </Tabs>
  );
}
