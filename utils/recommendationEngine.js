// First, create a new utility file for the recommendation logic
export const calculateRecommendations = (preferences, allMeals) => {
  const {
    fitnessGoal,
    activityLevel,
    dietaryRestrictions,
    calorieTarget,
    proteinTarget
  } = parsePreferences(preferences);

  let recommendedMeals = [];
  const mealsPool = flattenMeals(allMeals);

  // Filter based on dietary restrictions
  let filteredMeals = filterByDietaryRestrictions(mealsPool, dietaryRestrictions);

  // Apply different strategies based on fitness goal
  switch (fitnessGoal) {
    case 'Lose Weight':
      recommendedMeals = getLowCalorieMeals(filteredMeals, calorieTarget);
      break;
    case 'Gain Muscle':
      recommendedMeals = getHighProteinMeals(filteredMeals, proteinTarget);
      break;
    case 'Maintain Weight':
      recommendedMeals = getBalancedMeals(filteredMeals, calorieTarget);
      break;
    case 'Improve Health':
      recommendedMeals = getNutritiousMeals(filteredMeals);
      break;
    default:
      recommendedMeals = getBalancedMeals(filteredMeals, calorieTarget);
  }

  // Add personalized reasons for each recommendation
  return recommendedMeals.map(meal => ({
    ...meal,
    reason: generateReason(meal, fitnessGoal, calorieTarget, proteinTarget)
  }));
};

const parsePreferences = (preferences) => {
  return {
    fitnessGoal: preferences[1],
    activityLevel: preferences[2],
    dietaryRestrictions: preferences[3],
    calorieTarget: parseInt(preferences[4]) || 2000,
    proteinTarget: parseInt(preferences[5]) || 50
  };
};

const flattenMeals = (allMeals) => {
  const flattened = [];
  Object.entries(allMeals).forEach(([eateryId, meals]) => {
    meals.forEach(meal => {
      flattened.push({
        ...meal,
        eateryId: parseInt(eateryId)
      });
    });
  });
  return flattened;
};

const filterByDietaryRestrictions = (meals, restrictions) => {
  if (restrictions === 'None') return meals;

  const restrictedItems = {
    'Vegetarian': ['Chicken', 'Turkey', 'BBQ', 'Wings', 'Burger', 'Bacon'],
    'Vegan': ['Chicken', 'Turkey', 'BBQ', 'Wings', 'Burger', 'Cheese', 'Mayo', 'Yogurt'],
    'Gluten-Free': ['Bread', 'Pizza', 'Pasta', 'Muffin'],
    'Dairy-Free': ['Cheese', 'Yogurt', 'Mayo', 'Alfredo']
  };

  return meals.filter(meal => {
    const restricted = restrictedItems[restrictions] || [];
    return !restricted.some(item => 
      meal.name.toLowerCase().includes(item.toLowerCase())
    );
  });
};

const getLowCalorieMeals = (meals, calorieTarget) => {
  const mealTarget = calorieTarget / 3; // Assume 3 meals per day
  return meals
    .filter(meal => meal.calories <= mealTarget)
    .sort((a, b) => {
      // Prioritize high protein, low calorie meals
      const aRatio = a.protein / a.calories;
      const bRatio = b.protein / b.calories;
      return bRatio - aRatio;
    })
    .slice(0, 5);
};

const getHighProteinMeals = (meals, proteinTarget) => {
  const mealProteinTarget = proteinTarget / 3; // Assume 3 meals per day
  return meals
    .filter(meal => meal.protein >= mealProteinTarget)
    .sort((a, b) => b.protein - a.protein)
    .slice(0, 5);
};

const getBalancedMeals = (meals, calorieTarget) => {
  const mealTarget = calorieTarget / 3;
  return meals
    .sort((a, b) => {
      const aBalance = Math.abs(a.calories - mealTarget);
      const bBalance = Math.abs(b.calories - mealTarget);
      return aBalance - bBalance;
    })
    .slice(0, 5);
};

const getNutritiousMeals = (meals) => {
  return meals
    .sort((a, b) => {
      // Score based on protein content and balanced macros
      const aScore = calculateNutritionScore(a);
      const bScore = calculateNutritionScore(b);
      return bScore - aScore;
    })
    .slice(0, 5);
};

const calculateNutritionScore = (meal) => {
  const proteinScore = meal.protein * 4;
  const carbScore = meal.carbs * 2;
  const fatScore = meal.fats * 2;
  const balanceScore = 100 - Math.abs(proteinScore - carbScore) - Math.abs(carbScore - fatScore);
  return proteinScore + balanceScore;
};

const generateReason = (meal, fitnessGoal, calorieTarget, proteinTarget) => {
  const reasons = [];

  if (fitnessGoal === 'Lose Weight') {
    if (meal.calories < calorieTarget / 3) {
      reasons.push('Low calorie option');
    }
    if (meal.protein / meal.calories > 0.15) {
      reasons.push('Good protein-to-calorie ratio');
    }
  }

  if (fitnessGoal === 'Gain Muscle') {
    if (meal.protein > proteinTarget / 3) {
      reasons.push('High in protein');
    }
    if (meal.carbs > 30) {
      reasons.push('Good carbs for energy');
    }
  }

  if (fitnessGoal === 'Maintain Weight') {
    if (Math.abs(meal.calories - calorieTarget/3) < 100) {
      reasons.push('Balanced calories');
    }
    if (meal.protein > 15 && meal.carbs > 15 && meal.fats > 5) {
      reasons.push('Well-balanced macros');
    }
  }

  if (fitnessGoal === 'Improve Health') {
    if (meal.name.toLowerCase().includes('vegetable') || 
        meal.name.toLowerCase().includes('salad')) {
      reasons.push('Rich in nutrients');
    }
    if (meal.fats < 15) {
      reasons.push('Low in fats');
    }
  }

  if (reasons.length === 0) {
    reasons.push('Matches your dietary preferences');
  }

  return reasons.join(', ');
}; 