import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = os.getenv("DB_NAME", "retailconnect")
FORECAST_API_SECRET = os.getenv("FORECAST_API_SECRET", "rc_forecast_secret_dev_2026")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
PORT = int(os.getenv("PORT", 8000))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Auto-detect if Demo Mode should be active
IS_DEMO_MODE = not bool(MONGODB_URI and MONGODB_URI.startswith("mongodb"))
