import random

# Loop
    # Ask: roll the dice?
    # If user enters y
    #   Generate two random numbers
    #   Print them
    # If users enters n
    #   Print thank you message
    #   Terminate
    # Else
    #   Print invalid choice


while True:
    choice = input('Roll the dice? (y/n): ').lower()
    if choice == 'y':
        dice1 = random.randint(1, 6)
        dice2 = random.randint(1, 6)
        print(f'({dice1}, {dice2})')
    elif choice == 'n':
        print('Thanks for playing!')
        break
    else:
        print('Invalid choice!')