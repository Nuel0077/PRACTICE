
import random

# QUIZ GAME: HTML, CSS, JavaScript, Python, Django

questions = [
    # HTML
    {
        "topic": "HTML",
        "question": "What does HTML stand for?",
        "options": [
            "HyperText Markup Language",
            "HighText Machine Language",
            "Hyper Transfer Main Language",
            "Home Tool Markup Language"
        ],
        "answer": "HyperText Markup Language"
    },
    {
        "topic": "HTML",
        "question": "Which HTML tag creates a hyperlink?",
        "options": ["<link>", "<a>", "<href>", "<url>"],
        "answer": "<a>"
    },
    {
        "topic": "HTML",
        "question": "Which tag is used to display an image?",
        "options": ["<image>", "<picture>", "<img>", "<src>"],
        "answer": "<img>"
    },
    {
        "topic": "HTML",
        "question": "Which tag creates an unordered list?",
        "options": ["<ol>", "<li>", "<dl>", "<ul>"],
        "answer": "<ul>"
    },
    {
        "topic": "HTML",
        "question": "Which attribute provides alternative text for an image?",
        "options": ["title", "alt", "src", "href"],
        "answer": "alt"
    },
    {
        "topic": "HTML",
        "question": "Which HTML element is used for the largest heading?",
        "options": ["<heading>", "<h6>", "<h1>", "<head>"],
        "answer": "<h1>"
    },
    {
        "topic": "HTML",
        "question": "Which element is used to collect user input in a form?",
        "options": ["<input>", "<output>", "<label>", "<section>"],
        "answer": "<input>"
    },
    {
        "topic": "HTML",
        "question": "Which declaration identifies an HTML5 document?",
        "options": [
            "<html5>",
            "<!DOCTYPE html>",
            "<!HTML5>",
            "<DOCTYPE>"
        ],
        "answer": "<!DOCTYPE html>"
    },

    # CSS
    {
        "topic": "CSS",
        "question": "What does CSS stand for?",
        "options": [
            "Creative Style Sheets",
            "Computer Style Syntax",
            "Cascading Style Sheets",
            "Colorful Style System"
        ],
        "answer": "Cascading Style Sheets"
    },
    {
        "topic": "CSS",
        "question": "Which property changes the text color?",
        "options": ["font-color", "text-color", "color", "background"],
        "answer": "color"
    },
    {
        "topic": "CSS",
        "question": "Which property adds space inside an element's border?",
        "options": ["margin", "padding", "gap", "outline"],
        "answer": "padding"
    },
    {
        "topic": "CSS",
        "question": "Which CSS declaration creates a flex container?",
        "options": [
            "position: flex;",
            "display: flex;",
            "flex: display;",
            "layout: flex;"
        ],
        "answer": "display: flex;"
    },
    {
        "topic": "CSS",
        "question": "Which selector targets an element with id='header'?",
        "options": [".header", "#header", "*header", "header#"],
        "answer": "#header"
    },
    {
        "topic": "CSS",
        "question": "Which property controls the size of text?",
        "options": ["font-size", "text-style", "font-weight", "text-size"],
        "answer": "font-size"
    },
    {
        "topic": "CSS",
        "question": "Which pseudo-class applies styles when an element is hovered over?",
        "options": [":active", ":focus", ":hover", ":visited"],
        "answer": ":hover"
    },
    {
        "topic": "CSS",
        "question": "Which property rounds the corners of an element?",
        "options": ["border-style", "corner-radius", "border-radius", "round-border"],
        "answer": "border-radius"
    },

    # JAVASCRIPT
    {
        "topic": "JavaScript",
        "question": "Which keyword declares a block-scoped variable that can be reassigned?",
        "options": ["const", "let", "static", "define"],
        "answer": "let"
    },
    {
        "topic": "JavaScript",
        "question": "Which operator checks strict equality?",
        "options": ["=", "==", "===", "!="],
        "answer": "==="
    },
    {
        "topic": "JavaScript",
        "question": "Which method selects an element by its ID?",
        "options": [
            "document.queryId()",
            "document.getElementById()",
            "document.selectId()",
            "document.findElement()"
        ],
        "answer": "document.getElementById()"
    },
    {
        "topic": "JavaScript",
        "question": "Which method adds an item to the end of an array?",
        "options": ["push()", "pop()", "shift()", "slice()"],
        "answer": "push()"
    },
    {
        "topic": "JavaScript",
        "question": "Which symbol starts a single-line comment in JavaScript?",
        "options": ["#", "<!--", "//", "**"],
        "answer": "//"
    },
    {
        "topic": "JavaScript",
        "question": "What does typeof 42 return?",
        "options": ["integer", "number", "float", "numeric"],
        "answer": "number"
    },
    {
        "topic": "JavaScript",
        "question": "Which method attaches an event handler to an element?",
        "options": [
            "addEventListener()",
            "attachEventHandler()",
            "createEvent()",
            "addHandler()"
        ],
        "answer": "addEventListener()"
    },
    {
        "topic": "JavaScript",
        "question": "Which array method creates a new array by transforming each item?",
        "options": ["forEach()", "find()", "map()", "includes()"],
        "answer": "map()"
    },

    # PYTHON
    {
        "topic": "Python",
        "question": "Which keyword defines a function?",
        "options": ["function", "func", "def", "method"],
        "answer": "def"
    },
    {
        "topic": "Python",
        "question": "Which data type stores key-value pairs?",
        "options": ["list", "tuple", "set", "dictionary"],
        "answer": "dictionary"
    },
    {
        "topic": "Python",
        "question": "Which symbol begins a single-line comment?",
        "options": ["//", "#", "<!--", "**"],
        "answer": "#"
    },
    {
        "topic": "Python",
        "question": "What is the result of 3 ** 2?",
        "options": ["6", "9", "5", "8"],
        "answer": "9"
    },
    {
        "topic": "Python",
        "question": "Which keyword is used to repeat code for each item in a sequence?",
        "options": ["repeat", "loop", "for", "each"],
        "answer": "for"
    },
    {
        "topic": "Python",
        "question": "Which method adds an item to the end of a list?",
        "options": ["add()", "append()", "insert_end()", "extend_one()"],
        "answer": "append()"
    },
    {
        "topic": "Python",
        "question": "What does len('Python') return?",
        "options": ["5", "6", "7", "8"],
        "answer": "6"
    },
    {
        "topic": "Python",
        "question": "Which statement handles an exception?",
        "options": ["if/else", "for/in", "try/except", "def/return"],
        "answer": "try/except"
    },

    # DJANGO
    {
        "topic": "Django",
        "question": "What is Django primarily used for?",
        "options": [
            "Building web applications",
            "Editing images",
            "Creating operating systems",
            "Designing presentations"
        ],
        "answer": "Building web applications"
    },
    {
        "topic": "Django",
        "question": "Which command starts Django's development server?",
        "options": [
            "python manage.py runserver",
            "python manage.py startproject",
            "python manage.py migrate",
            "python manage.py shell"
        ],
        "answer": "python manage.py runserver"
    },
    {
        "topic": "Django",
        "question": "Which command creates a new Django app?",
        "options": [
            "python manage.py newapp blog",
            "python manage.py startapp blog",
            "django create blog",
            "python manage.py makeapp blog"
        ],
        "answer": "python manage.py startapp blog"
    },
    {
        "topic": "Django",
        "question": "Which file commonly maps URL patterns to views?",
        "options": ["models.py", "admin.py", "urls.py", "apps.py"],
        "answer": "urls.py"
    },
    {
        "topic": "Django",
        "question": "Which file typically defines database models in a Django app?",
        "options": ["views.py", "models.py", "urls.py", "tests.py"],
        "answer": "models.py"
    },
    {
        "topic": "Django",
        "question": "Which command applies database migrations?",
        "options": [
            "python manage.py makemigrations",
            "python manage.py migrate",
            "python manage.py startapp",
            "python manage.py createsuperuser"
        ],
        "answer": "python manage.py migrate"
    },
    {
        "topic": "Django",
        "question": "What is the main role of a Django view?",
        "options": [
            "To handle a request and return a response",
            "To define CSS styles",
            "To store virtual environments",
            "To install Python packages"
        ],
        "answer": "To handle a request and return a response"
    },
    {
        "topic": "Django",
        "question": "Which command creates a Django administrator account?",
        "options": [
            "python manage.py admin",
            "python manage.py createadmin",
            "python manage.py createsuperuser",
            "python manage.py startadmin"
        ],
        "answer": "python manage.py createsuperuser"
    }
]


