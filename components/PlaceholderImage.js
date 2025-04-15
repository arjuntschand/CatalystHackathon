import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default function PlaceholderImage({ style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>🍽️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    fontSize: 48,
  },
}); 