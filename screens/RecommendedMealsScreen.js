import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import { MEALS_BY_EATERY } from '../constants/MealData';
import { calculateRecommendations } from '../utils/recommendationEngine';

const MEAL_RECOMMENDATIONS = {
  'Lose Weight': [
    { id: 1, name: 'Caesar Salad', eateryId: 1, reason: 'Low calorie, high protein' },
    { id: 2, name: 'Chicken Teriyaki Bowl', eateryId: 4, reason: 'Lean protein, complex carbs' },
    { id: 3, name: 'Miso Soup', eateryId: 4, reason: 'Low calorie, filling' }
  ],
  'Gain Muscle': [
    { id: 1, name: 'Chicken Teriyaki Bowl', eateryId: 4, reason: 'High protein, good carbs' },
    { id: 2, name: 'Turkey Club', eateryId: 1, reason: 'Protein-rich, healthy fats' },
    { id: 3, name: 'BBQ Chicken Pizza', eateryId: 2, reason: 'Protein and carbs for recovery' }
  ],
  'Maintain Weight': [
    { id: 1, name: 'Grilled Chicken Sandwich', eateryId: 1, reason: 'Balanced macros' },
    { id: 2, name: 'Vegetable Stir Fry', eateryId: 4, reason: 'Nutrient-rich, moderate calories' },
    { id: 3, name: 'Yogurt Parfait', eateryId: 3, reason: 'Healthy snack option' }
  ],
  'Improve Health': [
    { id: 1, name: 'Vegetable Stir Fry', eateryId: 4, reason: 'Rich in vegetables and nutrients' },
    { id: 2, name: 'Fruit Bowl', eateryId: 3, reason: 'Vitamins and antioxidants' },
    { id: 3, name: 'Sushi Roll', eateryId: 4, reason: 'Omega-3 fatty acids' }
  ]
};

export default function RecommendedMealsScreen({ navigation }) {
  const [preferences, setPreferences] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await AsyncStorage.getItem('userPreferences');
      if (prefs) {
        const parsedPrefs = JSON.parse(prefs);
        setPreferences(parsedPrefs);
        const recommendedMeals = calculateRecommendations(parsedPrefs, MEALS_BY_EATERY);
        setRecommendations(recommendedMeals);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const getMealDetails = (eateryId, mealName) => {
    const eateryMeals = MEALS_BY_EATERY[eateryId];
    return eateryMeals.find(meal => meal.name === mealName);
  };

  const addToMeals = async (recommendation) => {
    try {
      const mealDetails = getMealDetails(recommendation.eateryId, recommendation.name);
      if (!mealDetails) return;

      const meal = {
        id: Date.now(),
        ...mealDetails,
        date: new Date().toISOString(),
      };

      const existingMeals = await AsyncStorage.getItem('meals');
      const meals = existingMeals ? JSON.parse(existingMeals) : [];
      meals.push(meal);
      
      await AsyncStorage.setItem('meals', JSON.stringify(meals));
      Alert.alert('Success', 'Meal added to your list!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add meal');
    }
  };

  const renderRecommendation = ({ item }) => {
    const mealDetails = getMealDetails(item.eateryId, item.name);
    if (!mealDetails) return null;

    return (
      <View style={styles.recommendationCard}>
        <View style={styles.recommendationHeader}>
          <Text style={styles.mealName}>{item.name}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => addToMeals(item)}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reasonText}>Why? {item.reason}</Text>
        <View style={styles.nutritionInfo}>
          <Text style={styles.nutritionText}>Calories: {mealDetails.calories}</Text>
          <Text style={styles.nutritionText}>Protein: {mealDetails.protein}g</Text>
          <Text style={styles.nutritionText}>Carbs: {mealDetails.carbs}g</Text>
          <Text style={styles.nutritionText}>Fats: {mealDetails.fats}g</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended for Your Goals</Text>
      {preferences && (
        <Text style={styles.subtitle}>
          Based on your {preferences[1]} goal
        </Text>
      )}
      <FlatList
        data={recommendations}
        renderItem={renderRecommendation}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  recommendationCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    flex: 1,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  reasonText: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  nutritionInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  nutritionText: {
    fontSize: 14,
    color: Colors.text,
  },
}); 