import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

const QUESTIONS = [
  {
    id: 1,
    question: "What is your fitness goal?",
    options: ["Lose Weight", "Gain Muscle", "Maintain Weight", "Improve Health"]
  },
  {
    id: 2,
    question: "What is your current activity level?",
    options: ["Sedentary", "Light Exercise", "Moderate Exercise", "Heavy Exercise"]
  },
  {
    id: 3,
    question: "Do you have any dietary restrictions?",
    options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free"]
  },
  {
    id: 4,
    question: "What is your daily calorie target?",
    type: "numeric"
  },
  {
    id: 5,
    question: "What is your preferred protein intake? (g/day)",
    type: "numeric"
  }
];

export default function QuestionnaireScreen({ navigation }) {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentInput, setCurrentInput] = useState('');

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [QUESTIONS[currentQuestion].id]: answer });
    setCurrentInput('');
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      saveAnswers();
    }
  };

  const saveAnswers = async () => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(answers));
      Alert.alert(
        'Success',
        'Your preferences have been saved!',
        [
          {
            text: 'Continue',
            onPress: () => navigation.replace('RecommendedMeals')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save preferences');
    }
  };

  const renderQuestion = () => {
    const question = QUESTIONS[currentQuestion];

    if (question.type === 'numeric') {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.question}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter number"
            value={currentInput}
            onChangeText={setCurrentInput}
          />
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={() => {
              if (currentInput.trim()) {
                handleAnswer(currentInput);
              } else {
                Alert.alert('Please enter a value');
              }
            }}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                answers[question.id] === option && styles.selectedOption
              ]}
              onPress={() => handleAnswer(option)}
            >
              <Text style={[
                styles.optionText,
                answers[question.id] === option && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Let's Personalize Your Experience</Text>
      <Text style={styles.subtitle}>
        Question {currentQuestion + 1} of {QUESTIONS.length}
      </Text>
      {renderQuestion()}
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
    marginBottom: 20,
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
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 