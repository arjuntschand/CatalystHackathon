import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Pressable 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

const QUESTIONS = [
  {
    id: 'fitnessGoal',
    question: "What is your fitness goal?",
    options: ["Lose Weight", "Gain Muscle", "Maintain Weight", "Improve Health"]
  },
  {
    id: 'activityLevel',
    question: "What is your current activity level?",
    options: ["Sedentary", "Light Exercise", "Moderate Exercise", "Heavy Exercise"]
  },
  {
    id: 'dietaryRestrictions',
    question: "Do you have any dietary restrictions?",
    options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"]
  }
];

const MACRO_TARGETS = [
  { id: 'calories', label: 'Daily Calories Target', placeholder: 'e.g., 2000' },
  { id: 'protein', label: 'Daily Protein Target (g)', placeholder: 'e.g., 150' },
  { id: 'carbs', label: 'Daily Carbs Target (g)', placeholder: 'e.g., 250' },
  { id: 'fats', label: 'Daily Fats Target (g)', placeholder: 'e.g., 65' }
];

export default function GoalsScreen({ navigation }) {
  const [answers, setAnswers] = useState({
    fitnessGoal: '',
    activityLevel: '',
    dietaryRestrictions: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  useEffect(() => {
    loadSavedAnswers();
  }, []);

  const loadSavedAnswers = async () => {
    try {
      const savedAnswers = await AsyncStorage.getItem('userPreferences');
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    } catch (error) {
      console.error('Error loading answers:', error);
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const saveAnswers = async () => {
    // Validate all fields are filled
    const emptyFields = [];
    
    // Check main questions
    QUESTIONS.forEach(question => {
      if (!answers[question.id]) {
        emptyFields.push(question.question);
      }
    });

    // Check macro targets
    MACRO_TARGETS.forEach(target => {
      if (!answers[target.id]) {
        emptyFields.push(target.label);
      }
    });

    if (emptyFields.length > 0) {
      Alert.alert(
        'Missing Information',
        `Please fill in the following:\n${emptyFields.join('\n')}`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(answers));
      Alert.alert(
        'Success',
        'Your goals have been saved!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save goals');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Set Your Nutrition Goals</Text>
      <Text style={styles.subtitle}>
        Help us personalize your meal recommendations
      </Text>

      {/* Render main questions */}
      {QUESTIONS.map(question => (
        <View style={styles.questionContainer} key={question.id}>
          <Text style={styles.questionText}>{question.question}</Text>
          <View style={styles.optionsContainer}>
            {question.options.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.optionButton,
                  answers[question.id] === option && styles.selectedOption
                ]}
                onPress={() => handleAnswer(question.id, option)}
              >
                <Text 
                  style={[
                    styles.optionText,
                    answers[question.id] === option && styles.selectedOptionText
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {/* Render macro targets */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>Set Your Daily Targets</Text>
        {MACRO_TARGETS.map(target => (
          <View key={target.id} style={styles.macroInputContainer}>
            <Text style={styles.macroLabel}>{target.label}</Text>
            <TextInput
              style={styles.macroInput}
              keyboardType="numeric"
              placeholder={target.placeholder}
              value={answers[target.id]}
              onChangeText={(text) => handleAnswer(target.id, text)}
            />
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveAnswers}>
        <Text style={styles.saveButtonText}>Save Goals</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  questionContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
  },
  selectedOption: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    color: Colors.primary,
    fontSize: 16,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: Colors.white,
  },
  macroInputContainer: {
    marginBottom: 15,
  },
  macroLabel: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 5,
  },
  macroInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    marginVertical: 20,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 