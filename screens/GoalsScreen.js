import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GoalsScreen() {
  const [goals, setGoals] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem('nutritionGoals');
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoals = async () => {
    try {
      await AsyncStorage.setItem('nutritionGoals', JSON.stringify(goals));
      Alert.alert('Success', 'Nutrition goals saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save goals');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.goalCard}>
        <Text style={styles.title}>Set Daily Nutrition Goals</Text>
        
        <Text style={styles.label}>Daily Calories Target</Text>
        <TextInput
          style={styles.input}
          value={goals.calories}
          onChangeText={(text) => setGoals({...goals, calories: text})}
          keyboardType="numeric"
          placeholder="Enter target calories"
        />

        <Text style={styles.label}>Protein Goal (g)</Text>
        <TextInput
          style={styles.input}
          value={goals.protein}
          onChangeText={(text) => setGoals({...goals, protein: text})}
          keyboardType="numeric"
          placeholder="Enter protein goal"
        />

        <Text style={styles.label}>Carbs Goal (g)</Text>
        <TextInput
          style={styles.input}
          value={goals.carbs}
          onChangeText={(text) => setGoals({...goals, carbs: text})}
          keyboardType="numeric"
          placeholder="Enter carbs goal"
        />

        <Text style={styles.label}>Fats Goal (g)</Text>
        <TextInput
          style={styles.input}
          value={goals.fats}
          onChangeText={(text) => setGoals({...goals, fats: text})}
          keyboardType="numeric"
          placeholder="Enter fats goal"
        />

        <TouchableOpacity style={styles.button} onPress={saveGoals}>
          <Text style={styles.buttonText}>Save Goals</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  goalCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FF3B30',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 