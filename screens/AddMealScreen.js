import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  Image,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import { EATERIES, MEALS_BY_EATERY, TOPPINGS } from '../constants/MealData';

export default function AddMealScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: Eatery, 2: Meal, 3: Toppings, 4: Confirm
  const [selectedEatery, setSelectedEatery] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);

  const renderEateryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eateryCard}
      onPress={() => {
        setSelectedEatery(item);
        setStep(2);
      }}
    >
      <item.image style={styles.eateryImage} />
      <Text style={styles.eateryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderMealItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.mealCard}
      onPress={() => {
        setSelectedMeal(item);
        setStep(3);
      }}
    >
      <Text style={styles.mealName}>{item.name}</Text>
      <Text style={styles.mealDetails}>
        Calories: {item.calories} | Protein: {item.protein}g
      </Text>
    </TouchableOpacity>
  );

  const renderToppingItem = ({ item }) => {
    const isSelected = selectedToppings.some(t => t.id === item.id);
    return (
      <TouchableOpacity 
        style={[styles.toppingItem, isSelected && styles.selectedTopping]}
        onPress={() => {
          if (isSelected) {
            setSelectedToppings(selectedToppings.filter(t => t.id !== item.id));
          } else {
            setSelectedToppings([...selectedToppings, item]);
          }
        }}
      >
        <Text style={[styles.toppingText, isSelected && styles.selectedToppingText]}>
          {item.name} (+{item.calories} cal)
        </Text>
      </TouchableOpacity>
    );
  };

  const saveMeal = async () => {
    try {
      const totalCalories = selectedMeal.calories + 
        selectedToppings.reduce((sum, topping) => sum + topping.calories, 0);

      const meal = {
        id: Date.now(),
        name: selectedMeal.name,
        eatery: selectedEatery.name,
        date: new Date().toISOString(),
        calories: totalCalories,
        protein: selectedMeal.protein,
        carbs: selectedMeal.carbs,
        fats: selectedMeal.fats,
        toppings: selectedToppings.map(t => t.name).join(', ')
      };

      const existingMeals = await AsyncStorage.getItem('meals');
      const meals = existingMeals ? JSON.parse(existingMeals) : [];
      meals.push(meal);
      
      await AsyncStorage.setItem('meals', JSON.stringify(meals));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.container}>
            <Text style={styles.stepTitle}>Select Eatery</Text>
            <FlatList
              data={EATERIES}
              renderItem={renderEateryItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.container}>
            <Text style={styles.stepTitle}>Select Meal from {selectedEatery.name}</Text>
            <FlatList
              data={MEALS_BY_EATERY[selectedEatery.id]}
              renderItem={renderMealItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setStep(1)}
            >
              <Text style={styles.backButtonText}>Back to Eateries</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.container}>
            <Text style={styles.stepTitle}>Add Toppings</Text>
            <FlatList
              data={TOPPINGS[selectedMeal.name]}
              renderItem={renderToppingItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.listContainer}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setStep(2)}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.nextButton}
                onPress={() => setStep(4)}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <ScrollView style={styles.container}>
            <Text style={styles.stepTitle}>Confirm Meal</Text>
            <View style={styles.confirmationCard}>
              <Text style={styles.confirmationTitle}>{selectedMeal.name}</Text>
              <Text style={styles.confirmationDetail}>From: {selectedEatery.name}</Text>
              <Text style={styles.confirmationDetail}>
                Calories: {selectedMeal.calories + 
                  selectedToppings.reduce((sum, topping) => sum + topping.calories, 0)}
              </Text>
              <Text style={styles.confirmationDetail}>Protein: {selectedMeal.protein}g</Text>
              <Text style={styles.confirmationDetail}>Carbs: {selectedMeal.carbs}g</Text>
              <Text style={styles.confirmationDetail}>Fats: {selectedMeal.fats}g</Text>
              {selectedToppings.length > 0 && (
                <>
                  <Text style={styles.toppingsTitle}>Toppings:</Text>
                  {selectedToppings.map(topping => (
                    <Text key={topping.id} style={styles.toppingDetail}>
                      • {topping.name} (+{topping.calories} cal)
                    </Text>
                  ))}
                </>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setStep(3)}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveMeal}
              >
                <Text style={styles.saveButtonText}>Save Meal</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
    }
  };

  return renderStep();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 15,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  eateryCard: {
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
  eateryImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  eateryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  mealDetails: {
    color: Colors.secondary,
  },
  toppingItem: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  selectedTopping: {
    backgroundColor: Colors.primary,
  },
  toppingText: {
    color: Colors.primary,
    fontSize: 16,
  },
  selectedToppingText: {
    color: Colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 10,
  },
  backButtonText: {
    color: Colors.primary,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 10,
  },
  nextButtonText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 10,
  },
  saveButtonText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmationCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
  },
  confirmationDetail: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  toppingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 15,
    marginBottom: 10,
  },
  toppingDetail: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 10,
    marginBottom: 5,
  },
}); 