import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  RefreshControl,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

export default function ViewMealsScreen() {
  const [meals, setMeals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });
  const [targets, setTargets] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadMeals(), loadTargets()]);
  };

  const loadTargets = async () => {
    try {
      const prefs = await AsyncStorage.getItem('userPreferences');
      if (prefs) {
        const parsedPrefs = JSON.parse(prefs);
        setTargets({
          calories: Number(parsedPrefs.calories) || 0,
          protein: Number(parsedPrefs.protein) || 0,
          carbs: Number(parsedPrefs.carbs) || 0,
          fats: Number(parsedPrefs.fats) || 0
        });
      }
    } catch (error) {
      console.error('Error loading targets:', error);
    }
  };

  const calculateDailyTotals = (mealsData) => {
    const today = new Date().toDateString();
    const todayMeals = mealsData.filter(meal => 
      new Date(meal.date).toDateString() === today
    );

    const totals = todayMeals.reduce((acc, meal) => ({
      calories: acc.calories + (Number(meal.calories) || 0),
      protein: acc.protein + (Number(meal.protein) || 0),
      carbs: acc.carbs + (Number(meal.carbs) || 0),
      fats: acc.fats + (Number(meal.fats) || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    setDailyTotals(totals);
  };

  const loadMeals = async () => {
    try {
      const storedMeals = await AsyncStorage.getItem('meals');
      if (storedMeals) {
        const mealsData = JSON.parse(storedMeals);
        setMeals(mealsData.reverse());
        calculateDailyTotals(mealsData);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    }
  };

  const deleteMeal = async (id) => {
    try {
      const updatedMeals = meals.filter(meal => meal.id !== id);
      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
      setMeals(updatedMeals);
      calculateDailyTotals(updatedMeals);
      Alert.alert('Success', 'Meal deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete meal');
    }
  };

  const calculateProgress = (current, target) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const renderProgressBar = (label, current, target) => {
    const progress = calculateProgress(current, target);
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelContainer}>
          <Text style={styles.progressLabel}>
            {label}: {current} / {target || '?'}
          </Text>
          <Text style={styles.progressPercent}>
            {target ? `${Math.round(progress)}%` : 'No target set'}
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${progress}%` },
              progress > 100 && styles.progressBarExceeded
            ]} 
          />
        </View>
      </View>
    );
  };

  const renderDailyProgress = () => (
    <View style={styles.progressCard}>
      <Text style={styles.progressTitle}>Today's Progress</Text>
      {renderProgressBar('Calories', dailyTotals.calories, targets.calories)}
      {renderProgressBar('Protein (g)', dailyTotals.protein, targets.protein)}
      {renderProgressBar('Carbs (g)', dailyTotals.carbs, targets.carbs)}
      {renderProgressBar('Fats (g)', dailyTotals.fats, targets.fats)}
    </View>
  );

  const renderMeal = ({ item }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <Text style={styles.mealName}>{item.name}</Text>
        <TouchableOpacity 
          onPress={() => {
            Alert.alert(
              'Delete Meal',
              'Are you sure you want to delete this meal?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: () => deleteMeal(item.id), style: 'destructive' }
              ]
            );
          }}
        >
          <Text style={styles.deleteButton}>×</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.mealDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
      <View style={styles.nutritionInfo}>
        <Text>Calories: {item.calories}</Text>
        <Text>Protein: {item.protein}g</Text>
        <Text>Carbs: {item.carbs}g</Text>
        <Text>Fats: {item.fats}g</Text>
      </View>
      {item.notes ? (
        <Text style={styles.notes}>Notes: {item.notes}</Text>
      ) : null}
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={meals}
      renderItem={renderMeal}
      keyExtractor={item => item.id.toString()}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={loadData}
        />
      }
      ListHeaderComponent={renderDailyProgress}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressCard: {
    backgroundColor: Colors.white,
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  progressPercent: {
    fontSize: 14,
    color: Colors.secondary,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressBarExceeded: {
    backgroundColor: Colors.accent,
  },
  mealCard: {
    backgroundColor: Colors.white,
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  mealDate: {
    color: Colors.secondary,
    marginVertical: 5,
  },
  nutritionInfo: {
    marginVertical: 10,
  },
  notes: {
    fontStyle: 'italic',
    color: Colors.secondary,
    marginTop: 5,
  },
  deleteButton: {
    fontSize: 24,
    color: Colors.accent,
    fontWeight: 'bold',
  },
}); 