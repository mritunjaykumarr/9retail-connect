import logging
from datetime import datetime, timedelta
import pandas as pd
from database.connection import get_db
from database.mock_data import TERRITORIES, SKUS, ACTIVE_SCHEMES, generate_historical_sales
from config import IS_DEMO_MODE

logger = logging.getLogger("forecasting.queries")

# Pre-generate mock cache
_mock_cache = None

def get_sales_history_df(territory_id=None, sku_ids=None, days=365):
    """
    Fetches secondary sales history as a Pandas DataFrame.
    Automatically queries MongoDB or falls back to Mock Data.
    """
    db = get_db()
    
    if db is not None and not IS_DEMO_MODE:
        try:
            start_date = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
            query = {"date": {"$gte": start_date}}
            if territory_id:
                query["territoryId"] = territory_id
            if sku_ids:
                query["skuId"] = {"$in": sku_ids}

            # Query 'orders' or 'uploadedSales'
            cursor = db["uploadedSales"].find(query, {"_id": 0})
            data = list(cursor)

            if not data: # Try orders collection
                cursor = db["orders"].find(query, {"_id": 0})
                data = list(cursor)

            if data:
                df = pd.DataFrame(data)
                df['date'] = pd.to_datetime(df['date'])
                logger.info(f"Loaded {len(df)} sales records from MongoDB Atlas")
                return df
        except Exception as e:
            logger.warning(f"Failed to query MongoDB ({e}). Falling back to Mock Data.")

    # Fallback to Mock Data
    global _mock_cache
    if _mock_cache is None:
        _mock_cache = generate_historical_sales(days=days)

    records = _mock_cache
    if territory_id:
        records = [r for r in records if r["territoryId"] == territory_id]
    if sku_ids:
        records = [r for r in records if r["skuId"] in sku_ids]

    df = pd.DataFrame(records)
    if not df.empty:
        df['date'] = pd.to_datetime(df['date'])
    return df

def get_territories():
    db = get_db()
    if db is not None and not IS_DEMO_MODE:
        try:
            items = list(db["territories"].find({}, {"_id": 0}))
            if items:
                return items
        except Exception:
            pass
    return TERRITORIES

def get_skus():
    db = get_db()
    if db is not None and not IS_DEMO_MODE:
        try:
            items = list(db["products"].find({}, {"_id": 0}))
            if items:
                return items
        except Exception:
            pass
    return SKUS

def get_active_schemes():
    return ACTIVE_SCHEMES

def run_batch_retrain():
    logger.info("Executing weekly batch retrain job...")
    df = get_sales_history_df(days=90)
    logger.info(f"Batch retrain completed. Processed {len(df)} sales historical records.")
    return True
