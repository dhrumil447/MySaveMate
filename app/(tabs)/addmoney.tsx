// @ts-ignore
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import styles from '../styles/addmoney.styles';

const goalTemplates = [
  { name: 'New Vehicle', icon: 'car-outline', color: '#22d3ee' },
  { name: 'New Home', icon: 'home-outline', color: '#fbbf24' },
  { name: 'Holiday Trip', icon: 'airplane-outline', color: '#4ade80' },
  { name: 'Education', icon: 'school-outline', color: '#38bdf8' },
  { name: 'Emergency Fund', icon: 'shield-checkmark-outline', color: '#a78bfa' },
  { name: 'Health Care', icon: 'medkit-outline', color: '#f87171' },
  { name: 'Party', icon: 'wine-outline', color: '#fbbf24' },
  { name: 'Kids Spoiling', icon: 'baby-outline', color: '#f472b6' },
  { name: 'Charity', icon: 'gift-outline', color: '#67e8f9' },
  { name: 'Wedding', icon: 'heart-outline', color: '#ff80ab' },
  { name: 'Gadgets', icon: 'phone-portrait-outline', color: '#60a5fa' },
  { name: 'Investment', icon: 'trending-up-outline', color: '#34d399' },
  { name: 'Travel', icon: 'bus-outline', color: '#facc15' },
  { name: 'Shopping', icon: 'cart-outline', color: '#f472b6' },
  { name: 'Fitness', icon: 'barbell-outline', color: '#818cf8' },
  { name: 'Pet Care', icon: 'paw-outline', color: '#fbbf24' },
  { name: 'Birthday', icon: 'balloon-outline', color: '#38bdf8' },
  { name: 'Other', icon: 'ellipsis-horizontal-circle-outline', color: '#a3a3a3' },
];

