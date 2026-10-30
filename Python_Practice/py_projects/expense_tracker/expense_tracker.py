# This program records and manages personal expenses.
#
# When the program starts
#   Load previously saved expenses from a JSON file
#
# Loop
#   Display the available menu options
#   Ask the user to select an action
#
# If the user chooses 1
#   Ask for the expense description
#   Ask for the amount
#   Ask for the expense category
#   Validate the information
#   Save the expense
#
# If the user chooses 2
#   Display all recorded expenses
#
# If the user chooses 3
#   Calculate total expenses
#   Calculate spending by category
#   Identify the largest expense
#
# If the user chooses 4
#   Delete a selected expense
#
# If the user chooses 5
#   Terminate the program
#
# Else
#   Display an invalid choice message


import json
from pathlib import Path


# Define the file used to store expense records
DATA_FILE = Path(__file__).with_name("expenses.json")


# Load saved expenses when the program starts
def load_expenses():

    if not DATA_FILE.exists():
        return []

    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            expenses = json.load(file)

        if isinstance(expenses, list):
            return expenses

        print("Saved data has an unexpected format.")
        return []

    except (json.JSONDecodeError, OSError):
        print("Could not read saved expenses. Starting with an empty list.")
        return []


# Save expenses to the JSON file
def save_expenses(expenses):

    try:
        with DATA_FILE.open("w", encoding="utf-8") as file:
            json.dump(expenses, file, indent=4)

    except OSError:
        print("Error: Could not save expenses.")


# Collect a valid expense amount
def get_amount():

    while True:

        try:
            amount = float(input("Enter the expense amount: ₦"))

            if amount <= 0:
                print("The amount must be greater than zero.")
                continue

            return amount

        except ValueError:
            print("Invalid amount. Please enter a number.")


# Add a new expense
def add_expense(expenses):

    print("\nADD NEW EXPENSE")

    # Collect the expense description
    description = input("Enter expense description: ").strip()

    if not description:
        print("Description cannot be empty.")
        return

    # Collect and validate the expense amount
    amount = get_amount()

    # Collect the expense category
    category = input(
        "Enter category (e.g. Food, Transport, School): "
    ).strip()

    if not category:
        print("Category cannot be empty.")
        return

    # Create the expense record
    expense = {
        "description": description,
        "amount": amount,
        "category": category.title()
    }

    # Add the record to the list
    expenses.append(expense)

    # Save the updated list
    save_expenses(expenses)

    print("Expense recorded successfully!")


# Display all recorded expenses
def view_expenses(expenses):

    if not expenses:
        print("\nNo expenses recorded yet.")
        return

    print("\n" + "=" * 60)
    print("YOUR EXPENSES")
    print("=" * 60)

    # Display every expense
    for index, expense in enumerate(expenses, start=1):

        print(f"\nExpense {index}")
        print(f"Description: {expense['description']}")
        print(f"Amount: ₦{expense['amount']:,.2f}")
        print(f"Category: {expense['category']}")

    print("\n" + "=" * 60)


# Display spending statistics
def view_summary(expenses):

    if not expenses:
        print("\nNo expenses available for analysis.")
        return

    # Calculate total spending
    total = sum(expense["amount"] for expense in expenses)

    # Group expenses by category
    category_totals = {}

    for expense in expenses:

        category = expense["category"]
        amount = expense["amount"]

        if category not in category_totals:
            category_totals[category] = 0

        category_totals[category] += amount

    # Identify the largest individual expense
    largest_expense = max(
        expenses,
        key=lambda expense: expense["amount"]
    )

    print("\n" + "=" * 40)
    print("EXPENSE SUMMARY")
    print("=" * 40)

    print(f"Number of expenses: {len(expenses)}")
    print(f"Total spending: ₦{total:,.2f}")

    print("\nSpending by category:")

    for category, amount in sorted(category_totals.items()):
        print(f"{category}: ₦{amount:,.2f}")

    print("\nLargest expense:")
    print(f"Description: {largest_expense['description']}")
    print(f"Amount: ₦{largest_expense['amount']:,.2f}")
    print(f"Category: {largest_expense['category']}")

    print("=" * 40)


# Delete an expense by its displayed number
def delete_expense(expenses):

    if not expenses:
        print("\nNo expenses available to delete.")
        return

    # Display expenses before requesting a selection
    view_expenses(expenses)

    while True:

        try:
            number = int(
                input("Enter the expense number to delete: ")
            )

            if 1 <= number <= len(expenses):
                removed_expense = expenses.pop(number - 1)

                # Save the updated list
                save_expenses(expenses)

                print(
                    f"Deleted expense: {removed_expense['description']}"
                )
                return

            print("Invalid expense number.")

        except ValueError:
            print("Please enter a valid whole number.")


# Load saved expenses
expenses = load_expenses()


# Main program loop
while True:

    print("\nPYTHON EXPENSE TRACKER")
    print("1. Add expense")
    print("2. View all expenses")
    print("3. View expense summary")
    print("4. Delete expense")
    print("5. Exit")

    choice = input("Choose an option (1-5): ").strip()

    if choice == "1":
        add_expense(expenses)

    elif choice == "2":
        view_expenses(expenses)

    elif choice == "3":
        view_summary(expenses)

    elif choice == "4":
        delete_expense(expenses)

    elif choice == "5":
        print("Your expenses have been saved.")
        print("Thank you for using Python Expense Tracker!")
        break

    else:
        print("Invalid choice. Please select an option from 1 to 5.")