import qrcode
from pathlib import Path

# Description: It generates a QR code that links to my GitHub profile.
# Author: Nuel_Nexus
# Output: images/github_qr.png

# Github profile URL
GITHUB_URL = "https://github.com/Nuel0077"

# Get the directory containing this python file
PROJECT_DIR = Path(__file__).resolve().parent

# Create the images folder if it doesn't exist
IMAGES_DIR = PROJECT_DIR / 'images'
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Set the output image path
OUTPUT_FILE = IMAGES_DIR / 'github_qr.png'

def generate_qr_code():
    """Generate and save the GitHub QR code."""

    # Create the QR code
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )

    # Add the GitHub URL 
    qr.add_data(GITHUB_URL)

    # Automatically choose the appropriate QR code size
    qr.make(fit=True)

    # Create the QR code image
    qr_image = qr.make_image(
        fill_color='black',
        back_color='white',
    )

    # Save the image as a PNG file
    qr_image.save(OUTPUT_FILE)

    print('\n' + '=' * 45)
    print('     QR CODE GENERATOR')
    print('=' * 45)

    print('\nQR code generated successfully!')

    print(f'\nGitHub Profile: {GITHUB_URL}')
    print(f'Image saved to: {OUTPUT_FILE}')

    print('\nScan the PNG image with your phone camera.')
    print('=' * 45)

# Run the program
if __name__ == '__main__':
    generate_qr_code()