export default function SetGoalScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [step, setStep] = useState<'start' | 'form' | 'progress'>('start');
  const [goalName, setGoalName] = useState('');
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentSaving, setCurrentSaving] = useState('0');
  const [addMoney, setAddMoney] = useState('');
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCustomGoalModal, setShowCustomGoalModal] = useState(false);
  const [customGoalName, setCustomGoalName] = useState('');
  const [customGoalIcon, setCustomGoalIcon] = useState('trophy-outline');
  const [customGoalColor, setCustomGoalColor] = useState('#1976d2');
  const [progressAnim] = useState(new Animated.Value(0));

  const colorPalette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#7986CB', '#9575CD', '#64B5F6', '#4DB6AC', '#81C784', '#FFD54F', '#FF8A65', '#A1887F'];

  const progress = amount && Number(amount) > 0 ? Math.min((Number(currentSaving) / Number(amount)), 1) : 0;

  useEffect(() => {
    if (step === 'progress') {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }).start();
    }
  }, [progress, step]);

  const handleCreateGoal = () => {
    if (!goalName || !amount || !months || !selectedIcon) {
      Alert.alert('Missing Info', 'Please fill all fields and select an icon.');
      return;
    }
    setCurrentSaving('0');
    setStep('progress');
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  const handleAddMoney = () => {
    if (!addMoney || isNaN(Number(addMoney)) || Number(addMoney) <= 0) {
      Alert.alert('Invalid', 'Enter a valid amount to add.');
      return;
    }
    setCurrentSaving((prev) => (Number(prev) + Number(addMoney)).toString());
    setAddMoney('');
  };

  const calculateMonthlySaving = () => {
    if (!amount || !months || isNaN(Number(amount)) || isNaN(Number(months))) return '0';
    return (Number(amount) / Number(months)).toFixed(2);
  };

  const calculateTimeLeft = () => {
    if (!targetDate) return '';
    const today = new Date();
    const diffTime = Math.max(targetDate.getTime() - today.getTime(), 0);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Target date reached';
  };

  const handleCreateCustomGoal = () => {
    if (!customGoalName) {
      Alert.alert('Missing Info', 'Please enter a name for your custom goal.');
      return;
    }
    setGoalName(customGoalName);
    setSelectedIcon(customGoalIcon);
    setSelectedColor(customGoalColor);
    setShowCustomGoalModal(false);
    setShowTargetForm(true);
  };

  // Step 1: Start screen
  if (step === 'start') {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#0A0E17' : '#F5F9FF', justifyContent: 'center', alignItems: 'center' }]}>
        <View style={{ alignItems: 'center', padding: 20 }}>
          <Ionicons name="rocket-outline" size={60} color={isDark ? '#4FC3F7' : '#1976d2'} />
          <Text style={[styles.title, { color: isDark ? '#E1F5FE' : '#0D47A1', marginVertical: 20, fontSize: 28 }]}>Start Your Savings Journey</Text>
          <Text style={{ color: isDark ? '#B3E5FC' : '#1976d2', textAlign: 'center', marginBottom: 30 }}>
            Set financial goals and track your progress towards achieving them.
          </Text>
          <TouchableOpacity 
            style={[styles.button, { 
              backgroundColor: isDark ? '#4FC3F7' : '#1976d2',
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              paddingHorizontal: 25,
              borderRadius: 25,
              elevation: 3,
              shadowColor: isDark ? '#000' : '#1976d2',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            }]} 
            onPress={() => setStep('form')}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={[styles.buttonText, { fontSize: 16 }]}>Create New Goal</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Step 2: Goal form
  if (step === 'form') {
    return (
      <KeyboardAvoidingView behavior="padding" style={[styles.container, { backgroundColor: isDark ? '#0A0E17' : '#F5F9FF' }]}>
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={() => setStep('start')}>
              <Ionicons name="arrow-back" size={24} color={isDark ? '#E1F5FE' : '#0D47A1'} />
            </TouchableOpacity>
            <Text style={[styles.title, { 
              color: isDark ? '#E1F5FE' : '#0D47A1', 
              marginLeft: 15, 
              fontSize: 22 
            }]}>
              {showTargetForm ? 'Set Target' : 'Choose Goal'}
            </Text>
          </View>

          {!showTargetForm ? (
            <>
              <Text style={[styles.subTitle, { 
                color: isDark ? '#B3E5FC' : '#1976d2', 
                marginBottom: 20,
                fontSize: 16
              }]}>
                Select from popular goals or create your own
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {goalTemplates.map((t, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{ 
                      width: '30%', 
                      alignItems: 'center', 
                      marginBottom: 20,
                      padding: 10,
                      borderRadius: 15,
                      backgroundColor: isDark ? '#1E293B' : '#E3F2FD',
                      borderWidth: goalName === t.name ? 2 : 0,
                      borderColor: t.color
                    }}
                    onPress={() => { 
                      setGoalName(t.name); 
                      setSelectedIcon(t.icon as any); 
                      setSelectedColor(t.color);
                    }}
                  >
                    <View style={{ 
                      backgroundColor: t.color, 
                      width: 50, 
                      height: 50, 
                      borderRadius: 25, 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: 8 
                    }}>
                      <Ionicons name={t.icon as any} size={24} color="#fff" />
                    </View>
                    <Text style={{ 
                      color: isDark ? '#E1F5FE' : '#0D47A1', 
                      fontSize: 12, 
                      textAlign: 'center', 
                      fontWeight: '500' 
                    }}>
                      {t.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 10,
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: isDark ? '#1E293B' : '#E3F2FD'
                }}
                onPress={() => setShowCustomGoalModal(true)}
              >
                <Ionicons name="add-outline" size={20} color={isDark ? '#4FC3F7' : '#1976d2'} />
                <Text style={{ 
                  color: isDark ? '#4FC3F7' : '#1976d2', 
                  marginLeft: 8,
                  fontWeight: '500'
                }}>
                  Create Custom Goal
                </Text>
              </TouchableOpacity>

              {goalName && (
                <TouchableOpacity 
                  style={[styles.button, { 
                    backgroundColor: selectedColor || '#1976d2',
                    marginTop: 30,
                    paddingVertical: 15,
                    borderRadius: 25,
                    elevation: 3,
                    shadowColor: selectedColor || '#1976d2',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                  }]} 
                  onPress={() => setShowTargetForm(true)}
                >
                  <Text style={[styles.buttonText, { fontSize: 16 }]}>
                    Next: Set Target for {goalName}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                marginBottom: 25,
                padding: 15,
                borderRadius: 15,
                backgroundColor: isDark ? '#1E293B' : '#E3F2FD'
              }}>
                <View style={{ 
                  backgroundColor: selectedColor, 
                  width: 50, 
                  height: 50, 
                  borderRadius: 25, 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginRight: 15 
                }}>
                  <Ionicons name={selectedIcon as any} size={24} color="#fff" />
                </View>
                <Text style={{ 
                  color: isDark ? '#E1F5FE' : '#0D47A1', 
                  fontSize: 18, 
                  fontWeight: '600' 
                }}>
                  {goalName}
                </Text>
              </View>

              <Text style={{ 
                color: isDark ? '#B3E5FC' : '#1976d2', 
                marginBottom: 8, 
                fontWeight: '500',
                fontSize: 14
              }}>
                Target Amount (₹)
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDark ? '#1E293B' : '#fff', 
                  color: isDark ? '#E1F5FE' : '#0D47A1', 
                  borderColor: isDark ? '#334155' : '#90CAF9',
                  fontSize: 16,
                  height: 50
                }]}
                placeholder="e.g. 50000"
                placeholderTextColor={isDark ? '#64748B' : '#90CAF9'}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              <Text style={{ 
                color: isDark ? '#B3E5FC' : '#1976d2', 
                marginBottom: 8, 
                fontWeight: '500',
                fontSize: 14
              }}>
                Duration (months)
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDark ? '#1E293B' : '#fff', 
                  color: isDark ? '#E1F5FE' : '#0D47A1', 
                  borderColor: isDark ? '#334155' : '#90CAF9',
                  fontSize: 16,
                  height: 50
                }]}
                placeholder="e.g. 12"
                placeholderTextColor={isDark ? '#64748B' : '#90CAF9'}
                keyboardType="numeric"
                value={months}
                onChangeText={setMonths}
              />

              <Text style={{ 
                color: isDark ? '#B3E5FC' : '#1976d2', 
                marginBottom: 8, 
                fontWeight: '500',
                fontSize: 14
              }}>
                Target Date
              </Text>
              <TouchableOpacity 
                onPress={() => setShowDatePicker(true)} 
                style={[styles.input, { 
                  backgroundColor: isDark ? '#1E293B' : '#fff', 
                  borderColor: isDark ? '#334155' : '#90CAF9',
                  height: 50,
                  justifyContent: 'center'
                }]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="calendar-outline" size={20} color={isDark ? '#4FC3F7' : '#1976d2'} style={{ marginRight: 10 }} />
                  <Text style={{ 
                    color: isDark ? '#E1F5FE' : '#0D47A1',
                    fontSize: 16
                  }}>
                    {targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Text>
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={targetDate}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setTargetDate(date);
                  }}
                  minimumDate={new Date()}
                />
              )}

              {amount && months && (() => {
                const monthlySaving = calculateMonthlySaving();
                return (
                  <View style={{ 
                    marginTop: 20,
                    padding: 15,
                    borderRadius: 15,
                    backgroundColor: isDark ? '#1E293B' : '#E3F2FD'
                  }}>
                    <Text style={{ 
                      color: isDark ? '#B3E5FC' : '#1976d2', 
                      fontWeight: '500',
                      marginBottom: 5
                    }}>
                      Monthly Saving Plan
                    </Text>
                    <Text style={{ 
                      color: isDark ? '#E1F5FE' : '#0D47A1', 
                      fontSize: 18,
                      fontWeight: '600'
                    }}>
                      ₹{monthlySaving}/month
                    </Text>
                  </View>
                );
              })()}

              <TouchableOpacity 
                style={[styles.button, { 
                  backgroundColor: selectedColor || '#1976d2',
                  marginTop: 30,
                  paddingVertical: 15,
                  borderRadius: 25,
                  elevation: 3,
                  shadowColor: selectedColor || '#1976d2',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                }]} 
                onPress={handleCreateGoal}
              >
                <Text style={[styles.buttonText, { fontSize: 16 }]}>
                  Create Goal
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {/* Custom Goal Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCustomGoalModal}
          onRequestClose={() => setShowCustomGoalModal(false)}
        >
          <View style={[styles.container, { 
            backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)', 
            justifyContent: 'center', 
            padding: 20 
          }]}>
            <View style={{ 
              backgroundColor: isDark ? '#1E293B' : '#fff', 
              borderRadius: 15, 
              padding: 20,
              elevation: 5
            }}>
              <Text style={{ 
                color: isDark ? '#E1F5FE' : '#0D47A1', 
                fontSize: 20, 
                fontWeight: '600',
                marginBottom: 20
              }}>
                Create Custom Goal
              </Text>

              <Text style={{ 
                color: isDark ? '#B3E5FC' : '#1976d2', 
                marginBottom: 8, 
                fontWeight: '500'
              }}>
                Goal Name
              </Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: isDark ? '#334155' : '#E3F2FD', 
                  color: isDark ? '#E1F5FE' : '#0D47A1', 
                  borderColor: isDark ? '#475569' : '#90CAF9',
                  marginBottom: 20
                }]}
                placeholder="e.g. Buy a guitar"
                placeholderTextColor={isDark ? '#64748B' : '#90CAF9'}
                value={customGoalName}
                onChangeText={setCustomGoalName}
              />

              <Text style={{ 
                color: isDark ? '#B3E5FC' : '#1976d2', 
                marginBottom: 8, 
                fontWeight: '500'
              }}>
                Select Icon
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                {['car-outline', 'home-outline', 'airplane-outline', 'school-outline', 'heart-outline', 'trophy-outline', 'gift-outline', 'paw-outline'].map((icon, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: 25, 
                      backgroundColor: customGoalIcon === icon ? customGoalColor : (isDark ? '#334155' : '#E3F2FD'),
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: 5
                    }}
                    onPress={() => setCustomGoalIcon(icon)}
                  >
                    <Ionicons name={icon as any} size={24} color={customGoalIcon === icon ? '#fff' : (isDark ? '#E1F5FE' : '#0D47A1')} />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ 
                color: isDark ? '#B3E5FC' : '#1976d2', 
                marginBottom: 8, 
                fontWeight: '500'
              }}>
                Select Color
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
                {colorPalette.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 20, 
                      backgroundColor: color,
                      margin: 5,
                      borderWidth: customGoalColor === color ? 3 : 0,
                      borderColor: '#fff'
                    }}
                    onPress={() => setCustomGoalColor(color)}
                  />
                ))}
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity 
                  style={{ 
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: isDark ? '#334155' : '#E3F2FD',
                    flex: 1,
                    marginRight: 10,
                    alignItems: 'center'
                  }}
                  onPress={() => setShowCustomGoalModal(false)}
                >
                  <Text style={{ color: isDark ? '#E1F5FE' : '#0D47A1', fontWeight: '500' }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{ 
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: customGoalColor,
                    flex: 1,
                    marginLeft: 10,
                    alignItems: 'center'
                  }}
                  onPress={handleCreateCustomGoal}
                >
                  <Text style={{ color: '#fff', fontWeight: '500' }}>
                    Create
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: 'rgba(0,0,0,0.5)' 
          }}>
            <View style={{ 
              backgroundColor: isDark ? '#1E293B' : '#fff', 
              padding: 30, 
              borderRadius: 15,
              alignItems: 'center',
              elevation: 5
            }}>
              <Ionicons name="checkmark-circle" size={60} color="#4ADE80" />
              <Text style={{ 
                color: isDark ? '#E1F5FE' : '#0D47A1', 
                fontSize: 20, 
                fontWeight: '600',
                marginTop: 15
              }}>
                Goal Created!
              </Text>
              <Text style={{ 
                color: isDark ? '#B3E5FC' : '#1976d2', 
                marginTop: 10,
                textAlign: 'center'
              }}>
                Your "{goalName}" goal has been successfully created.
              </Text>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }

  // Step 3: Progress screen
  // Calculate monthly saving for progress screen
  const monthlySaving = calculateMonthlySaving();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0A0E17' : '#F5F9FF' }]}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => setStep('form')}>
            <Ionicons name="arrow-back" size={24} color={isDark ? '#E1F5FE' : '#0D47A1'} />
          </TouchableOpacity>
          <Text style={[styles.title, { 
            color: isDark ? '#E1F5FE' : '#0D47A1', 
            marginLeft: 15, 
            fontSize: 22 
          }]}>
            Goal Progress
          </Text>
        </View>

        <View style={{ 
          alignItems: 'center', 
          marginBottom: 30,
          padding: 20,
          borderRadius: 15,
          backgroundColor: isDark ? '#1E293B' : '#E3F2FD'
        }}>
          <View style={{ 
            backgroundColor: selectedColor, 
            width: 80, 
            height: 80, 
            borderRadius: 40, 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: 15 
          }}>
            <Ionicons name={selectedIcon as any} size={36} color="#fff" />
          </View>
          <Text style={{ 
            color: isDark ? '#E1F5FE' : '#0D47A1', 
            fontSize: 22, 
            fontWeight: '600',
            marginBottom: 5,
            textAlign: 'center'
          }}>
            {goalName}
          </Text>
          <Text style={{ 
            color: isDark ? '#B3E5FC' : '#1976d2', 
            fontSize: 14,
            textAlign: 'center'
          }}>
            Target: ₹{amount} | {calculateTimeLeft()}
          </Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ 
              color: isDark ? '#B3E5FC' : '#1976d2', 
              fontWeight: '500'
            }}>
              Progress
            </Text>
            <Text style={{ 
              color: isDark ? '#E1F5FE' : '#0D47A1', 
              fontWeight: '600'
            }}>
              {Math.round(progress * 100)}% Complete
            </Text>
          </View>
          <View style={{ 
            height: 12, 
            backgroundColor: isDark ? '#334155' : '#E3F2FD', 
            borderRadius: 6, 
            overflow: 'hidden',
            marginBottom: 5
          }}>
            <Animated.View style={{ 
              height: '100%', 
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }), 
              backgroundColor: selectedColor,
              borderRadius: 6
            }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ 
              color: isDark ? '#B3E5FC' : '#1976d2', 
              fontSize: 12
            }}>
              ₹{currentSaving} saved
            </Text>
            <Text style={{ 
              color: isDark ? '#B3E5FC' : '#1976d2', 
              fontSize: 12
            }}>
              ₹{amount} target
            </Text>
          </View>
        </View>

        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          marginBottom: 30
        }}>
          <View style={{ 
            flex: 1, 
            padding: 15,
            borderRadius: 15,
            backgroundColor: isDark ? '#1E293B' : '#E3F2FD',
            marginRight: 10
          }}>
            <Text style={{ 
              color: isDark ? '#B3E5FC' : '#1976d2', 
              fontSize: 12,
              marginBottom: 5
            }}>
              Monthly Saving
            </Text>
            <Text style={{ 
              color: isDark ? '#E1F5FE' : '#0D47A1', 
              fontSize: 18,
              fontWeight: '600'
            }}>
              ₹{monthlySaving}
            </Text>
          </View>
          <View style={{ 
            flex: 1, 
            padding: 15,
            borderRadius: 15,
            backgroundColor: isDark ? '#1E293B' : '#E3F2FD',
            marginLeft: 10
          }}>
            <Text style={{ 
              color: isDark ? '#B3E5FC' : '#1976d2', 
              fontSize: 12,
              marginBottom: 5
            }}>
              Amount Left
            </Text>
            <Text style={{ 
              color: isDark ? '#E1F5FE' : '#0D47A1', 
              fontSize: 18,
              fontWeight: '600'
            }}>
              ₹{(Number(amount) - Number(currentSaving)).toFixed(2)}
            </Text>
          </View>
        </View>

        <Text style={{ 
          color: isDark ? '#E1F5FE' : '#0D47A1', 
          fontSize: 18,
          fontWeight: '600',
          marginBottom: 15
        }}>
          Add Money to Goal
        </Text>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center',
          marginBottom: 30
        }}>
          <TextInput
            style={[styles.input, { 
              flex: 1,
              backgroundColor: isDark ? '#1E293B' : '#fff', 
              color: isDark ? '#E1F5FE' : '#0D47A1', 
              borderColor: isDark ? '#334155' : '#90CAF9',
              height: 50,
              fontSize: 16
            }]}
            placeholder="Enter amount"
            placeholderTextColor={isDark ? '#64748B' : '#90CAF9'}
            keyboardType="numeric"
            value={addMoney}
            onChangeText={setAddMoney}
          />
          <TouchableOpacity 
            style={{ 
              height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: selectedColor,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 10,
              elevation: 3,
              shadowColor: selectedColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            }} 
            onPress={handleAddMoney}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={{ 
            padding: 15,
            borderRadius: 10,
            backgroundColor: isDark ? '#1E293B' : '#E3F2FD',
            alignItems: 'center',
            marginBottom: 20
          }}
        >
          <Text style={{ 
            color: isDark ? '#E1F5FE' : '#0D47A1', 
            fontWeight: '500'
          }}>
            View Transaction History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{ 
            padding: 15,
            borderRadius: 10,
            backgroundColor: isDark ? '#1E293B' : '#E3F2FD',
            alignItems: 'center'
          }}
        >
          <Text style={{ 
            color: isDark ? '#E1F5FE' : '#0D47A1', 
            fontWeight: '500'
          }}>
            Set Monthly Reminder
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}