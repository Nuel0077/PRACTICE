import sqlite3
import hashlib
import secrets
import string
import re
import hmac
from getpass import getpass

# DATABASE CONFIGURATION

DATABASE_NAME = "accounts.db"


def initialize_database():
    """Create the database and users table if they do not exist."""

    with sqlite3.connect(DATABASE_NAME) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL COLLATE NOCASE UNIQUE,
                username TEXT NOT NULL COLLATE NOCASE UNIQUE,
                salt TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """)

    print("Database initialized successfully!")


# PASSWORD CONFIGURATION

def generate_strong_password(length=14):
    """Generate a password containing all required character types."""

    if length < 8:
        raise ValueError("Password length must be at least 8 characters.")

    lowercase = string.ascii_lowercase
    uppercase = string.ascii_uppercase
    numbers = string.digits
    symbols = string.punctuation

    # Ensure the password contains at least one of each character type.
    password_characters = [
        secrets.choice(lowercase),
        secrets.choice(uppercase),
        secrets.choice(numbers),
        secrets.choice(symbols)
    ]

    all_characters = lowercase + uppercase + numbers + symbols

    # Fill the remaining positions.
    for _ in range(length - len(password_characters)):
        password_characters.append(secrets.choice(all_characters))

    # Randomize the character positions.
    secrets.SystemRandom().shuffle(password_characters)

    return "".join(password_characters)


def password_strength(password):
    """Check the strength of a password."""

    has_lowercase = any(char.islower() for char in password)
    has_uppercase = any(char.isupper() for char in password)
    has_number = any(char.isdigit() for char in password)
    has_symbol = any(char in string.punctuation for char in password)

    valid_password = (
        len(password) >= 8
        and has_lowercase
        and has_uppercase
        and has_number
        and has_symbol
    )

    if not valid_password:
        return "Weak"

    if len(password) >= 12:
        return "Strong"

    return "Good"


def show_password_rules():
    """Display the password requirements."""

    print("\nPASSWORD REQUIREMENTS")
    print("- Minimum length: 8 characters")
    print("- At least one uppercase letter (A-Z)")
    print("- At least one lowercase letter (a-z)")
    print("- At least one number (0-9)")
    print("- At least one symbol (!, @, #, $, etc.)")


def read_password(prompt, show_password):
    """Read a password either visibly or with hidden input."""

    if show_password:
        return input(prompt)

    return getpass(prompt)


def ask_password_visibility():
    """Ask whether the user wants to display or hide passwords."""

    while True:
        choice = input(
            "\nShow password while typing or hide it? (show/hide): "
        ).strip().lower()

        if choice in ("show", "s"):
            return True

        if choice in ("hide", "h"):
            return False

        print("Please enter 'show' or 'hide'.")


def ask_yes_no(prompt):
    """Ask a yes-or-no question."""

    while True:
        answer = input(prompt).strip().lower()

        if answer in ("yes", "y"):
            return True

        if answer in ("no", "n"):
            return False

        print("Please enter yes or no.")


# PASSWORD SECURITY

def hash_password(password):
    """
    Hash a password using PBKDF2 and a random salt.

    The original password is not stored in the database.
    """

    salt = secrets.token_bytes(16)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        600_000
    )

    return salt.hex(), password_hash.hex()


def verify_password(password, salt_hex, stored_hash):
    """Verify a password against its saved hash."""

    salt = bytes.fromhex(salt_hex)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        600_000
    ).hex()

    return hmac.compare_digest(password_hash, stored_hash)


# INPUT VALIDATION

def valid_email(email):
    """Perform basic email address validation."""

    pattern = r"[^@\s]+@[^@\s]+\.[^@\s]+"

    return re.fullmatch(pattern, email) is not None


def valid_username(username):
    """
    Allow usernames containing letters, numbers,
    underscores, periods and hyphens.

    Usernames must contain between 3 and 20 characters.
    """

    pattern = r"[A-Za-z0-9_.-]{3,20}"

    return re.fullmatch(pattern, username) is not None


# CREATE ACCOUNT / SIGNUP

def create_account(conn):

    print("\n" + "=" * 45)
    print("              CREATE ACCOUNT")
    print("=" * 45)

    # FULL NAME
    while True:
        full_name = input("Full Name: ").strip()

        if full_name:
            break

        print("Full name cannot be empty.")

    # EMAIL ADDRESS
    while True:
        email = input("Email Address: ").strip()

        if not valid_email(email):
            print("Please enter a valid email address.")
            continue

        existing_email = conn.execute(
            "SELECT id FROM users WHERE email = ?",
            (email,)
        ).fetchone()

        if existing_email:
            print("This email address is already registered.")
            continue

        break

    # USERNAME
    while True:
        username = input("Choose a Username: ").strip()

        if not valid_username(username):
            print(
                "Username must be 3-20 characters and contain only "
                "letters, numbers, underscores, periods or hyphens."
            )
            continue

        existing_username = conn.execute(
            "SELECT id FROM users WHERE username = ?",
            (username,)
        ).fetchone()

        if existing_username:
            print("This username is already taken. Choose another one.")
            continue

        break

    # PASSWORD RULES
    show_password_rules()

    show_password = ask_password_visibility()

    # CHOOSE HOW TO CREATE A PASSWORD
    while True:

        print("\nPASSWORD OPTIONS")
        print("1. Enter my own password")
        print("2. Generate a strong password automatically")

        choice = input("Choose an option (1 or 2): ").strip()

        if choice == "1":

            password = read_password(
                "Enter your password: ",
                show_password
            )

            strength = password_strength(password)

            print(f"\nPassword Strength: {strength}")

            if strength == "Weak":

                print("\nYour password does not meet the requirements.")

                suggested_password = generate_strong_password()

                print(
                    "\nSuggested strong password:\n"
                    f"{suggested_password}"
                )

                if ask_yes_no("\nUse this suggested password? (yes/no): "):
                    password = suggested_password
                    print("Strong password selected!")
                    break

                print("\nPlease enter another password.")
                continue

            break

        elif choice == "2":

            password = generate_strong_password()

            print("\nYour strong password has been generated!")
            print(f"Generated Password: {password}")
            print("Save this password somewhere secure.")

            print(f"Password Strength: {password_strength(password)}")

            break

        else:
            print("Invalid option. Choose 1 or 2.")

    # CONFIRM PASSWORD
    while True:

        confirm_password = read_password(
            "Confirm Password: ",
            show_password
        )

        if password == confirm_password:
            break

        print("Passwords do not match. Please try again.")

    # HASH PASSWORD BEFORE SAVING
    salt, password_hash = hash_password(password)

    # SAVE ACCOUNT
    try:
        conn.execute("""
            INSERT INTO users (
                full_name,
                email,
                username,
                salt,
                password_hash
            )
            VALUES (?, ?, ?, ?, ?)
        """, (
            full_name,
            email,
            username,
            salt,
            password_hash
        ))

        conn.commit()

        print("\n" + "=" * 45)
        print("✅ ACCOUNT SUCCESSFULLY CREATED!")
        print("=" * 45)

        print(f"Full Name: {full_name}")
        print(f"Email Address: {email}")
        print(f"Username: {username}")

        print("\nYour account has been saved successfully.")
        print("You can now log in with your username and password.")

    except sqlite3.IntegrityError:
        conn.rollback()
        print("\nUnable to create the account.")
        print("That email address or username may already exist.")


# LOGIN

def login(conn):

    print("\n" + "=" * 45)
    print("                   LOGIN")
    print("=" * 45)

    username = input("Enter your Username: ").strip()

    user = conn.execute(
        "SELECT * FROM users WHERE username = ?",
        (username,)
    ).fetchone()

    if user is None:
        print("\n❌ Account not found.")
        print("Please check your username or create an account.")

        return

    show_password = ask_password_visibility()

    password = read_password(
        "Enter your Password: ",
        show_password
    )

    if verify_password(
        password,
        user["salt"],
        user["password_hash"]
    ):

        print("\n" + "=" * 45)
        print("✅ LOGIN SUCCESSFUL!")
        print("=" * 45)

        print(f"Welcome back, {user['full_name']}!")

        print("You have successfully logged in.")

    else:

        print("\n❌ Incorrect password.")
        print("Please check your password and try again.")


# MAIN MENU

def main():

    initialize_database()

    conn = sqlite3.connect(DATABASE_NAME)

    # Allow database results to be accessed by column name.
    conn.row_factory = sqlite3.Row

    print("\n" + "=" * 45)
    print("       PYTHON SIGNUP AND LOGIN SYSTEM")
    print("=" * 45)

    try:

        while True:

            print("\nMAIN MENU")
            print("1. Create a new account")
            print("2. Login to an existing account")
            print("3. Exit")

            choice = input("\nChoose an option (1-3): ").strip()

            if choice == "1":

                create_account(conn)

            elif choice == "2":

                login(conn)

            elif choice == "3":

                print("\nThank you for using the system!")
                print("Goodbye! 👋")
                break

            else:

                print("\nInvalid choice. Please select 1, 2 or 3.")

    except (KeyboardInterrupt, EOFError):

        print("\n\nProgram closed.")

    finally:

        conn.close()


# RUN THE PROGRAM

if __name__ == "__main__":
    main()