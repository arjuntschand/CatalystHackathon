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

export default function ViewMealsScreen() {
  const [meals, setMeals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [goals, setGoals] = useState(null);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });

  useEffect(() => {
    loadMeals();
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

  const calculateDailyTotals = (mealsData) => {
    const today = new Date().toDateString();
    const todayMeals = mealsData.filter(meal => 
      new Date(meal.date).toDateString() === today
    );

    const totals = todayMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fats: acc.fats + (meal.fats || 0)
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

  const renderDailyProgress = () => (
    <View style={styles.progressCard}>
      <Text style={styles.progressTitle}>Today's Progress</Text>
      <View style={styles.progressRow}>
        <Text>Calories: {dailyTotals.calories} {goals?.calories ? `/ ${goals.calories}` : ''}</Text>
        <Text>Protein: {dailyTotals.protein}g {goals?.protein ? `/ ${goals.protein}g` : ''}</Text>
      </View>
      <View style={styles.progressRow}>
        <Text>Carbs: {dailyTotals.carbs}g {goals?.carbs ? `/ ${goals.carbs}g` : ''}</Text>
        <Text>Fats: {dailyTotals.fats}g {goals?.fats ? `/ ${goals.fats}g` : ''}</Text>
      </View>
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
        <RefreshControl refreshing={refreshing} onRefresh={loadMeals} />
      }
      ListHeaderComponent={renderDailyProgress}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mealCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealDate: {
    color: '#666',
    marginBottom: 10,
  },
  nutritionInfo: {
    marginVertical: 10,
  },
  notes: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 10,
  },
  progressCard: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF3B30',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    fontSize: 24,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
}); 