def play_quiz():
    score = 0
    total_questions = 20

    # Randomly select 20 different questions
    selected_questions = random.sample(questions, total_questions)

    print("\n" + "=" * 45)
    print("       WELCOME TO THE TECH QUIZ GAME")
    print("=" * 45)
    print("Topics: HTML, CSS, JavaScript, Python, Django")
    print(f"You will answer {total_questions} random questions.")
    print("Enter A, B, C, or D to answer.\n")

    for number, question_data in enumerate(selected_questions, start=1):
        print("-" * 45)
        print(f"Question {number}/{total_questions}")
        print(f"Topic: {question_data['topic']}")
        print(question_data["question"])

        # Shuffle answer choices for each question
        options = question_data["options"].copy()
        random.shuffle(options)

        # Assign A, B, C, D to the shuffled choices
        letters = ["A", "B", "C", "D"]
        answer_map = dict(zip(letters, options))

        for letter, option in answer_map.items():
            print(f"{letter}. {option}")

        while True:
            user_answer = input("\nYour answer: ").strip().upper()

            if user_answer in letters:
                break

            print("Invalid choice. Please enter A, B, C, or D.")

        chosen_answer = answer_map[user_answer]

        if chosen_answer == question_data["answer"]:
            print("Correct! Well done.")
            score += 1
        else:
            print("Wrong answer.")
            print(f"Correct answer: {question_data['answer']}")

    percentage = (score / total_questions) * 100

    print("\n" + "=" * 45)
    print("              QUIZ RESULTS")
    print("=" * 45)
    print(f"Your score: {score}/{total_questions}")
    print(f"Percentage: {percentage:.1f}%")

    if percentage >= 80:
        print("Excellent! Your tech knowledge is strong.")
    elif percentage >= 60:
        print("Good job! Keep practising.")
    elif percentage >= 40:
        print("Not bad. Revise the topics and try again.")
    else:
        print("Keep learning. Every attempt makes you better!")

    print("=" * 45)


# Allow the player to play again
while True:
    play_quiz()

    play_again = input("\nWould you like to play again? (yes/no): ").strip().lower()

    if play_again not in ("yes", "y"):
        print("\nThanks for playing the Tech Quiz Game. Goodbye!")
        break
