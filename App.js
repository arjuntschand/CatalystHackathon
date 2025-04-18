import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddMealScreen from './screens/AddMealScreen';
import ViewMealsScreen from './screens/ViewMealsScreen';
import GoalsScreen from './screens/GoalsScreen';
import QuestionnaireScreen from './screens/QuestionnaireScreen';
import RecommendedMealsScreen from './screens/RecommendedMealsScreen';
import Colors from './constants/Colors';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'DevilEats',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="Questionnaire" 
          component={QuestionnaireScreen} 
          options={{ 
            title: 'Set Your Goals',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.white,
          }}
        />
        <Stack.Screen 
          name="AddMeal" 
          component={AddMealScreen} 
          options={{ 
            title: 'Add Meal',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.white,
          }}
        />
        <Stack.Screen 
          name="ViewMeals" 
          component={ViewMealsScreen} 
          options={{ 
            title: 'Your Meals',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.white,
          }}
        />
        <Stack.Screen 
          name="Goals" 
          component={GoalsScreen} 
          options={{ 
            title: 'Nutrition Goals',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.white,
          }}
        />
        <Stack.Screen 
          name="RecommendedMeals" 
          component={RecommendedMealsScreen} 
          options={{ 
            title: 'Recommended for You',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.white,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 