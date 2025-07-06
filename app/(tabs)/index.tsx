import { useTheme } from '@/context/ThemeContext';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useHomeStyles } from '../styles/home.styles';

// Types
type Transaction = {
  id: string;
  icon: string;
  label: string;
  date: string;
  amount: number;
  category: string;
};

type SavingGoal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
};


// Common functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount).replace('₹', '₹ ');
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const screenWidth = Dimensions.get('window').width;

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Food': '#F87171',
    'Transport': '#60A5FA',
    'Education': '#A78BFA',
    'Entertainment': '#FBBF24',
    'Income': '#34D399',
    'Other': '#9CA3AF'
  };
  return colors[category] || '#9CA3AF';
};

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const homeStyles = useHomeStyles();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [dailyTip] = useState(
    "Don't save what is left after spending, spend what is left after saving."
  );

  // Sample data
  const [savings] = useState<SavingGoal[]>([
    { id: '1', name: 'Emergency Fund', target: 100000, current: 45000, deadline: '2024-12' },
    { id: '2', name: 'New Laptop', target: 60000, current: 18000, deadline: '2024-08' },
  ]);

  const [transactions] = useState<Transaction[]>([
    { id: '1', icon: 'shopping-bag', label: 'Zomato', date: 'Today • 6:32 PM', amount: -420, category: 'Food' },
    { id: '2', icon: 'book', label: 'Textbooks', date: 'Yesterday • 2:15 PM', amount: -1200, category: 'Education' },
    { id: '3', icon: 'money-bill-wave', label: 'Freelance', date: 'May 12 • 10:45 AM', amount: 8000, category: 'Income' },
  ]);

  const [budgets] = useState([
    { category: 'Food', amount: 3000, spent: 1200 },
    { category: 'Transport', amount: 2000, spent: 800 },
    { category: 'Entertainment', amount: 1500, spent: 600 },
  ]);

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'income') return t.amount > 0;
    if (filter === 'expense') return t.amount < 0;
    return true;
  }).slice(0, 5);

  // Calculate totals
  const totalSavings = savings.reduce((sum, goal) => sum + goal.current, 0);
  const monthlyIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = monthlyIncome - monthlyExpenses;

  // Chart data
  const categoryData = transactions
    .filter(t => t.amount < 0)
    .reduce((acc, t) => {
      const category = t.category;
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const pieChartData = Object.keys(categoryData).map((category) => ({
    name: category,
    amount: categoryData[category],
    color: getCategoryColor(category),
    legendFontColor: isDark ? '#fff' : '#000',
    legendFontSize: 12
  }));

  useEffect(() => {
    Animated.timing(fadeAnim, { 
      toValue: 1, 
      duration: 600, 
      useNativeDriver: true 
    }).start();
  }, [fadeAnim]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={[homeStyles.container, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
      {/* Floating Add Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          backgroundColor: '#2563EB',
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          elevation: 4,
        }}
        onPress={() => setShowAddMenu(true)}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Menu Modal */}
      <Modal
        visible={showAddMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddMenu(false)}
      >
        <Pressable 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setShowAddMenu(false)}
        >
          <View style={{
            position: 'absolute',
            right: 20,
            bottom: 90,
            backgroundColor: isDark ? '#252525' : '#fff',
            borderRadius: 12,
            padding: 16,
            width: 200,
            elevation: 4,
          }}>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
              onPress={() => {
                setShowAddMenu(false);
                navigation.navigate('AddIncome');
              }}
            >
              <MaterialIcons name="add-circle" size={24} color="#10B981" />
              <Text style={{ marginLeft: 12, color: isDark ? '#fff' : '#000' }}>Add Income</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
              onPress={() => {
                setShowAddMenu(false);
                navigation.navigate('AddExpense');
              }}
            >
              <MaterialIcons name="remove-circle" size={24} color="#EF4444" />
              <Text style={{ marginLeft: 12, color: isDark ? '#fff' : '#000' }}>Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}
              onPress={() => {
                setShowAddMenu(false);
                navigation.navigate('CreateGoal');
              }}
            >
              <FontAwesome5 name="piggy-bank" size={20} color="#3B82F6" />
              <Text style={{ marginLeft: 12, color: isDark ? '#fff' : '#000' }}>Create Goal</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#fff' : '#2563EB'}
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={[homeStyles.header, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
            <View>
              <Text style={[homeStyles.greeting, { color: isDark ? '#fff' : '#111827' }]}>
                {getGreeting()}, Dhrumil 👋
              </Text>
              <Text style={[homeStyles.date, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
            </View>
           
          </View>

          {/* Daily Tip */}
          <View style={{
            backgroundColor: isDark ? '#252525' : '#EFF6FF',
            margin: 16,
            padding: 16,
            borderRadius: 12,
          }}>
            <Text style={{ 
              fontSize: 14,
              fontStyle: 'italic',
              color: isDark ? '#D1D5DB' : '#4B5563',
              textAlign: 'center',
            }}>
              "{dailyTip}" — Warren Buffett
            </Text>
          </View>

          {/* Balance Card */}
          <View style={[homeStyles.card, { backgroundColor: isDark ? '#252525' : '#FFFFFF' }]}>
            <View style={homeStyles.balanceContainer}>
                <View style={homeStyles.balanceItem}>
                <Text style={[
                  homeStyles.balanceLabel,
                  { color: isDark ? '#D1D5DB' : '#6B7280' }
                ]}>
                  Available Balance
                </Text>
                <Text style={[
                  homeStyles.balanceAmount,
                  { color: isDark ? '#fff' : '#111827' }
                ]}>
                  {formatCurrency(balance)}
                </Text>
                </View>
                <View style={[homeStyles.balanceItem, { alignItems: 'flex-end' }]}>
                <Text style={[
                  homeStyles.balanceLabel,
                  { color: isDark ? '#D1D5DB' : '#6B7280' }
                ]}>
                  Total Savings
                </Text>
                <Text style={[
                  homeStyles.balanceAmount,
                  { color: isDark ? '#fff' : '#111827' }
                ]}>
                  {formatCurrency(totalSavings)}
                </Text>
                </View>
            </View>

            <View style={homeStyles.progressBar}>
              <View style={[homeStyles.progressFill, { 
                width: `${(monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0)}%`,
                backgroundColor: monthlyExpenses/monthlyIncome > 0.8 ? '#EF4444' : '#10B981'
              }]} />
            </View>

            {monthlyExpenses/monthlyIncome > 0.8 && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? '#7F1D1D' : '#FEE2E2',
                padding: 8,
                borderRadius: 8,
                marginBottom: 12,
              }}>
                <MaterialIcons name="warning" size={18} color="#EF4444" />
                <Text style={{
                  color: '#EF4444',
                  marginLeft: 8,
                  fontSize: 12,
                }}>
                  You've spent {Math.round((monthlyExpenses/monthlyIncome)*100)}% of your income this month
                </Text>
              </View>
            )}

            <View style={homeStyles.balanceContainer}>
              <View style={homeStyles.balanceItem}>
                <Text style={homeStyles.balanceLabel}>Income</Text>
                <Text style={[homeStyles.balanceAmount, { color: '#10B981' }]}>
                  +{formatCurrency(monthlyIncome)}
                </Text>
              </View>
              <View style={[homeStyles.balanceItem, { alignItems: 'flex-end' }]}>
                <Text style={homeStyles.balanceLabel}>Expenses</Text>
                <Text style={[homeStyles.balanceAmount, { color: '#EF4444' }]}>
                  -{formatCurrency(monthlyExpenses)}
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={homeStyles.quickActions}>
              <TouchableOpacity 
                style={[homeStyles.actionButton, { backgroundColor: '#2563EB' }]}
                onPress={() => navigation.navigate('AddIncome')}
              >
                <MaterialIcons name="add" size={24} color="#FFFFFF" />
                <Text style={[homeStyles.actionText, { color: '#FFFFFF' }]}>Income</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[homeStyles.actionButton, { backgroundColor: '#DC2626' }]}
                onPress={() => navigation.navigate('AddExpense')}
              >
                <MaterialIcons name="remove" size={24} color="#FFFFFF" />
                <Text style={[homeStyles.actionText, { color: '#FFFFFF' }]}>Expense</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[homeStyles.actionButton, { backgroundColor: '#059669' }]}
                onPress={() => navigation.navigate('CreateGoal')}
              >
                <FontAwesome5 name="piggy-bank" size={20} color="#FFFFFF" />
                <Text style={[homeStyles.actionText, { color: '#FFFFFF' }]}>Goal</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Control */}
          <SegmentedControl
            values={['Savings', 'Expenses']}
            selectedIndex={activeTab}
            onChange={(event) => {
              setActiveTab(event.nativeEvent.selectedSegmentIndex);
            }}
            appearance={isDark ? 'dark' : 'light'}
            style={{ marginHorizontal: 16, marginBottom: 16 }}
          />

          {activeTab === 0 ? (
            <>
              {/* Savings Goals */}
              <View style={[homeStyles.card, { backgroundColor: isDark ? '#252525' : '#FFFFFF' }]}>
                <View style={homeStyles.sectionHeader}>
                  <Text style={homeStyles.sectionTitle}>Savings Goals</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
                    <Text style={homeStyles.viewAll}>View All</Text>
                  </TouchableOpacity>
                </View>

                {savings.length > 0 ? (
                  savings.map((goal) => (
                    <View key={goal.id} style={{ marginBottom: 16 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ color: isDark ? '#FFFFFF' : '#111827', fontWeight: '500' }}>{goal.name}</Text>
                        <Text style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                          {formatCurrency(goal.current)} of {formatCurrency(goal.target)}
                        </Text>
                      </View>
                      <View style={homeStyles.progressBar}>
                        <View style={[homeStyles.progressFill, { 
                          width: `${(goal.current / goal.target) * 100}%`,
                          backgroundColor: goal.current/goal.target > 0.8 ? '#10B981' : '#3B82F6'
                        }]} />
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ 
                          color: isDark ? '#D1D5DB' : '#6B7280',
                          fontSize: 12,
                        }}>
                          {Math.round((goal.current / goal.target) * 100)}% completed
                        </Text>
                        {goal.current/goal.target > 0.8 && (
                          <Text style={{ color: '#10B981', fontSize: 12 }}>
                            Almost there! 🎉
                          </Text>
                        )}
                      </View>
                    </View>
                  ))
                ) : (
                  <TouchableOpacity 
                    style={{ alignItems: 'center', padding: 16 }}
                    onPress={() => navigation.navigate('CreateGoal')}
                  >
                    <MaterialIcons name="savings" size={32} color="#6B7280" />
                    <Text style={{ color: '#6B7280', marginTop: 8 }}>
                      No savings goals yet
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <>
              {/* Budgets */}
              <View style={[homeStyles.card, { backgroundColor: isDark ? '#252525' : '#FFFFFF' }]}>
                <View style={homeStyles.sectionHeader}>
                  <Text style={homeStyles.sectionTitle}>Your Budgets</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Budgets')}>
                    <Text style={homeStyles.viewAll}>View All</Text>
                  </TouchableOpacity>
                </View>

                {budgets.map((budget, index) => (
                  <View key={index} style={{ marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={{ color: isDark ? '#FFFFFF' : '#111827', fontWeight: '500' }}>
                        {budget.category}
                      </Text>
                      <Text style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
                      </Text>
                    </View>
                    <View style={homeStyles.progressBar}>
                      <View style={[homeStyles.progressFill, { 
                        width: `${(budget.spent / budget.amount) * 100}%`,
                        backgroundColor: budget.spent/budget.amount > 0.8 ? '#EF4444' : '#3B82F6'
                      }]} />
                    </View>
                    <Text style={{ 
                      color: budget.spent/budget.amount > 0.8 ? '#EF4444' : (isDark ? '#D1D5DB' : '#6B7280'),
                      fontSize: 12,
                      alignSelf: 'flex-end',
                    }}>
                      {formatCurrency(budget.amount - budget.spent)} left
                    </Text>
                  </View>
                ))}
              </View>

              {/* Spending Analysis */}
              <View style={[homeStyles.card, { backgroundColor: isDark ? '#252525' : '#FFFFFF' }]}>
                <View style={homeStyles.sectionHeader}>
                  <Text style={homeStyles.sectionTitle}>Spending Analysis</Text>
                </View>
                <PieChart
                  data={pieChartData}
                  width={screenWidth - 64}
                  height={200}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  }}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                  style={{ alignSelf: 'center' }}
                />
              </View>
            </>
          )}

          {/* Recent Transactions */}
          <View style={[homeStyles.card, { backgroundColor: isDark ? '#252525' : '#FFFFFF' }]}>
            <View style={[homeStyles.sectionHeader, { marginBottom: 8 }]}>
              <Text style={homeStyles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => setShowFilter(!showFilter)}>
                <Ionicons name="filter" size={20} color={isDark ? '#3B82F6' : '#2563EB'} />
              </TouchableOpacity>
            </View>

            {/* Filter Dropdown */}
            {showFilter && (
              <View style={{ 
                backgroundColor: isDark ? '#333' : '#F3F4F6',
                borderRadius: 8,
                padding: 8,
                marginBottom: 12,
              }}>
                <Text style={{ 
                  color: isDark ? '#D1D5DB' : '#6B7280',
                  marginBottom: 4,
                }}>
                  Filter by:
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{
                      padding: 8,
                      backgroundColor: filter === 'all' ? (isDark ? '#3B82F6' : '#2563EB') : 'transparent',
                      borderRadius: 8,
                      marginRight: 8,
                    }}
                    onPress={() => setFilter('all')}
                  >
                    <Text style={{ 
                      color: filter === 'all' ? '#fff' : (isDark ? '#D1D5DB' : '#6B7280'),
                    }}>
                      All
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      padding: 8,
                      backgroundColor: filter === 'income' ? (isDark ? '#3B82F6' : '#2563EB') : 'transparent',
                      borderRadius: 8,
                      marginRight: 8,
                    }}
                    onPress={() => setFilter('income')}
                  >
                    <Text style={{ 
                      color: filter === 'income' ? '#fff' : (isDark ? '#D1D5DB' : '#6B7280'),
                    }}>
                      Income
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      padding: 8,
                      backgroundColor: filter === 'expense' ? (isDark ? '#3B82F6' : '#2563EB') : 'transparent',
                      borderRadius: 8,
                    }}
                    onPress={() => setFilter('expense')}
                  >
                    <Text style={{ 
                      color: filter === 'expense' ? '#fff' : (isDark ? '#D1D5DB' : '#6B7280'),
                    }}>
                      Expense
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <View key={transaction.id} style={homeStyles.transactionItem}>
                  <View style={homeStyles.transactionIcon}>
                    {/* Use a fallback icon if transaction.icon is not a valid MaterialIcon */}
                    <MaterialIcons
                      name={
                        ['shopping-bag', 'book', 'money-bill-wave'].includes(transaction.icon)
                          ? (transaction.icon === 'shopping-bag' ? 'shopping-bag' :
                             transaction.icon === 'book' ? 'menu-book' :
                             transaction.icon === 'money-bill-wave' ? 'attach-money'
                             : 'category')
                          : 'category'
                      }
                      size={24}
                      color={getCategoryColor(transaction.category)}
                    />
                  </View>
                  <View style={homeStyles.transactionDetails}>
                    <Text style={[homeStyles.transactionLabel, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                      {transaction.label}
                    </Text>
                    <Text style={[homeStyles.transactionDate, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                      {transaction.date}
                    </Text>
                  </View>
                  <Text style={[
                    homeStyles.transactionAmount,
                    {
                      color: transaction.amount > 0 ? '#10B981' : '#EF4444',
                      fontWeight: 'bold'
                    }
                  ]}>
                    {formatCurrency(transaction.amount)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ 
                textAlign: 'center', 
                color: isDark ? '#9CA3AF' : '#6B7280', 
                padding: 16 
              }}>
                No transactions found
              </Text>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}