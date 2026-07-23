import math

class TargetGenerator:
    """
    Auto-generates recommended monthly sales targets for Sales Officers (SOs)
    and Distributors based on forecasted demand and territory scaling.
    """

    @staticmethod
    def generate_so_targets(territory_id, territory_name, predicted_skus, so_count=14):
        """
        Distributes forecasted territory demand across Sales Officers with growth stretch targets.
        """
        total_forecast_val = sum(p["predictedValue"] for p in predicted_skus)
        total_forecast_qty = sum(p["predictedQty"] for p in predicted_skus)

        # Stretch target (+8% growth incentive factor)
        stretch_multiplier = 1.08
        so_count = max(1, so_count)

        target_val_per_so = round((total_forecast_val * stretch_multiplier) / so_count, 2)
        target_qty_per_so = math.ceil((total_forecast_qty * stretch_multiplier) / so_count)

        so_targets = []
        for i in range(1, so_count + 1):
            so_id = f"so_{territory_id}_{i:02d}"
            so_name = f"Sales Officer {i} ({territory_name})"
            
            # Slight individual weighting per SO route capacity (+/- 5%)
            capacity_weight = 0.95 + ((i * 7) % 11) * 0.01
            indiv_val = round(target_val_per_so * capacity_weight, 2)
            indiv_qty = math.ceil(target_qty_per_so * capacity_weight)

            so_targets.append({
                "soId": so_id,
                "soName": so_name,
                "monthlyTargetValue": indiv_val,
                "monthlyTargetQty": indiv_qty,
                "dailyTargetQty": math.ceil(indiv_qty / 26), # 26 working days
                "stretchFactorPct": 8.0,
                "recommendedBeatsPerWeek": 5
            })

        return {
            "territoryId": territory_id,
            "totalTerritoryTargetVal": round(sum(s["monthlyTargetValue"] for s in so_targets), 2),
            "totalTerritoryTargetQty": sum(s["monthlyTargetQty"] for s in so_targets),
            "salesOfficerCount": so_count,
            "soTargets": so_targets
        }
