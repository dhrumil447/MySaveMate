import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AddMoneyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Money Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
    fontFamily: 'Inter_700Bold',
  },
});
