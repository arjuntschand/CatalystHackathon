import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

export default function HomeScreen({ navigation }) {
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);

  useEffect(() => {
    checkQuestionnaire();
  }, []);

  const checkQuestionnaire = async () => {
    try {
      const preferences = await AsyncStorage.getItem('userPreferences');
      setHasCompletedQuestionnaire(!!preferences);
      if (!preferences) {
        navigation.replace('Questionnaire');
      }
    } catch (error) {
      console.error('Error checking questionnaire:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DevilEats</Text>
      <Text style={styles.subtitle}>Track your nutrition journey</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.addButton]}
          onPress={() => navigation.navigate('AddMeal')}
        >
          <Text style={styles.buttonText}>Add Meal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.viewButton]}
          onPress={() => navigation.navigate('ViewMeals')}
        >
          <Text style={styles.buttonText}>View Meals</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.goalsButton]}
          onPress={() => navigation.navigate('Goals')}
        >
          <Text style={styles.buttonText}>Set Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.recommendButton]}
          onPress={() => navigation.navigate('RecommendedMeals')}
        >
          <Text style={styles.buttonText}>Recommended Meals</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#FF3B30',
  },
  viewButton: {
    backgroundColor: '#FF9500',
  },
  goalsButton: {
    backgroundColor: '#5856D6',
  },
  recommendButton: {
    backgroundColor: Colors.accent,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 