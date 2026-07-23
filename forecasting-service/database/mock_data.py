import random
from datetime import datetime, timedelta

TERRITORIES = [
    {"id": "terr_north_01", "name": "North Metro", "code": "DEL-NCR", "soCount": 14, "distributorCount": 5},
    {"id": "terr_south_02", "name": "South Region", "code": "BLR-KA", "soCount": 18, "distributorCount": 7},
    {"id": "terr_east_03", "name": "East Hub", "code": "KOL-WB", "soCount": 12, "distributorCount": 4},
    {"id": "terr_west_04", "name": "West Zone", "code": "MUM-MH", "soCount": 20, "distributorCount": 8},
]

SKUS = [
    {"id": "sku_biscuit_100g", "code": "SKU-BSC-100", "name": "Sunshine Glucose Biscuits 100g", "category": "Biscuits", "price": 10.0, "baseMonthlyDemand": 12000},
    {"id": "sku_biscuit_250g", "code": "SKU-BSC-250", "name": "Sunshine Marie Gold 250g", "category": "Biscuits", "price": 30.0, "baseMonthlyDemand": 8500},
    {"id": "sku_wafer_50g", "code": "SKU-WFR-050", "name": "Crispy Choco Wafers 50g", "category": "Confectionery", "price": 15.0, "baseMonthlyDemand": 15000},
    {"id": "sku_juice_200ml", "code": "SKU-JCE-200", "name": "Real Fresh Mango Juice 200ml", "category": "Beverages", "price": 20.0, "baseMonthlyDemand": 22000},
    {"id": "sku_juice_1l", "code": "SKU-JCE-1000", "name": "Real Fresh Mixed Fruit 1L", "category": "Beverages", "price": 95.0, "baseMonthlyDemand": 6000},
    {"id": "sku_chips_40g", "code": "SKU-CHP-040", "name": "Masala Crunch Potato Chips 40g", "category": "Snacks", "price": 20.0, "baseMonthlyDemand": 18000},
    {"id": "sku_chips_85g", "code": "SKU-CHP-085", "name": "Salted Classic Chips 85g", "category": "Snacks", "price": 40.0, "baseMonthlyDemand": 11000},
    {"id": "sku_noodle_70g", "code": "SKU-NDL-070", "name": "Instant Masala Noodles 70g", "category": "Packaged Food", "price": 14.0, "baseMonthlyDemand": 25000},
    {"id": "sku_noodle_280g", "code": "SKU-NDL-280", "name": "Family Pack Noodles 280g", "category": "Packaged Food", "price": 52.0, "baseMonthlyDemand": 9000},
    {"id": "sku_tea_250g", "code": "SKU-TEA-250", "name": "Premium Assam Leaf Tea 250g", "category": "Beverages", "price": 130.0, "baseMonthlyDemand": 4500},
]

ACTIVE_SCHEMES = [
    {"id": "sch_festive_01", "name": "Festive Stocking Offer", "skuId": "sku_biscuit_100g", "discountPct": 10.0, "boostFactor": 1.25},
    {"id": "sch_beverage_02", "name": "Summer Cooler Scheme", "skuId": "sku_juice_200ml", "discountPct": 8.0, "boostFactor": 1.30},
    {"id": "sch_snack_combo", "name": "Snack Combo Boost", "skuId": "sku_chips_40g", "discountPct": 12.0, "boostFactor": 1.20},
]

def generate_historical_sales(days=365):
    """
    Generates realistic daily secondary sales data with trend, seasonality, and noise.
    """
    records = []
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    random.seed(42) # Deterministic for consistent demo results

    for terr in TERRITORIES:
        for sku in SKUS:
            base_daily = sku["baseMonthlyDemand"] / 30.0
            # Territory volume scale factor
            terr_scale = 1.2 if terr["id"] == "terr_west_04" else (1.1 if terr["id"] == "terr_north_01" else 0.9)
            
            # Check scheme boost
            scheme = next((s for s in ACTIVE_SCHEMES if s["skuId"] == sku["id"]), None)
            scheme_boost = scheme["boostFactor"] if scheme else 1.0

            current = start_date
            day_idx = 0
            while current <= end_date:
                # 1. Weekly seasonality (Higher sales on Monday & Friday)
                dow = current.weekday()
                dow_factor = 1.25 if dow in [0, 4] else (0.75 if dow == 6 else 1.0)
                
                # 2. Month-end stocking spike (days 25 to 30)
                dom = current.day
                dom_factor = 1.35 if dom >= 25 else 0.95
                
                # 3. Overall 15% Annual Growth Trend
                trend_factor = 1.0 + (day_idx / days) * 0.15

                # 4. Random daily variation (+/- 12%)
                noise = random.uniform(0.88, 1.12)

                daily_qty = int(base_daily * terr_scale * dow_factor * dom_factor * trend_factor * scheme_boost * noise)
                daily_val = round(daily_qty * sku["price"], 2)

                records.append({
                    "date": current.strftime("%Y-%m-%d"),
                    "territoryId": terr["id"],
                    "skuId": sku["id"],
                    "skuCode": sku["code"],
                    "skuName": sku["name"],
                    "category": sku["category"],
                    "quantity": daily_qty,
                    "value": daily_val,
                    "unitPrice": sku["price"]
                })

                current += timedelta(days=1)
                day_idx += 1

    return records
