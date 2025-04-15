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
        generateRecommendations(parsedPrefs);
      } else {
        Alert.alert(
          'No Goals Set',
          'Please set your nutrition goals first to get personalized recommendations.',
          [
            {
              text: 'Set Goals',
              onPress: () => navigation.navigate('Goals')
            },
            {
              text: 'Cancel',
              onPress: () => navigation.goBack(),
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const generateRecommendations = (prefs) => {
    const allMeals = Object.values(MEALS_BY_EATERY).flat();
    let filteredMeals = [...allMeals];

    // Filter based on dietary restrictions
    if (prefs.dietaryRestrictions !== 'None') {
      const restrictions = {
        'Vegetarian': ['Chicken', 'Turkey', 'BBQ', 'Wings', 'Burger', 'Bacon'],
        'Vegan': ['Chicken', 'Turkey', 'BBQ', 'Wings', 'Burger', 'Cheese', 'Mayo', 'Yogurt'],
        'Gluten-Free': ['Bread', 'Pizza', 'Pasta', 'Muffin'],
        'Dairy-Free': ['Cheese', 'Yogurt', 'Mayo', 'Alfredo']
      };

      const restrictedItems = restrictions[prefs.dietaryRestrictions] || [];
      filteredMeals = filteredMeals.filter(meal => 
        !restrictedItems.some(item => 
          meal.name.toLowerCase().includes(item.toLowerCase())
        )
      );
    }

    // Calculate meal scores based on goals
    const scoredMeals = filteredMeals.map(meal => {
      let score = 0;
      let reasons = [];

      const calorieTarget = Number(prefs.calories) / 3; // Assume 3 meals per day
      const proteinTarget = Number(prefs.protein) / 3;
      const carbsTarget = Number(prefs.carbs) / 3;
      const fatsTarget = Number(prefs.fats) / 3;

      // Score based on fitness goal
      switch (prefs.fitnessGoal) {
        case 'Lose Weight':
          if (meal.calories <= calorieTarget) {
            score += 3;
            reasons.push('Fits calorie goal');
          }
          if (meal.protein >= proteinTarget) {
            score += 2;
            reasons.push('High in protein');
          }
          break;

        case 'Gain Muscle':
          if (meal.protein >= proteinTarget) {
            score += 3;
            reasons.push('High in protein');
          }
          if (meal.calories >= calorieTarget) {
            score += 2;
            reasons.push('Calorie-dense');
          }
          if (meal.carbs >= carbsTarget) {
            score += 1;
            reasons.push('Good carb content');
          }
          break;

        case 'Maintain Weight':
          if (Math.abs(meal.calories - calorieTarget) <= 100) {
            score += 3;
            reasons.push('Balanced calories');
          }
          if (Math.abs(meal.protein - proteinTarget) <= 5) {
            score += 2;
            reasons.push('Good protein balance');
          }
          break;

        case 'Improve Health':
          if (meal.name.toLowerCase().includes('salad') || 
              meal.name.toLowerCase().includes('vegetable')) {
            score += 3;
            reasons.push('Nutrient-rich');
          }
          if (meal.fats <= fatsTarget) {
            score += 2;
            reasons.push('Moderate in fats');
          }
          break;
      }

      // Additional scoring based on macro targets
      const proteinRatio = meal.protein / meal.calories;
      if (proteinRatio >= 0.15) {
        score += 1;
        reasons.push('Good protein-to-calorie ratio');
      }

      return {
        ...meal,
        score,
        reasons: reasons.join(', ')
      };
    });

    // Sort by score and take top 5
    const recommendations = scoredMeals
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setRecommendations(recommendations);
  };

  const addToMeals = async (meal) => {
    try {
      const newMeal = {
        id: Date.now(),
        ...meal,
        date: new Date().toISOString(),
      };

      const existingMeals = await AsyncStorage.getItem('meals');
      const meals = existingMeals ? JSON.parse(existingMeals) : [];
      meals.push(newMeal);
      
      await AsyncStorage.setItem('meals', JSON.stringify(meals));
      Alert.alert('Success', 'Meal added to your list!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add meal');
    }
  };

  const renderRecommendation = ({ item }) => (
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
      <Text style={styles.reasonText}>{item.reasons}</Text>
      <View style={styles.nutritionInfo}>
        <Text style={styles.nutritionText}>Calories: {item.calories}</Text>
        <Text style={styles.nutritionText}>Protein: {item.protein}g</Text>
        <Text style={styles.nutritionText}>Carbs: {item.carbs}g</Text>
        <Text style={styles.nutritionText}>Fats: {item.fats}g</Text>
      </View>
      <View style={styles.targetComparison}>
        <Text style={styles.comparisonText}>
          {Math.round((item.calories / (Number(preferences?.calories) / 3)) * 100)}% of calorie target
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended for Your Goals</Text>
      {preferences?.fitnessGoal && (
        <Text style={styles.subtitle}>
          Based on your {preferences.fitnessGoal.toLowerCase()} goal
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
    marginBottom: 10,
  },
  nutritionText: {
    fontSize: 14,
    color: Colors.text,
  },
  targetComparison: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  comparisonText: {
    fontSize: 14,
    color: Colors.secondary,
    textAlign: 'right',
  },
}); 