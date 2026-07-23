import logging
from config import MONGODB_URI, DB_NAME, IS_DEMO_MODE

logger = logging.getLogger("forecasting.database")
_db_client = None

def get_db():
    global _db_client
    if IS_DEMO_MODE:
        logger.info("Running in DEMO MODE - MongoDB client disabled")
        return None

    if _db_client is None:
        try:
            from pymongo import MongoClient
            _db_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=3000)
            # Ping test
            _db_client.admin.command('ping')
            logger.info("Successfully connected to MongoDB Atlas")
        except Exception as e:
            logger.warning(f"MongoDB connection failed ({e}). Falling back to DEMO MODE.")
            _db_client = None
            return None

    return _db_client[DB_NAME] if _db_client else None
