import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { Switch, Text, View } from 'react-native';
import { profileStyles } from './profile.styles';

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[profileStyles.container, { backgroundColor: isDark ? '#151718' : '#f8fafc' }]}> 
      <Text style={[profileStyles.text, { color: isDark ? '#ECEDEE' : '#2563EB', fontFamily: 'Inter_700Bold' }]}>Profile Screen</Text>
      <View style={profileStyles.switchRow}>
        <Text style={[profileStyles.label, { color: isDark ? '#ECEDEE' : '#222', fontFamily: 'Inter_500Medium' }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={isDark ? '#fff' : '#2563EB'}
          trackColor={{ false: '#d1d5db', true: '#2563EB' }}
        />
      </View>
      <Text style={{ color: isDark ? '#ECEDEE' : '#888', marginTop: 8, fontFamily: 'Inter_400Regular' }}>
        {isDark ? 'Dark mode is ON' : 'Dark mode is OFF'}
      </Text>
    </View>
  );
}
