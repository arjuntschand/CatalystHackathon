import PlaceholderImage from '../components/PlaceholderImage';

export const EATERIES = [
  {
    id: 1,
    name: 'Marketplace',
    image: PlaceholderImage
  },
  {
    id: 2,
    name: 'Pitchforks',
    image: PlaceholderImage
  },
  {
    id: 3,
    name: 'Cafe',
    image: PlaceholderImage
  },
  {
    id: 4,
    name: 'Ginger & Soy',
    image: PlaceholderImage
  },
  {
    id: 5,
    name: 'Il Forno',
    image: PlaceholderImage
  }
];

export const MEALS_BY_EATERY = {
  1: [ // Marketplace
    { id: 1, name: 'Grilled Chicken Sandwich', calories: 450, protein: 28, carbs: 35, fats: 12 },
    { id: 2, name: 'Caesar Salad', calories: 320, protein: 15, carbs: 20, fats: 18 },
    { id: 3, name: 'Turkey Club', calories: 520, protein: 32, carbs: 42, fats: 22 },
    { id: 4, name: 'Veggie Burger', calories: 380, protein: 12, carbs: 48, fats: 14 },
    { id: 5, name: 'Grilled Cheese', calories: 420, protein: 16, carbs: 39, fats: 24 }
  ],
  2: [ // Pitchforks
    { id: 1, name: 'BBQ Chicken Pizza', calories: 580, protein: 34, carbs: 65, fats: 22 },
    { id: 2, name: 'Buffalo Wings', calories: 450, protein: 38, carbs: 12, fats: 28 },
    { id: 3, name: 'Cheeseburger', calories: 650, protein: 35, carbs: 45, fats: 38 },
    { id: 4, name: 'Chicken Tenders', calories: 480, protein: 32, carbs: 38, fats: 22 },
    { id: 5, name: 'French Fries', calories: 320, protein: 4, carbs: 42, fats: 16 }
  ],
  3: [ // Cafe
    { id: 1, name: 'Iced Latte', calories: 180, protein: 8, carbs: 28, fats: 6 },
    { id: 2, name: 'Blueberry Muffin', calories: 420, protein: 6, carbs: 58, fats: 18 },
    { id: 3, name: 'Yogurt Parfait', calories: 290, protein: 12, carbs: 45, fats: 8 },
    { id: 4, name: 'Breakfast Sandwich', calories: 380, protein: 18, carbs: 35, fats: 20 },
    { id: 5, name: 'Fruit Bowl', calories: 120, protein: 2, carbs: 28, fats: 0 }
  ],
  4: [ // Ginger & Soy
    { id: 1, name: 'Chicken Teriyaki Bowl', calories: 550, protein: 32, carbs: 68, fats: 16 },
    { id: 2, name: 'Vegetable Stir Fry', calories: 380, protein: 12, carbs: 52, fats: 14 },
    { id: 3, name: 'Sushi Roll', calories: 420, protein: 18, carbs: 58, fats: 12 },
    { id: 4, name: 'Miso Soup', calories: 120, protein: 8, carbs: 12, fats: 4 },
    { id: 5, name: 'Spring Rolls', calories: 280, protein: 8, carbs: 32, fats: 14 }
  ],
  5: [ // Il Forno
    { id: 1, name: 'Margherita Pizza', calories: 680, protein: 24, carbs: 88, fats: 26 },
    { id: 2, name: 'Pasta Alfredo', calories: 720, protein: 22, carbs: 82, fats: 32 },
    { id: 3, name: 'Caesar Salad', calories: 340, protein: 12, carbs: 18, fats: 24 },
    { id: 4, name: 'Garlic Bread', calories: 240, protein: 6, carbs: 36, fats: 8 },
    { id: 5, name: 'Tiramisu', calories: 380, protein: 8, carbs: 46, fats: 18 }
  ]
};

export const TOPPINGS = {
  'Grilled Chicken Sandwich': [
    { id: 1, name: 'Lettuce', calories: 5 },
    { id: 2, name: 'Tomato', calories: 10 },
    { id: 3, name: 'Cheese', calories: 80 },
    { id: 4, name: 'Mayo', calories: 100 },
    { id: 5, name: 'Bacon', calories: 120 }
  ],
  'BBQ Chicken Pizza': [
    { id: 1, name: 'Extra Cheese', calories: 120 },
    { id: 2, name: 'Red Onions', calories: 15 },
    { id: 3, name: 'Bell Peppers', calories: 10 },
    { id: 4, name: 'Ranch Drizzle', calories: 80 },
    { id: 5, name: 'Extra BBQ Sauce', calories: 45 }
  ],
  'Chicken Teriyaki Bowl': [
    { id: 1, name: 'Extra Sauce', calories: 50 },
    { id: 2, name: 'Sesame Seeds', calories: 15 },
    { id: 3, name: 'Avocado', calories: 120 },
    { id: 4, name: 'Seaweed', calories: 10 },
    { id: 5, name: 'Spicy Mayo', calories: 90 }
  ],
  'Margherita Pizza': [
    { id: 1, name: 'Extra Cheese', calories: 120 },
    { id: 2, name: 'Fresh Basil', calories: 5 },
    { id: 3, name: 'Red Pepper Flakes', calories: 0 },
    { id: 4, name: 'Garlic', calories: 10 },
    { id: 5, name: 'Olive Oil Drizzle', calories: 120 }
  ],
  'Caesar Salad': [
    { id: 1, name: 'Extra Dressing', calories: 120 },
    { id: 2, name: 'Croutons', calories: 80 },
    { id: 3, name: 'Parmesan', calories: 45 },
    { id: 4, name: 'Grilled Chicken', calories: 180 },
    { id: 5, name: 'Bacon Bits', calories: 60 }
  ]
};

// Add default toppings for meals that don't have specific toppings
const defaultToppings = [
  { id: 1, name: 'Salt & Pepper', calories: 0 },
  { id: 2, name: 'Hot Sauce', calories: 5 },
  { id: 3, name: 'Red Pepper Flakes', calories: 0 },
  { id: 4, name: 'Parmesan', calories: 45 },
  { id: 5, name: 'Olive Oil', calories: 120 }
];

// Create a proxy to handle missing toppings
export const TOPPINGS_PROXY = new Proxy(TOPPINGS, {
  get: (target, prop) => {
    return target[prop] || defaultToppings;
  }
}); 