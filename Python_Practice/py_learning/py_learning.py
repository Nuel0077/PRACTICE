# First python file

print('Hello, World!')
print('Welcome to py')



# Variables and Types

name = 'Ada'
age = 20
height = 1.68
is_learning = True
nothing_here = None

print(name)
print(age)
print(height)
print(is_learning)
print(nothing_here)



# Input and Conversion

# name = input('What is your name?')
# age = int(input('How old are you?'))
# next_year = age + 1 

# print(f'Hello, {name}. Next year your will be {next_year}')



# Basic Number and Formatting

price = 2499.5

print(f'N{price:,.2f}')



# Practice Task

# name = input('What is your name?')
# age = int(input('How old are you?'))
# fav_subj = input('What is your favourite subject?')

# print(f'Hello, {name}, you are {age} years old and your favourite subject is {fav_subj}')



# Grade Checker

# score = int(input('Enter score (0-100): '))

# if not 0 <= score <= 100:
#     print('Score must be between 0 - 100.')
# elif score >= 70:
#     print('Grade: A')
# elif score >= 60:
#     print('Grade: B')
# elif score >= 50:
#     print('Grade: C')
# elif score >= 45:
#     print('Grade: D')
# else:
#     print('Grade: F')



# Membership and Boolean Logic

# allowed_users = {'ada', 'sam', 'lee'}
# username = input('Username: ').strip().lower()

# if username in allowed_users and username != "":

#     print('Access allowed')
# else:
#     print('Access denied')



# MATCH / CASE

# command = input('Command (start/stop/help): ').lower()

# match command:
#     case 'start':
#         print('Starting...')
#     case 'stop':
#         print('Stopping...')
#     case 'help':
#         print('Available commands: start, stop, help')
#     case _:
#         print('Unknown command')



# Practice Task

# Transport = input('Transport (shuttle/luxurious/bus/category): ').lower()

# match Transport:
#     case 'shuttle':
#         print('Entering shuttle...')
#     case 'luxurious':
#         print('Entering luxurious...')
#     case 'bus':
#         print('Entering bus...')
#     case 'category':
#         print('Available fare: shuttle/luxurious/bus')
#     case _:
#         print('Unknown fare')



# FOR / RANGE

for number in range(1, 6):
    print(number, number * number)



# While with a sentinel

# while True:
#     text = input('Type something (or quit): ')
#     if text.strip().lower() == 'quit':
#         break
#     print(f'You typed: {text}')



# Enumerate and zip

names = ['Ada', 'Tunde', 'Mina']
for index, name in enumerate(names, start=1):
    print(index, name)

subjects = ['Python', 'Biology', 'Math']
scores = [88, 91, 76]
for subject, score in zip(subjects, scores):
    print(f'{subject}: {score}')



# Slicing and Methods

text = ' Learn Python the practical way '
clean = text.strip()
print(clean.lower())
print(clean[0:5])
print((clean.replace('practical', 'creative')))
print(clean.split())



# Join and Word Count

sentence = 'Python helps you build useful tools'
words = sentence.split()
print('='.join(words))
print('Word count:', len(words))



# Simple email check

# email = input('Email: ').strip()
# if '@' in email and '.' in email.split('@')[-1]:
#     print('Looks plausible; verify it properly in real applications')
# else:
#     print('Check the email format.')



# Lists

tasks = ["study", "practice", "review"]
tasks.append("build a project")
tasks[0] = "study Python"
print(tasks)
print(tasks[1:3])



# Dictionaries

student = {"name": "Ada", "level": 200, "active": True}
student["course"] = "Biochemistry"
print(student["name"])
print(student.get("email", "No email saved"))
for key, value in student.items():
 print(f"{key}: {value}")



# Sets and Comprehensions

registered = {"ada", "sam", "lee"}
attended = {"sam", "lee", "mina"}
print("Both:", registered & attended)
print("Missed:", registered - attended)
squares = [n * n for n in range(1, 6)]
even_squares = [n * n for n in range(1, 11) if n % 2 == 0]
print(squares, even_squares)



# Function with Validation

def calculate_average(scores: list[float]) -> float:
 """Return the arithmetic mean of a non-empty list of scores."""
 if not scores:
  ValueError("scores cannot be empty")
 return sum(scores) / len(scores)
print(calculate_average([80, 90, 100]))



# Defaults and Keyword Arguments

def greet(name: str, greeting: str = 'Hello') -> str:
   return f'{greeting}, {name}!'

print(greet('Ada'))
print(greet('Tunde', greeting='Welcome'))



# Safe Mutable Default Patterns

def add_item(item: str, items: list[str] | None = None) -> list[str]:
 if items is None:
    items = []
 items.append(item)
 return items
print(add_item("book"))
print(add_item("pen"))



# Exceptions and input validation

# def ask_for_age() -> int:
#  while True:
#     raw = input("Age: ").strip()
#     try:
#         age = int(raw)
#     except ValueError:
#         print("Enter a whole number, such as 18.")
#     if age < 0:
#         print("Age cannot be negative.")
#     return age
# print("Age saved:", ask_for_age())



# Object-oriented programming (OOP)

class BankAccount:
 def __init__(self, owner: str, balance: float = 0.0) -> None:
    self.owner = owner
    self.balance = balance

 def deposit(self, amount: float) -> None:
    if amount <= 0:
        raise ValueError("Amount must be positive")
    self.balance += amount

 def summary(self) -> str:
    return f"{self.owner}: balance {self.balance:.2f}"
 
account = BankAccount("Ada", 100)
account.deposit(50)
print(account.summary())



# Dictionary comprehension

prices = {"book": 5000, "pen": 700, "bag": 12000}
discounted = {name: price * 0.9 for name, price in prices.items()}
print(discounted)



# Useful Standard-library tools

# Dates

from datetime import date, timedelta
today = date.today()
due_date = today + timedelta(days=7)
print("Today:", today.isoformat())
print("Due:", due_date.isoformat())



# Counter

from collections import Counter
words = "python is fun and python is useful".split()
print(Counter(words).most_common(3))