import os
import smtplib
from dotenv import load_dotenv

load_dotenv()  # Load your .env file

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USERNAME)

print(f"Server: {SMTP_SERVER}")
print(f"Username: {SMTP_USERNAME}")
print(f"Password length: {len(SMTP_PASSWORD)}")  # Should be 16

try:
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(SMTP_USERNAME, SMTP_PASSWORD)
    print("✅ Login successful!")
    server.quit()
except Exception as e:
    print(f"❌ Login failed: {e}")