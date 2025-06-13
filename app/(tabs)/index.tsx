import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { homeStyles } from './home.styles';

const savings = [
  { type: 'add', label: 'Added to Saving', date: '2024-03', id: '2024-023' },
  { type: 'withdraw', label: 'Withdrawn', date: '2024-05', id: '2024-023' },
];
const transactions = [
  { icon: require('@/assets/images/partial-react-logo.png'), label: 'Zomato', date: 'Today • 6:32 PM', amount: '-₹ 420' },
];

const formatDate = (dateStr: string) => {
  // Expects 'YYYY-MM' or 'YYYY-MM-DD'
  const [year, month] = dateStr.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={[homeStyles.container, { backgroundColor: isDark ? '#151718' : '#eaf4ff' }]}> 
      <LinearGradient
        colors={isDark ? ['#232526', '#151718'] : ['#eaf4ff', '#f8fafc']}
        style={homeStyles.gradient}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={homeStyles.headerRow}>
              <Image source={require('@/assets/images/myapplogo.png')} style={homeStyles.logo} />
              <Text style={[homeStyles.appName, { color: isDark ? '#fff' : '#2563EB' }]}>MySaveMate</Text>
              <View style={homeStyles.avatarBox}>
                <Image source={require('@/assets/images/partial-react-logo.png')} style={homeStyles.avatar} />
              </View>
            </View>
            <View style={[homeStyles.savingCard, { backgroundColor: isDark ? '#232526' : '#4d8dfd' }]}> 
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Text style={[homeStyles.savingLabel, { color: isDark ? '#e0e7ef' : '#e0e7ef', marginRight: 4 }]}>Total Saving</Text>
                <Pressable onPress={() => alert('This is your total accumulated savings.')} hitSlop={8}>
                  <MaterialIcons name="info-outline" size={18} color={isDark ? '#e0e7ef' : '#fff'} />
                </Pressable>
              </View>
              <Text style={[homeStyles.savingAmount, { color: isDark ? '#fff' : '#fff' }]}>₹ 2,40,081</Text>
              <Text style={[homeStyles.savingSub, { color: isDark ? '#e0e7ef' : '#e0e7ef' }]}>You can withdraw after 2 months</Text>
              <View style={homeStyles.actionRow}>
                <TouchableOpacity style={[homeStyles.addBtn, { backgroundColor: '#1fa97c' }]} activeOpacity={0.85}>
                  <MaterialIcons name="add-circle" size={22} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={homeStyles.addBtnText}>Add Saving</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[homeStyles.withdrawBtn, { backgroundColor: '#e74c3c' }]} activeOpacity={0.85}>
                  <MaterialIcons name="remove-circle" size={22} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={homeStyles.withdrawBtnText}>Withdraw</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 18 }} />
            <View style={{ height: 1, backgroundColor: isDark ? '#232526' : '#e0e7ef', marginHorizontal: 24, borderRadius: 2, opacity: 0.5 }} />
            <View style={[homeStyles.card, { backgroundColor: isDark ? '#232526' : '#fff', marginTop: 18 }]}> 
              <Text style={[homeStyles.cardTitle, { color: isDark ? '#fff' : '#222' }]}>Saving History</Text>
              {savings.map((item, idx) => (
                <View key={idx} style={homeStyles.historyRow}>
                  <View style={[homeStyles.circle, item.type === 'add' ? homeStyles.plus : homeStyles.minus, { backgroundColor: item.type === 'add' ? '#1fa97c' : '#e74c3c' }]}> 
                    <IconSymbol name={item.type === 'add' ? 'plus.circle.fill' : 'minus.circle.fill'} size={20} color={'#fff'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[homeStyles.historyLabel, { color: isDark ? '#fff' : '#222' }]}>{item.label}</Text>
                    <Text style={[homeStyles.historyDate, { color: isDark ? '#bbb' : '#888' }]}>{formatDate(item.date)}</Text>
                  </View>
                  <Text style={[homeStyles.historyId, { color: isDark ? '#888' : '#bbb' }]}>{item.id}</Text>
                </View>
              ))}
            </View>
            <View style={[homeStyles.card, { backgroundColor: isDark ? '#232526' : '#fff', marginTop: 18 }]}> 
              <Text style={[homeStyles.cardTitle, { color: isDark ? '#fff' : '#222' }]}>Transactions</Text>
              {transactions.map((item, idx) => (
                <View key={idx} style={homeStyles.transRow}>
                  <View style={[homeStyles.transIconBox, { backgroundColor: '#f87171' }]}> 
                    <MaterialIcons name="fastfood" size={20} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[homeStyles.transLabel, { color: isDark ? '#fff' : '#222' }]}>{item.label}</Text>
                    <Text style={[homeStyles.transDate, { color: isDark ? '#bbb' : '#888' }]}>{item.date}</Text>
                  </View>
                  <Text style={[homeStyles.transAmount, { color: item.amount.startsWith('-') ? '#e74c3c' : '#1fa97c' }]}>{item.amount}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
