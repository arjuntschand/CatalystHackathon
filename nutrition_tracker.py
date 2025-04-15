from database import NutritionDB
from datetime import datetime

class NutritionTracker:
    def __init__(self):
        self.db = NutritionDB()

    def add_meal(self):
        print("\n=== Add New Meal ===")
        name = input("Enter meal name: ")
        calories = int(input("Enter calories: "))
        protein = float(input("Enter protein (g): "))
        carbs = float(input("Enter carbs (g): "))
        fats = float(input("Enter fats (g): "))
        notes = input("Enter any notes (optional): ")

        self.db.add_meal(name, calories, protein, carbs, fats, notes)
        print("Meal added successfully!")

    def view_meals(self):
        print("\n=== View Meals ===")
        meals = self.db.get_meals()
        
        if not meals:
            print("No meals recorded yet.")
            return

        for meal in meals:
            print(f"\nMeal: {meal[1]}")
            print(f"Date: {meal[2]}")
            print(f"Calories: {meal[3]}")
            print(f"Protein: {meal[4]}g")
            print(f"Carbs: {meal[5]}g")
            print(f"Fats: {meal[6]}g")
            if meal[7]:
                print(f"Notes: {meal[7]}")
            print("-" * 30)

    def run(self):
        while True:
            print("\n=== Nutrition Tracker ===")
            print("1. Add Meal")
            print("2. View Meals")
            print("3. Exit")
            
            choice = input("\nEnter your choice (1-3): ")
            
            if choice == "1":
                self.add_meal()
            elif choice == "2":
                self.view_meals()
            elif choice == "3":
                print("Goodbye!")
                self.db.close()
                break
            else:
                print("Invalid choice. Please try again.")

if __name__ == "__main__":
    tracker = NutritionTracker()
    tracker.run() 