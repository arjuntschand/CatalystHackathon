import sqlite3
from datetime import datetime

class NutritionDB:
    def __init__(self):
        self.conn = sqlite3.connect('nutrition.db')
        self.cursor = self.conn.cursor()
        self.create_tables()

    def create_tables(self):
        # Create meals table
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            date_time TIMESTAMP NOT NULL,
            calories INTEGER,
            protein FLOAT,
            carbs FLOAT,
            fats FLOAT,
            notes TEXT
        )
        ''')
        self.conn.commit()

    def add_meal(self, name, calories, protein, carbs, fats, notes=""):
        date_time = datetime.now()
        self.cursor.execute('''
        INSERT INTO meals (name, date_time, calories, protein, carbs, fats, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (name, date_time, calories, protein, carbs, fats, notes))
        self.conn.commit()

    def get_meals(self, date=None):
        if date:
            self.cursor.execute('''
            SELECT * FROM meals 
            WHERE date(date_time) = date(?)
            ORDER BY date_time DESC
            ''', (date,))
        else:
            self.cursor.execute('''
            SELECT * FROM meals 
            ORDER BY date_time DESC
            ''')
        return self.cursor.fetchall()

    def close(self):
        self.conn.close() 